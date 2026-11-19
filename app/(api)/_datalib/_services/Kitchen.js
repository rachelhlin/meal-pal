import prisma from '../_prisma/client.js';
import { matchRecipe, normalizeIngredient } from '../_utils/ingredients.js';
import { badInput, toId } from '../_utils/validation.js';

const MAX_ITEMS = 200; // per list, per user
const MAX_PER_CALL = 50;
const MAX_NAME = 100;

// "3 Large Eggs", "eggs " -> [{ name, key: 'egg' }], deduped by key
export function toItems(names, { nameFromKey = false } = {}) {
  if (names.length > MAX_PER_CALL)
    throw badInput(`Add at most ${MAX_PER_CALL} items at a time`);
  const seen = new Set();
  const items = [];
  for (const raw of names) {
    const text = String(raw).trim().slice(0, MAX_NAME);
    const key = normalizeIngredient(text);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    items.push({ name: nameFromKey ? key : text, key });
  }
  return items;
}

async function assertRoom(model, userId, adding) {
  const count = await prisma[model].count({ where: { userId } });
  if (count + adding > MAX_ITEMS)
    throw badInput(`Lists can hold up to ${MAX_ITEMS} items`);
}

export default class Kitchen {
  // pantry

  static listPantry(userId) {
    return prisma.pantryItem.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
    });
  }

  static async addPantry(userId, names) {
    // pantry chips show the cleaned-up name, so "3 Large Eggs" becomes "egg"
    const items = toItems(names, { nameFromKey: true });
    if (items.length) {
      await assertRoom('pantryItem', userId, items.length);
      await prisma.pantryItem.createMany({
        data: items.map((i) => ({ ...i, userId })),
        skipDuplicates: true,
      });
    }
    return Kitchen.listPantry(userId);
  }

  static async removePantry(userId, name) {
    const key = normalizeIngredient(name);
    if (key) await prisma.pantryItem.deleteMany({ where: { userId, key } });
    return true;
  }

  static async clearPantry(userId) {
    await prisma.pantryItem.deleteMany({ where: { userId } });
    return true;
  }

  // grocery list

  static listGroceries(userId) {
    return prisma.groceryItem.findMany({
      where: { userId },
      orderBy: [{ checked: 'asc' }, { createdAt: 'asc' }],
    });
  }

  static async addGroceries(userId, names, recipeId = null) {
    const rid = recipeId == null ? null : toId(recipeId);
    if (rid && !(await prisma.recipe.findUnique({ where: { id: rid } })))
      throw badInput('Recipe not found');

    const items = toItems(names);
    let added = 0;
    if (items.length) {
      await assertRoom('groceryItem', userId, items.length);
      const res = await prisma.groceryItem.createMany({
        data: items.map((i) => ({ ...i, userId, recipeId: rid })),
        skipDuplicates: true,
      });
      added = res.count;
      // already on the list but ticked off? put it back on
      await prisma.groceryItem.updateMany({
        where: { userId, key: { in: items.map((i) => i.key) }, checked: true },
        data: { checked: false },
      });
    }
    return { added, items: await Kitchen.listGroceries(userId) };
  }

  // compares the recipe to the saved pantry, salt/oil etc count as owned
  static async addMissingFromRecipe(userId, recipeId) {
    const recipe = await prisma.recipe.findUnique({
      where: { id: toId(recipeId) },
    });
    if (!recipe) throw badInput('Recipe not found');
    const pantry = await Kitchen.listPantry(userId);
    const { missing } = matchRecipe(
      recipe,
      pantry.map((p) => p.key)
    );
    return Kitchen.addGroceries(userId, missing, recipe.id);
  }

  static async setChecked(userId, id, checked) {
    // userId in the where clause is the ownership check
    const res = await prisma.groceryItem.updateMany({
      where: { id: toId(id), userId },
      data: { checked },
    });
    if (res.count === 0) throw badInput('Item not found');
    return prisma.groceryItem.findUnique({ where: { id: toId(id) } });
  }

  static async removeGrocery(userId, id) {
    const res = await prisma.groceryItem.deleteMany({
      where: { id: toId(id), userId },
    });
    if (res.count === 0) throw badInput('Item not found');
    return true;
  }

  static async clearChecked(userId) {
    const res = await prisma.groceryItem.deleteMany({
      where: { userId, checked: true },
    });
    return res.count;
  }

  // done shopping: ticked items go into the pantry and off the list
  static async moveCheckedToPantry(userId) {
    const checked = await prisma.groceryItem.findMany({
      where: { userId, checked: true },
    });
    if (checked.length === 0) return 0;
    const existing = await prisma.pantryItem.count({ where: { userId } });
    if (existing + checked.length > MAX_ITEMS)
      throw badInput(`Your kitchen can hold up to ${MAX_ITEMS} items`);

    await prisma.$transaction([
      prisma.pantryItem.createMany({
        data: checked.map((g) => ({ userId, name: g.key, key: g.key })),
        skipDuplicates: true,
      }),
      prisma.groceryItem.deleteMany({ where: { userId, checked: true } }),
    ]);
    return checked.length;
  }
}
