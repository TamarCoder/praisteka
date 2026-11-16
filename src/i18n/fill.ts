/** „{name}“ ადგილებს ცვლის მნიშვნელობებით */
export function fill(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => String(values[key] ?? match));
}
