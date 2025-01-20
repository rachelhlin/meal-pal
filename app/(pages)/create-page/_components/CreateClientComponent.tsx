'use client';

import { gql } from 'graphql-tag';
import { useState } from 'react';

import sendApolloRequest from '@utils/sendApolloRequest';

const mutation = gql`
  mutation CreateRecipeMutation($title: String!, $ingredients: String!, $instructions: String!) {
    createRecipe(input: { title: $title, ingredients: $ingredients, instructions: $instructions }) {
      id
      title
      ingredients
      instructions
    }
  }
`;

export default function CreateRecipeClientComponent() {
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [createdRecipe, setCreatedRecipe] = useState(null);

  const handleCreateRecipe = async (event: React.FormEvent) => {
    event.preventDefault();

    const variables = {
      title,
      ingredients,
      instructions,
    };

    try {
      const res = await sendApolloRequest(mutation, variables);
      setCreatedRecipe(res.createRecipe);

      setTitle('');
      setIngredients('');
      setInstructions('');
    } catch (error) {
      console.error('Error creating recipe:', error);
    }
  };

  return (
    <div>
      <h1>Create a New Recipe</h1>

      <form onSubmit={handleCreateRecipe}>
        <div>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="ingredients">Ingredients</label>
          <textarea
            id="ingredients"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="instructions">Instructions</label>
          <textarea
            id="instructions"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            required
          />
        </div>

        <button type="submit">Create Recipe</button>
      </form>

      {createdRecipe && (
        <div>
          <h2>Recipe Created</h2>
          <pre>{JSON.stringify(createdRecipe, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
