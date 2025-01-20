'use client';

import { gql } from 'graphql-tag';
import { useState } from 'react';
import styles from './Create.module.scss';

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

export default function Create() {
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
    <div className={styles.container}>
      <h1 className={styles.heading}>Create a New Recipe</h1>

      <form onSubmit={handleCreateRecipe} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="title" className={styles.label}>Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="ingredients" className={styles.label}>Ingredients</label>
          <textarea
            id="ingredients"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            required
            className={styles.textarea}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="instructions" className={styles.label}>Instructions</label>
          <textarea
            id="instructions"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            required
            className={styles.textarea}
          />
        </div>

        <button type="submit" className={styles.submitButton}>Create Recipe</button>
      </form>

      {createdRecipe && (
        <div className={styles.createdRecipe}>
          <h2 className={styles.createdHeading}>Recipe Created</h2>
          <pre className={styles.createdRecipeDetails}>{JSON.stringify(createdRecipe, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
