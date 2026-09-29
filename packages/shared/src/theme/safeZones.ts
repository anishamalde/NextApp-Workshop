import {scaleWidth, scaleHeight} from '../utils/scaling';

// Safe zones for a 1920x1080 design, scaled to the actual screen.
// Action-safe (5%): keep focusable elements inside this inset.
// Title-safe (10%): keep text inside this inset.
export const actionSafe = {
  horizontal: scaleWidth(96),
  vertical: scaleHeight(54),
};

export const titleSafe = {
  horizontal: scaleWidth(192),
  vertical: scaleHeight(108),
};
