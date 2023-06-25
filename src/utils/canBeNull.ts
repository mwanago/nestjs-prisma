import { ValidateIf } from 'class-validator';

export function CanBeNull() {
  return ValidateIf((object, value) => value !== null);
}
