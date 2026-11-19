// checks if the right recipe comes up first / in the top 3 for some test pantries
//   npm run eval           matching only
//   npm run eval -- --ai   matching + ai rerank (needs ANTHROPIC_API_KEY)
import { readFile } from 'node:fs/promises';

import {
  parsePantry,
  rankRecipes,
} from '../../app/(api)/_datalib/_utils/ingredients.js';
import { suggestWithAi } from '../../app/(api)/_datalib/_ai/pantryAssistant.js';

const useAi = process.argv.includes('--ai');
if (useAi && !process.env.ANTHROPIC_API_KEY) {
  console.error('Set ANTHROPIC_API_KEY to run with --ai');
  process.exit(1);
}

const { recipes, cases } = JSON.parse(
  await readFile(new URL('./fixtures.json', import.meta.url), 'utf8')
);

async function evaluate(rankFn) {
  let top1 = 0;
  let top3 = 0;
  for (const c of cases) {
    const ids = await rankFn(c);
    const pos = ids.indexOf(c.expected);
    if (pos === 0) top1++;
    if (pos >= 0 && pos < 3) top3++;
    const mark = pos === 0 ? 'ok  ' : pos > 0 && pos < 3 ? 'top3' : 'MISS';
    console.log(
      `  ${mark} [${c.pantry.join(', ')}] -> ${
        ids.slice(0, 3).join(', ') || '(none)'
      } (want ${c.expected})`
    );
  }
  const pct = (n) => `${Math.round((n / cases.length) * 100)}%`;
  console.log(
    `  top-1: ${pct(top1)}   top-3: ${pct(top3)}   (${cases.length} cases)\n`
  );
}

const matchOnly = async (c) =>
  rankRecipes(recipes, parsePantry(c.pantry)).map((m) => m.recipe.id);

console.log('Ingredient matching:');
await evaluate(matchOnly);

if (useAi) {
  console.log('Matching + AI rerank:');
  await evaluate(async (c) => {
    const pantry = parsePantry(c.pantry);
    const ranked = rankRecipes(recipes, pantry);
    const picks = await suggestWithAi({
      pantry,
      candidates: ranked.map((m) => ({
        id: m.recipe.id,
        title: m.recipe.title,
        matched: m.matched,
        missing: m.missing,
      })),
    });
    const picked = picks.map((p) => Number(p.recipeId));
    return [
      ...picked,
      ...ranked.map((m) => m.recipe.id).filter((id) => !picked.includes(id)),
    ];
  });
}
