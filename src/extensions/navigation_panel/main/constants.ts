// Appearance defaults
export const DEFAULT_PANEL_BACKGROUND_COLOR = "#18181bCC";
export const DEFAULT_PANEL_CORNER_RADIUS = 8;
export const DEFAULT_PANEL_BORDER_COLOR = "#00000000";
export const DEFAULT_PANEL_BORDER_WIDTH = 1;
export const DEFAULT_ICON_COLOR = "#FFFFFF";

// Animation durations
export const DEFAULT_UI_ANIMATION_DURATION = 300; // ms - button disable duration
export const RIPPLE_ANIMATION_DURATION = 600; // ms - ripple effect duration
export const DEFAULT_CAMERA_ANIMATION_DURATION = 0.4; // seconds - camera movement duration

// Size configurations
export type SizeConfig = {
  navPanelWidth: number;
  navPanelHeight: number;
  zoomPanelWidth: number;
  zoomPanelHeight: number;
  padding: number;
  gap: number;
  panelGap: number;
  navIconSize: number;
  zoomIconSize: number;
};

export const SIZE_CONFIGS: Record<"small" | "medium" | "large", SizeConfig> = {
  small: {
    navPanelWidth: 160,
    navPanelHeight: 160,
    zoomPanelWidth: 84,
    zoomPanelHeight: 160,
    padding: 12,
    gap: 4,
    panelGap: 8,
    navIconSize: 20, // size-5
    zoomIconSize: 24, // size-6
  },
  medium: {
    navPanelWidth: 200,
    navPanelHeight: 200,
    zoomPanelWidth: 104,
    zoomPanelHeight: 200,
    padding: 16,
    gap: 6,
    panelGap: 12,
    navIconSize: 28, // size-7
    zoomIconSize: 32, // size-8
  },
  large: {
    navPanelWidth: 248,
    navPanelHeight: 248,
    zoomPanelWidth: 128,
    zoomPanelHeight: 248,
    padding: 20,
    gap: 8,
    panelGap: 16,
    navIconSize: 32, // size-8
    zoomIconSize: 40, // size-10
  },
};
