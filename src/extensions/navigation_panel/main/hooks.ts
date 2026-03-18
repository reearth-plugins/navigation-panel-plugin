import { useCallback, useEffect, useMemo, useState } from "react";

import {
  DEFAULT_PANEL_BACKGROUND_COLOR,
  DEFAULT_PANEL_BORDER_COLOR,
  DEFAULT_PANEL_BORDER_WIDTH,
  DEFAULT_PANEL_CORNER_RADIUS,
  DEFAULT_ICON_COLOR,
  SIZE_CONFIGS,
  DEFAULT_UI_ANIMATION_DURATION,
  RIPPLE_ANIMATION_DURATION,
  type SizeConfig,
} from "./constants";

import { postMsg } from "@/shared/utils"; // ms - ripple animation duration

type ActionType =
  | "up"
  | "down"
  | "left"
  | "right"
  | "home"
  | "zoomIn"
  | "zoomOut";

type MessageFromExtension = {
  action: "widgetProperty";
  payload?: WidgetProperty;
};

type RippleState = {
  action: ActionType;
  key: number;
} | null;

type WidgetProperty = {
  appearance?: {
    size?: "small" | "medium" | "large";
    background_color?: string;
    icon_color?: string;
    corner_radius?: number;
    show_border?: boolean;
    border_color?: string;
    border_width?: number;
  };
};

export default () => {
  const [property, setProperty] = useState<WidgetProperty>({});

  const panelStyle = useMemo(() => {
    return {
      backgroundColor:
        property.appearance?.background_color || DEFAULT_PANEL_BACKGROUND_COLOR,
      borderRadius: property.appearance?.corner_radius
        ? `${property.appearance.corner_radius}px`
        : `${DEFAULT_PANEL_CORNER_RADIUS}px`,
      border: property.appearance?.show_border
        ? `${property.appearance.border_width || DEFAULT_PANEL_BORDER_WIDTH}px solid ${
            property.appearance.border_color || DEFAULT_PANEL_BORDER_COLOR
          }`
        : "none",
    };
  }, [property.appearance]);

  const iconStyle = useMemo(() => {
    return {
      color: property.appearance?.icon_color || DEFAULT_ICON_COLOR,
    };
  }, [property.appearance]);

  const sizeConfig: SizeConfig = useMemo(() => {
    const size = property.appearance?.size || "medium";
    return SIZE_CONFIGS[size];
  }, [property.appearance?.size]);

  const totalWidth = useMemo(() => {
    return `${sizeConfig.navPanelWidth + sizeConfig.zoomPanelWidth + sizeConfig.panelGap}px`;
  }, [sizeConfig]);

  // Update html and body width based on size
  useEffect(() => {
    document.documentElement.style.width = totalWidth;
    document.body.style.width = totalWidth;
  }, [totalWidth]);

  const [isDisabled, setIsDisabled] = useState(false);
  const [ripple, setRipple] = useState<RippleState>(null);

  const handleAction = useCallback(
    (actionType: ActionType) => {
      if (isDisabled) return;

      postMsg(actionType);
      setIsDisabled(true);
      setRipple({ action: actionType, key: Date.now() });

      // Re-enable buttons after animation completes
      setTimeout(() => {
        setIsDisabled(false);
      }, DEFAULT_UI_ANIMATION_DURATION);

      // Remove ripple after animation completes
      setTimeout(() => {
        setRipple(null);
      }, RIPPLE_ANIMATION_DURATION);
    },
    [isDisabled],
  );

  useEffect(() => {
    const handleMessage = (message: MessageEvent) => {
      const msg = message.data as MessageFromExtension;

      if (msg.action === "widgetProperty" && msg.payload) {
        setProperty(msg.payload);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  useEffect(() => {
    postMsg("init");
  }, []);

  return {
    handleAction,
    isDisabled,
    ripple,
    panelStyle,
    iconStyle,
    sizeConfig,
  };
};
