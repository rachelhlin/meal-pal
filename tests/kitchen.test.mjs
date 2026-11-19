import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ApolloServer } from '@apollo/server';

// tiny in-memory stand-in for the prisma calls the kitchen service makes
function table() {
  const rows = [];
  let nextId = 1;
  const matches = (row, where = {}) =>
    Object.entries(where).every(([k, v]) =>
      v && typeof v === 'object' && 'in' in v
        ? v.in.includes(row[k])
        : row[k] === v
    );
  return {
    rows,
    findMany: async ({ where } = {}) =>
      rows
        .filter((r) => matches(r, where))
        .sort((a, b) =>
          a.checked === b.checked ? a.id - b.id : a.checked ? 1 : -1
        ),
    findUnique: async ({ where }) =>
      rows.find((r) => matches(r, where)) ?? null,
    count: async ({ where } = {}) =>
      rows.filter((r) => matches(r, where)).length,
    createMany: async ({ data }) => {
      let count = 0;
      for (const d of data) {
        if (rows.some((r) => r.userId === d.userId && r.key === d.key))
          continue; // unique(userId, key)
        rows.push({
          id: nextId++,
          checked: false,
          createdAt: new Date(),
          ...d,
        });
        count++;
      }
      return { count };
    },
    updateMany: async ({ where, data }) => {
      const hit = rows.filter((r) => matches(r, where));
      hit.forEach((r) => Object.assign(r, data));
      return { count: hit.length };
    },
    deleteMany: async ({ where }) => {
      const before = rows.length;
      for (let i = rows.length - 1; i >= 0; i--)
        if (matches(rows[i], where)) rows.splice(i, 1);
      return { count: before - rows.length };
    },
  };
}

const recipes = table();
await recipes.createMany({
  data: [
    {
      title: 'Pancakes',
      ingredients: '1 cup flour\n1 cup milk\n2 eggs\n1 tsp baking powder\nsalt',
      instructions: 'mix',
      authorId: null,
    },
  ],
});
recipes.rows.forEach((r) => (r.userId = undefined));

globalThis.prisma = {
  recipe: recipes,
  pantryItem: table(),
  groceryItem: table(),
  review: {
    findMany: async () => [],
    aggregate: async () => ({ _avg: { rating: null }, _count: { rating: 0 } }),
  },
  user: { findUnique: async () => null },
  $transaction: async (ops) => Promise.all(ops),
};

const { default: typeDefs } = await import(
  '../app/(api)/_datalib/_typeDefs/index.js'
);
const { default: resolvers } = await import(
  '../app/(api)/_datalib/_resolvers/index.js'
);
const server = new ApolloServer({ typeDefs, resolvers });

async function gql(query, variables = {}, userId = 'alice') {
  const res = await server.executeOperation(
    { query, variables },
    { contextValue: { userId } }
  );
  return res.body.singleResult;
}
const LIST = '{ myGroceryList { id name checked recipe { title } } }';

test('signed-out users are rejected', async () => {
  const r = await gql('{ myPantry { name } }', {}, null);
  assert.equal(r.errors[0].extensions.code, 'UNAUTHENTICATED');
});

test('pantry saves cleaned-up names and ignores duplicates', async () => {
  const r = await gql(
    'mutation($n:[String!]!){ addPantryItems(names:$n){ name } }',
    { n: ['Eggs', '3 large eggs', ' Milk ', ''] }
  );
  assert.deepEqual(
    r.data.addPantryItems.map((i) => i.name),
    ['egg', 'milk']
  );
});

test('pantry is per user', async () => {
  const r = await gql('{ myPantry { name } }', {}, 'bob');
  assert.deepEqual(r.data.myPantry, []);
});

test('missing recipe ingredients go on the grocery list, skipping what you have', async () => {
  const r = await gql(
    'mutation{ addMissingToGroceryList(recipeId:"1"){ added items { name recipe { title } } } }'
  );
  const out = r.data.addMissingToGroceryList;
  // has eggs + milk, salt counts as a staple
  assert.equal(out.added, 2);
  assert.deepEqual(
    out.items.map((i) => i.name),
    ['1 cup flour', '1 tsp baking powder']
  );
  assert.equal(out.items[0].recipe.title, 'Pancakes');
});

test('adding the same thing again merges instead of duplicating', async () => {
  const r = await gql(
    'mutation($n:[String!]!){ addGroceryItems(names:$n){ added items { name } } }',
    { n: ['2 cups flour', 'butter'] }
  );
  assert.equal(r.data.addGroceryItems.added, 1);
  assert.equal(r.data.addGroceryItems.items.length, 3);
});

test("you can't tick off or delete someone else's item", async () => {
  const [first] = (await gql(LIST)).data.myGroceryList;
  const tick = await gql(
    'mutation($id:ID!){ setGroceryChecked(id:$id, checked:true){ id } }',
    { id: first.id },
    'bob'
  );
  assert.match(tick.errors[0].message, /not found/);
  const del = await gql(
    'mutation($id:ID!){ removeGroceryItem(id:$id) }',
    { id: first.id },
    'bob'
  );
  assert.match(del.errors[0].message, /not found/);
  assert.equal((await gql(LIST)).data.myGroceryList.length, 3);
});

test('checked items move to the pantry and off the list', async () => {
  const items = (await gql(LIST)).data.myGroceryList;
  const flour = items.find((i) => i.name === '1 cup flour');
  await gql(
    'mutation($id:ID!){ setGroceryChecked(id:$id, checked:true){ checked } }',
    { id: flour.id }
  );
  const moved = await gql('mutation{ moveCheckedToPantry }');
  assert.equal(moved.data.moveCheckedToPantry, 1);
  const pantry = (await gql('{ myPantry { name } }')).data.myPantry.map(
    (p) => p.name
  );
  assert.ok(pantry.includes('flour'));
  assert.equal((await gql(LIST)).data.myGroceryList.length, 2);
});

test('re-adding a ticked item puts it back on the list', async () => {
  const butter = (await gql(LIST)).data.myGroceryList.find(
    (i) => i.name === 'butter'
  );
  await gql(
    'mutation($id:ID!){ setGroceryChecked(id:$id, checked:true){ checked } }',
    { id: butter.id }
  );
  await gql('mutation($n:[String!]!){ addGroceryItems(names:$n){ added } }', {
    n: ['Butter'],
  });
  const again = (await gql(LIST)).data.myGroceryList.find(
    (i) => i.name === 'butter'
  );
  assert.equal(again.checked, false);
});

test('rejects huge batches', async () => {
  const r = await gql(
    'mutation($n:[String!]!){ addPantryItems(names:$n){ name } }',
    { n: Array(51).fill('x') }
  );
  assert.match(r.errors[0].message, /at most 50/);
});
