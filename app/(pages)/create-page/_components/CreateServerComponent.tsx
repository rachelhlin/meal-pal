import { NextApiRequest, NextApiResponse } from 'next';
import { gql } from 'graphql-tag';
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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { title, ingredients, instructions } = req.body;

    const variables = { title, ingredients, instructions };

    try {
      const response = await sendApolloRequest(mutation, variables);
      res.status(200).json(response.createRecipe);
    } catch (error) {
      console.error('Error creating recipe:', error);
      res.status(500).json({ error: 'Failed to create recipe' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
