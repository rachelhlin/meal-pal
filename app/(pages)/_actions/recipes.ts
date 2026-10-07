'use server';

import gql from 'graphql-tag';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import gqlRequest from '../_utils/gqlRequest';

export interface FormState {
  error?: string;
  success?: boolean;
}

const CREATE_RECIPE = gql`
  mutation CreateRecipe($input: RecipeInput!) {
    createRecipe(input: $input) {
      id
    }
  }
`;

const UPDATE_RECIPE = gql`
  mutation UpdateRecipe($id: ID!, $input: RecipeInput!) {
    updateRecipe(id: $id, input: $input) {
      id
    }
  }
`;

const DELETE_RECIPE = gql`
  mutation DeleteRecipe($id: ID!) {
    deleteRecipe(id: $id)
  }
`;

const CREATE_REVIEW = gql`
  mutation CreateReview($input: ReviewInput!) {
    createReview(input: $input) {
      id
    }
  }
`;

const DELETE_REVIEW = gql`
  mutation DeleteReview($id: ID!) {
    deleteReview(id: $id)
  }
`;

const field = (data: FormData, key: string) => String(data.get(key) ?? '');
const messageOf = (e: unknown) =>
  e instanceof Error ? e.message : 'Something went wrong';
const recipeInput = (formData: FormData) => ({
  title: field(formData, 'title'),
  ingredients: field(formData, 'ingredients'),
  instructions: field(formData, 'instructions'),
});

// Clears the client-side router cache so lists/pages don't show stale data.
const refreshAll = () => revalidatePath('/', 'layout');

export async function createRecipeAction(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  let id: string;
  try {
    const data = await gqlRequest<{ createRecipe: { id: string } }>(
      CREATE_RECIPE,
      {
        input: recipeInput(formData),
      }
    );
    id = data.createRecipe.id;
  } catch (e) {
    return { error: messageOf(e) };
  }
  refreshAll();
  redirect(`/recipes/${id}`);
}

export async function updateRecipeAction(
  id: string,
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    await gqlRequest(UPDATE_RECIPE, { id, input: recipeInput(formData) });
  } catch (e) {
    return { error: messageOf(e) };
  }
  refreshAll();
  redirect(`/recipes/${id}`);
}

export async function deleteRecipeAction(id: string): Promise<void> {
  await gqlRequest(DELETE_RECIPE, { id });
  refreshAll();
  redirect('/explore');
}

export async function createReviewAction(
  recipeId: string,
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    await gqlRequest(CREATE_REVIEW, {
      input: {
        recipeId,
        rating: Number(field(formData, 'rating')),
        comment: field(formData, 'comment'),
      },
    });
  } catch (e) {
    return { error: messageOf(e) };
  }
  refreshAll();
  return { success: true };
}

export async function deleteReviewAction(id: string): Promise<void> {
  await gqlRequest(DELETE_REVIEW, { id });
  refreshAll();
}
