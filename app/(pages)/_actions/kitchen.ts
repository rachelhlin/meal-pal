'use server';

import gql from 'graphql-tag';
import { revalidatePath } from 'next/cache';

import gqlRequest from '../_utils/gqlRequest';
import type { GroceryItem } from '../_utils/types';

type Result<T> = { ok: true; data: T } | { ok: false; error: string };

// return errors instead of throwing so client components can show them
async function run<T>(fn: () => Promise<T>): Promise<Result<T>> {
  try {
    const data = await fn();
    revalidatePath('/', 'layout');
    return { ok: true, data };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : 'Something went wrong',
    };
  }
}

const GROCERY_FIELDS = `
  id
  name
  checked
  recipe {
    id
    title
  }
`;

export async function savePantryItemsAction(names: string[]) {
  return run(async () => {
    const q = gql`
      mutation ($names: [String!]!) {
        addPantryItems(names: $names) {
          name
        }
      }
    `;
    const data = await gqlRequest<{ addPantryItems: { name: string }[] }>(q, {
      names,
    });
    return data.addPantryItems.map((p) => p.name);
  });
}

export async function removePantryItemAction(name: string) {
  return run(() =>
    gqlRequest(
      gql`
        mutation ($name: String!) {
          removePantryItem(name: $name)
        }
      `,
      { name }
    )
  );
}

export async function addGroceryItemsAction(
  names: string[],
  recipeId?: string
) {
  return run(async () => {
    const q = gql`
      mutation ($names: [String!]!, $recipeId: ID) {
        addGroceryItems(names: $names, recipeId: $recipeId) {
          added
          items { ${GROCERY_FIELDS} }
        }
      }
    `;
    return (
      await gqlRequest<{
        addGroceryItems: { added: number; items: GroceryItem[] };
      }>(q, { names, recipeId })
    ).addGroceryItems;
  });
}

export async function addMissingToListAction(recipeId: string) {
  return run(async () => {
    const q = gql`
      mutation ($recipeId: ID!) {
        addMissingToGroceryList(recipeId: $recipeId) {
          added
        }
      }
    `;
    return (
      await gqlRequest<{ addMissingToGroceryList: { added: number } }>(q, {
        recipeId,
      })
    ).addMissingToGroceryList;
  });
}

export async function setGroceryCheckedAction(id: string, checked: boolean) {
  return run(() =>
    gqlRequest(
      gql`
        mutation ($id: ID!, $checked: Boolean!) {
          setGroceryChecked(id: $id, checked: $checked) {
            id
          }
        }
      `,
      { id, checked }
    )
  );
}

export async function removeGroceryItemAction(id: string) {
  return run(() =>
    gqlRequest(
      gql`
        mutation ($id: ID!) {
          removeGroceryItem(id: $id)
        }
      `,
      { id }
    )
  );
}

export async function clearCheckedAction() {
  return run(async () => {
    const q = gql`
      mutation {
        clearCheckedGroceries
      }
    `;
    return (await gqlRequest<{ clearCheckedGroceries: number }>(q))
      .clearCheckedGroceries;
  });
}

export async function moveCheckedToPantryAction() {
  return run(async () => {
    const q = gql`
      mutation {
        moveCheckedToPantry
      }
    `;
    return (await gqlRequest<{ moveCheckedToPantry: number }>(q))
      .moveCheckedToPantry;
  });
}
