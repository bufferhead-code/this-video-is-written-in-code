export const COLORS = {
  primary: '#6E30FF',
  secondary: '#05D5D3',
  danger: '#FF2E00',
  grayBg: '#171717',
  grayBgCard: '#202020',
  grayCardBorder: '#282828',
} as const;

export type ColorType = keyof typeof COLORS | string;
