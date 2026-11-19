import prisma from '../_prisma/client.js';
import { isAiConfigured, suggestWithAi } from '../_ai/pantryAssistant.js';
import { parsePantry, rankRecipes } from '../_utils/ingredients.js';
import { badInput } from '../_utils/validation.js';

const DAILY_LIMIT = Number(process.env.AI_DAILY_LIMIT) || 20;
const MAX_ITEMS = 40;

// upsert + increment is one query, so spamming requests can't get around the limit
async function takeAiQuota(userId) {
  const day = new Date().toISOString().slice(0, 10);
  const usage = await prisma.aiUsage.upsert({
    where: { userId_day: { userId, day } },
    create: { userId, day, count: 1 },
    update: { count: { increment: 1 } },
  });
  return usage.count <= DAILY_LIMIT;
}

export default class Recommendations {
  static async forPantry({ ingredients, useAi, userId }) {
    if (ingredients.length > MAX_ITEMS)
      throw badInput(`Enter at most ${MAX_ITEMS} ingredients`);
    const pantry = parsePantry(ingredients.map((i) => String(i).slice(0, 60)));
    if (pantry.length === 0) throw badInput('Enter at least one ingredient');

    // TODO: loads every recipe. fine for now, but needs to move into the db
    // (ingredients table or pgvector) if there are ever a lot of recipes
    const recipes = await prisma.recipe.findMany({
      select: {
        id: true,
        title: true,
        ingredients: true,
        instructions: true,
        createdAt: true,
        updatedAt: true,
        authorId: true,
      },
    });
    const ranked = rankRecipes(recipes, pantry);
    const base = ranked.map((m) => ({ ...m, reason: null, substitutions: [] }));

    // matches always work, ai is just extra on top
    const result = (matches, aiUsed, aiNote = null) => ({
      pantry,
      matches,
      aiUsed,
      aiNote,
    });

    if (!useAi || ranked.length === 0) return result(base, false);
    if (!userId)
      return result(base, false, 'Sign in to get AI tips and substitutions.');
    if (!isAiConfigured())
      return result(base, false, 'AI tips are not set up on this server.');
    if (!(await takeAiQuota(userId))) {
      return result(
        base,
        false,
        `You've used today's ${DAILY_LIMIT} AI suggestions. Matching still works.`
      );
    }

    try {
      const picks = await suggestWithAi({
        pantry,
        candidates: ranked.map((m) => ({
          id: m.recipe.id,
          title: m.recipe.title,
          matched: m.matched,
          missing: m.missing,
        })),
      });
      const byId = new Map(base.map((m) => [String(m.recipe.id), m]));
      // keep anything the model skipped at the end so results don't vanish
      const ordered = picks.map((p) => ({
        ...byId.get(p.recipeId),
        reason: p.reason,
        substitutions: p.substitutions,
      }));
      const picked = new Set(picks.map((p) => p.recipeId));
      const rest = base.filter((m) => !picked.has(String(m.recipe.id)));
      return result([...ordered, ...rest], true);
    } catch (error) {
      console.error('AI suggestions failed:', error);
      return result(
        base,
        false,
        'AI tips are unavailable right now, showing ingredient matches.'
      );
    }
  }
}
