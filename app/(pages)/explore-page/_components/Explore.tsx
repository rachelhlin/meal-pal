'use client';

import { gql } from 'graphql-tag';
import { useState, useEffect } from 'react';

import sendApolloRequest from '@utils/sendApolloRequest';
import styles from './Explore.module.scss';

const query = gql`
  query {
    recipes {
      id
      title
      ingredients
      instructions
    }
  }
`;

export default function ExampleClientComponent() {
  const [recipes, setRecipes] = useState(null);

  // Fetch recipes when the component mounts
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await sendApolloRequest(query);
        setRecipes(res.data.recipes);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };

    fetchRecipes();
  }, []);

  return (
    <div className={styles['client-component']}>
      <h1>Explore Recipes!</h1>
      {recipes ? (
        <div className={styles['recipe-grid']}>
          {recipes.map((recipe) => (
            <div key={recipe.id} className={styles['recipe-card']}>
              <h2>{recipe.title}</h2>
              <p><strong>Ingredients:</strong> {recipe.ingredients}</p>
              <p><strong>Instructions:</strong> {recipe.instructions}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className={styles['no-recipes']}>No recipes found.</p>
      )}
    </div>
  );
}
