export async function copyText(text: string): Promise<void> {
  // Reflect the runtime capability: Clipboard is unavailable on non-secure origins.
  const clipboard = Reflect.get(navigator, 'clipboard') as Clipboard | undefined;
  if (!clipboard) throw new Error('Clipboard is unavailable in this browser');
  await clipboard.writeText(text);
}
