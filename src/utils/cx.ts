export type ClassInput = string | undefined | null | false | 0 | ClassInput[];

function appendClass(current: string, addition: string): string {
  return current ? `${current} ${addition}` : addition;
}

export function cx(...inputs: ClassInput[]): string {
  let result = '';

  for (const input of inputs) {
    if (!input) continue;

    if (typeof input === 'string') {
      result = appendClass(result, input);
    } else if (Array.isArray(input)) {
      const nested = cx(...input);
      if (nested) {
        result = appendClass(result, nested);
      }
    }
  }

  return result;
}
