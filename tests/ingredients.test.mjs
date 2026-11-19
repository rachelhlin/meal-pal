import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  normalizeIngredient,
  parsePantry,
  matchRecipe,
  rankRecipes,
} from '../app/(api)/_datalib/_utils/ingredients.js';
import { sanitize } from '../app/(api)/_datalib/_ai/pantryAssistant.js';

test('normalizeIngredient strips quantities, units and prep words', () => {
  assert.equal(
    normalizeIngredient('2 cups finely chopped Roma tomatoes (about 3)'),
    'roma tomato'
  );
  assert.equal(normalizeIngredient('1/2 tsp ground cinnamon'), 'cinnamon');
  assert.equal(normalizeIngredient('3 large eggs'), 'egg');
  assert.equal(
    normalizeIngredient('- 1 lb boneless skinless chicken breasts'),
    'chicken breast'
  );
  assert.equal(normalizeIngredient('Fresh berries'), 'berry');
});

test('parsePantry splits commas and newlines and dedupes', () => {
  assert.deepEqual(parsePantry(['Eggs, egg\nFlour', '  ']), ['egg', 'flour']);
});

test('matching uses whole words, so egg does not match eggplant', () => {
  const recipe = { ingredients: '1 eggplant\n2 eggs' };
  const { matched, missing } = matchRecipe(recipe, ['egg']);
  assert.deepEqual(matched, ['2 eggs']);
  assert.deepEqual(missing, ['1 eggplant']);
});

test('general pantry items cover specific ingredients', () => {
  const { missing } = matchRecipe(
    { ingredients: '2 roma tomatoes\n1 cup basmati rice' },
    ['tomato', 'rice']
  );
  assert.deepEqual(missing, []);
});

test('staples like salt and water count as owned', () => {
  const { score } = matchRecipe({ ingredients: 'salt\nwater\n1 cup pasta' }, [
    'pasta',
  ]);
  assert.equal(score, 1);
});

test('recipes matching only on staples are not recommended', () => {
  const ranked = rankRecipes(
    [{ id: 1, ingredients: 'eggplant\nsalt\nolive oil' }],
    ['bread']
  );
  assert.equal(ranked.length, 0);
});

test('rankRecipes orders by share owned and drops zero matches', () => {
  const recipes = [
    { id: 1, ingredients: 'pasta\ntomato\nbasil\nparmesan' },
    { id: 2, ingredients: 'pasta\ntomato' },
    { id: 3, ingredients: 'beef\nonion' },
  ];
  const ranked = rankRecipes(recipes, ['pasta', 'tomato']);
  assert.deepEqual(
    ranked.map((r) => r.recipe.id),
    [2, 1]
  );
});

test('sanitize drops invented ids, duplicates, and substitutions for non-missing items', () => {
  const candidates = [
    { id: 7, title: 'Soup', matched: ['onion'], missing: ['Heavy cream'] },
  ];
  const picks = sanitize(
    [
      { recipeId: '999', reason: 'made up', substitutions: [] },
      {
        recipeId: '7',
        reason: 'Good fit',
        substitutions: [
          { missing: 'heavy cream', suggestion: 'milk plus butter' },
          { missing: 'onion', suggestion: 'shallot' },
        ],
      },
      { recipeId: '7', reason: 'duplicate', substitutions: [] },
    ],
    candidates
  );
  assert.equal(picks.length, 1);
  assert.deepEqual(picks[0].substitutions, [
    { missing: 'Heavy cream', suggestion: 'milk plus butter' },
  ]);
});
