import { ValidateIf } from 'class-validator';

export function CanBeUndefined() {
  return ValidateIf((object, value) => value !== undefined);
}
