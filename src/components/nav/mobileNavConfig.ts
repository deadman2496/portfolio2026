export const MENU_WIDTH = 340;
export const MENU_HEIGHT = 390;

export const BUTTON_CENTER = {
  x: MENU_WIDTH - 32,
  y: MENU_HEIGHT - 32,
};

export const ICON_CENTER = {
  x: MENU_WIDTH - 28,
  y: MENU_HEIGHT - 28,
};

export const orbitLayoutById: Record<string, { x: number; y: number }> = {
  home: { x: 0, y: -280 },
  about: { x: -86, y: -238 },
  work: { x: -160, y: -176 },
  "apps-sites": { x: -186, y: -104 },
  contact: { x: -142, y: -36 },
};

export const stackedLayoutById: Record<string, { x: number; y: number }> = {
  home: { x: 0, y: -330 },
  about: { x: 0, y: -262 },
  work: { x: 0, y: -194 },
  "apps-sites": { x: 0, y: -126 },
  contact: { x: 0, y: -58 },
};

export const branchLayoutByIndex = [
  { x: 0, y: -300 },
  { x: -94, y: -250 },
  { x: -172, y: -178 },
  { x: -190, y: -94 },
  { x: -145, y: -28 },
];

export const stackedBranchLayoutByIndex = [
  { x: 0, y: -340 },
  { x: 0, y: -270 },
  { x: 0, y: -200 },
  { x: 0, y: -130 },
  { x: 0, y: -60 },
];


export const mobileNavOrder = ["home", "about", "work", "apps-sites", "contact"];