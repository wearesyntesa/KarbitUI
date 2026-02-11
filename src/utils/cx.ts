export type ClassInput = string | undefined | null | false | 0 | ClassInput[];

export function cx(...inputs: ClassInput[]): string {
  let result = '';

  for (const input of inputs) {
    if (!input) continue;

    if (typeof input === 'string') {
      result = result ? `${result} ${input}` : input;
    } else if (Array.isArray(input)) {
      const nested = cx(...input);
      if (nested) {
        result = result ? `${result} ${nested}` : nested;
      }
    }
  }

  return result;
}
