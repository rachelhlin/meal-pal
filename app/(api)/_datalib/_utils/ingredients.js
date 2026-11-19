// plain ingredient matching, no ai

const UNITS = new Set(
  `cup cups c tbsp tablespoon tablespoons tsp teaspoon teaspoons oz ounce ounces lb lbs pound pounds
   g gram grams kg ml l liter liters litre clove cloves can cans jar jars package packages pkg
   pinch dash handful slice slices piece pieces stick sticks bunch head heads sprig sprigs quart pint`.split(
    /\s+/
  )
);
const DESCRIPTORS = new Set(
  `fresh freshly chopped diced minced sliced grated shredded large small medium whole ground
   finely roughly thinly crushed peeled softened melted cold warm hot room temperature to taste
   optional of and or a an the for about plus extra divided packed raw cooked boneless skinless`.split(
    /\s+/
  )
);

// assume everyone has these, otherwise every recipe is "missing salt"
const STAPLES = new Set([
  'salt',
  'pepper',
  'black pepper',
  'water',
  'oil',
  'olive oil',
  'vegetable oil',
]);

function singular(word) {
  if (word.length <= 3 || word.endsWith('ss')) return word;
  if (word.endsWith('ies')) return word.slice(0, -3) + 'y'; // berries -> berry
  if (/(oes|ches|shes|xes)$/.test(word)) return word.slice(0, -2); // tomatoes -> tomato
  if (word.endsWith('s')) return word.slice(0, -1); // eggs -> egg
  return word;
}

// "2 cups finely chopped Roma tomatoes (about 3)" -> "roma tomato"
export function normalizeIngredient(text) {
  const words = String(text)
    .toLowerCase()
    .replace(/\(.*?\)/g, ' ')
    .replace(/[^a-z\s-]/g, ' ')
    .split(/[\s-]+/)
    .filter((w) => w && !UNITS.has(w) && !DESCRIPTORS.has(w))
    .map(singular);
  return words.join(' ').trim();
}

export function parseIngredientLines(text) {
  return String(text)
    .split('\n')
    .map((line) => line.replace(/^\s*([-*•]|\d+[.)])\s*/, '').trim())
    .filter(Boolean)
    .map((original) => ({ original, key: normalizeIngredient(original) }))
    .filter((item) => item.key);
}

export function parsePantry(items) {
  const keys = items
    .flatMap((item) => String(item).split(/[,\n]/))
    .map(normalizeIngredient)
    .filter(Boolean);
  return [...new Set(keys)];
}

// whole words only, so "tomato" matches "roma tomato" but "egg" doesn't match "eggplant"
function covers(pantryKey, ingredientKey) {
  const p = pantryKey.split(' ');
  const i = ingredientKey.split(' ');
  const contains = (outer, inner) => inner.every((w) => outer.includes(w));
  return contains(i, p) || contains(p, i);
}

export function matchRecipe(recipe, pantryKeys) {
  const matched = [];
  const missing = [];
  let fromPantry = 0; // not counting staples
  for (const item of parseIngredientLines(recipe.ingredients)) {
    const inPantry = pantryKeys.some((p) => covers(p, item.key));
    if (inPantry) fromPantry++;
    (inPantry || STAPLES.has(item.key) ? matched : missing).push(item.original);
  }
  const total = matched.length + missing.length;
  return {
    matched,
    missing,
    fromPantry,
    score: total ? matched.length / total : 0,
  };
}

export function rankRecipes(recipes, pantryKeys, limit = 8) {
  return (
    recipes
      .map((recipe) => ({ recipe, ...matchRecipe(recipe, pantryKeys) }))
      // matching only on salt/oil isn't a real match
      .filter((m) => m.fromPantry > 0)
      .sort((a, b) => b.score - a.score || a.missing.length - b.missing.length)
      .slice(0, limit)
  );
}
