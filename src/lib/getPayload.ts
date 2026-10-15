import { getPayload as getPayloadRaw } from 'payload';
import config from '../../payload.config';

let cached: ReturnType<typeof getPayloadRaw> | null = null;

/**
 * Server-only Payload client (singleton).
 * Import ONLY from server components / route handlers / server actions.
 */
export function getPayload() {
  if (!cached) {
    cached = getPayloadRaw({ config });
  }
  return cached;
}
