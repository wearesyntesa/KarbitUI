export type ClassInput = string | undefined | null | false | 0 | ClassInput[];

export function cx(...inputs: ClassInput[]): string {
  const classes: string[] = [];

  for (let i = 0; i < inputs.length; i++) {
    const input = inputs[i];
    if (!input) continue;

    if (typeof input === 'string') {
      classes.push(input);
    } else if (Array.isArray(input)) {
      const nested = cx(...input);
      if (nested) classes.push(nested);
    }
  }

  return classes.join(' ');
}
