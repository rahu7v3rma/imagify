export function getTheme(): string | null {
  return localStorage.getItem("theme");
}

export function setTheme(theme: string): void {
  localStorage.setItem("theme", theme);
}
