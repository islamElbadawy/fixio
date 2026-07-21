import { v7 as uuidv7 } from 'uuid';

/**
 * Generates a UUID v7 ID.
 * UUIDs v7 are time-based and sortable, providing better database performance
 * and improved traceability compared to v4 (random).
 *
 * @returns A UUID v7 string
 */
export function generateId(): string {
  return uuidv7();
}
