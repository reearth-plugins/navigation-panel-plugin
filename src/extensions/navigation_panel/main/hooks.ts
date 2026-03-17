import { useCallback, useEffect, useMemo, useState } from "react";

import {
  DEFAULT_PANEL_BACKGROUND_COLOR,
  DEFAULT_PANEL_BORDER_COLOR,
  DEFAULT_PANEL_BORDER_WIDTH,
  DEFAULT_PANEL_CORNER_RADIUS,
  DEFAULT_ICON_COLOR,
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
    background_color?: string;
    icon_color?: string;
    corner_radius?: number;
    show_border?: boolean;
    border_color?: string;
    border_width?: number;
  };
};

const DEFAULT_DURATION = 300; // ms - match animation duration
const RIPPLE_DURATION = 600;

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
      }, DEFAULT_DURATION);

      // Remove ripple after animation completes
      setTimeout(() => {
        setRipple(null);
      }, RIPPLE_DURATION);
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
  };
};
