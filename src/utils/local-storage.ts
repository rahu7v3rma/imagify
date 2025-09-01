export function getTheme(): string | null {
  return localStorage.getItem('imagify-theme');
}

export function setTheme(theme: string): void {
  localStorage.setItem('imagify-theme', theme);
}
