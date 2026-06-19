export const MENU_WIDTH = 340;
export const MENU_HEIGHT = 360;

export const BUTTON_CENTER = {
  x: MENU_WIDTH - 32,
  y: MENU_HEIGHT - 32,
};

export const ICON_CENTER = {
  x: MENU_WIDTH - 28,
  y: MENU_HEIGHT - 28,
};

export const orbitLayoutById: Record<string, { x: number; y: number }> = {
  home: { x: 0, y: -250 },
  about: { x: -96, y: -210 },
  projects: { x: -166, y: -146 },
  contact: { x: -150, y: -78 },
};

export const stackedLayoutById: Record<string, { x: number; y: number }> = {
  home: { x: 0, y: -278 },
  about: { x: 0, y: -210 },
  projects: { x: 0, y: -142 },
  contact: { x: 0, y: -74 },
};

export const mobileNavOrder = ["home", "about", "projects", "contact"];