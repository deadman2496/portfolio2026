export type NavLink = {
  id: string;
  label: string;
  href: string;
  isExternal?: boolean;
  isHiddenFeature?: boolean;
  children?: NavLink[];
};