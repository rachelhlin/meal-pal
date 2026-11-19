import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';

// schema.prisma is generated from prisma/models/. easy to forget to rerun
// schema:gen after adding a model (happened with AiUsage), so check it here
test('schema.prisma has every model from prisma/models', () => {
  const schema = readFileSync('prisma/schema.prisma', 'utf8');
  for (const file of readdirSync('prisma/models').filter((f) =>
    f.endsWith('.prisma')
  )) {
    const models = [
      ...readFileSync(`prisma/models/${file}`, 'utf8').matchAll(
        /^model (\w+)/gm
      ),
    ];
    for (const [, name] of models) {
      assert.match(
        schema,
        new RegExp(`^model ${name} `, 'm'),
        `${name} is missing, run npm run schema:gen:nix`
      );
    }
  }
});
