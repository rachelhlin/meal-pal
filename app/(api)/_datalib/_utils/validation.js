import { GraphQLError } from 'graphql';

export function badInput(message) {
  return new GraphQLError(message, { extensions: { code: 'BAD_USER_INPUT' } });
}

export function forbidden(message = 'You can only change your own content') {
  return new GraphQLError(message, { extensions: { code: 'FORBIDDEN' } });
}

export function requireUser(context) {
  if (!context?.userId) {
    throw new GraphQLError('You must be signed in', {
      extensions: { code: 'UNAUTHENTICATED' },
    });
  }
  return context.userId;
}

// graphql ids come in as strings but prisma wants ints
export function toId(id) {
  const n = Number(id);
  if (!Number.isInteger(n) || n <= 0) throw badInput('Invalid id');
  return n;
}

export function requiredText(value, field, max) {
  const text = String(value ?? '').trim();
  if (!text) throw badInput(`${field} is required`);
  if (text.length > max)
    throw badInput(`${field} must be ${max} characters or fewer`);
  return text;
}
