import html_main from "@distui/navigation_panel/main/index.html?raw";
import { Camera } from "@reearth/core";

import { DEFAULT_CAMERA_ANIMATION_DURATION } from "./main/constants";
import { GlobalThis } from "@/shared/reearthTypes";

type WidgetProperty = {
  general?: {
    home?: Camera;
  };
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

const reearth = (globalThis as unknown as GlobalThis).reearth;
reearth.ui.show(html_main);

// Configuration with defaults
const getConfig = () => {
  const props = reearth.extension.widget?.property as
    | WidgetProperty
    | undefined;
  return {
    home: props?.general?.home,
  };
};

// Track target position for accumulated movements
let targetLat: number | null = null;
let targetLng: number | null = null;
let lastMoveTime = 0;
const RESET_TIMEOUT = DEFAULT_CAMERA_ANIMATION_DURATION * 1000 * 2; // ms - reset target after 2x animation duration

// Normalize longitude to -180 to +180 range
const normalizeLng = (lng: number): number => {
  while (lng > 180) lng -= 360;
  while (lng < -180) lng += 360;
  return lng;
};

// Normalize latitude to -90 to +90 range
const normalizeLat = (lat: number): number => {
  return Math.max(-90, Math.min(90, lat));
};

// Helper function to move camera relative to current heading
// direction: "forward" | "backward" | "left" | "right"
const moveCamera = (direction: "forward" | "backward" | "left" | "right") => {
  const current = reearth.camera.position;
  const viewport = reearth.camera.viewport;
  if (!current?.lat || !current?.lng || !current?.height || !viewport) return;

  // Calculate visible screen area
  const viewportHeight = viewport.north - viewport.south;
  let viewportWidth = viewport.east - viewport.west;

  // Handle dateline crossing: if width is negative, add 360 to get the correct span
  if (viewportWidth < 0) {
    viewportWidth += 360;
  }

  const viewportDimension =
    direction === "forward" || direction === "backward"
      ? viewportHeight
      : viewportWidth;

  // At normal altitudes: move 1/3 of viewport
  // At high altitudes: cap at 30 degrees to ensure previous view stays in sight
  const MAX_MOVEMENT_DEGREES = 30;
  const moveDistance = Math.min(viewportDimension / 3, MAX_MOVEMENT_DEGREES);

  // Get camera heading (rotation angle in radians, 0 = north, π/2 = east)
  const heading = current.heading ?? 0;

  // Calculate movement angle based on direction
  let angle: number;
  switch (direction) {
    case "forward":
      angle = heading; // Move in heading direction
      break;
    case "backward":
      angle = heading + Math.PI; // Move opposite to heading
      break;
    case "left":
      angle = heading - Math.PI / 2; // Move left relative to heading
      break;
    case "right":
      angle = heading + Math.PI / 2; // Move right relative to heading
      break;
  }

  // Convert angle to lat/lng offsets
  // In geographic coordinates: north = 0°, east = 90°
  // latOffset = distance * cos(angle), lngOffset = distance * sin(angle)
  const latOffset = moveDistance * Math.cos(angle);
  const lngOffset = moveDistance * Math.sin(angle);

  const now = Date.now();

  // Use target position if exists and we're within timeout, otherwise use current position
  if (
    targetLat === null ||
    targetLng === null ||
    now - lastMoveTime > RESET_TIMEOUT
  ) {
    // Reset to current position (first move or animation completed)
    targetLat = current.lat;
    targetLng = current.lng;
  }
  // Otherwise, keep using existing targetLat/targetLng so new movements
  // build on the destination of previous moves, not current animating position

  // Apply movement from the target position (not current position)
  targetLat += latOffset;
  targetLng += lngOffset;
  lastMoveTime = now;

  // Normalize coordinates to handle wraparound
  targetLat = normalizeLat(targetLat);
  targetLng = normalizeLng(targetLng);

  // Apply movement
  reearth.camera.flyTo(
    {
      lat: targetLat,
      lng: targetLng,
      height: current.height,
      heading: current.heading,
      pitch: current.pitch,
      roll: current.roll,
    },
    {
      duration: DEFAULT_CAMERA_ANIMATION_DURATION,
    },
  );
};

// Get message from UI
reearth.extension.on("message", (message: unknown) => {
  const msg = message as { action: string; payload?: unknown };
  const config = getConfig();

  switch (msg.action) {
    case "up":
      // Move forward relative to camera heading
      moveCamera("forward");
      break;

    case "down":
      // Move backward relative to camera heading
      moveCamera("backward");
      break;

    case "left":
      // Move left relative to camera heading
      moveCamera("left");
      break;

    case "right":
      // Move right relative to camera heading
      moveCamera("right");
      break;

    case "home":
      // Fly to home position
      if (config.home) {
        reearth.camera.flyTo(config.home, {
          duration: DEFAULT_CAMERA_ANIMATION_DURATION,
        });
      }
      break;

    case "zoomIn": {
      const currentPos = reearth.camera.position;
      if (currentPos?.lat && currentPos?.lng && currentPos?.height) {
        const newHeight = Math.max(currentPos.height / 2, 1); // Zoom in by 2x, minimum 1m
        reearth.camera.flyTo(
          {
            lat: currentPos.lat,
            lng: currentPos.lng,
            height: newHeight,
            heading: currentPos.heading,
            pitch: currentPos.pitch,
            roll: currentPos.roll,
          },
          {
            duration: DEFAULT_CAMERA_ANIMATION_DURATION,
          },
        );
      }
      break;
    }

    case "zoomOut": {
      const currentPos = reearth.camera.position;
      if (currentPos?.lat && currentPos?.lng && currentPos?.height) {
        const newHeight = Math.min(currentPos.height * 2, 20000000); // Zoom out by 2x, max ~Earth radius
        reearth.camera.flyTo(
          {
            lat: currentPos.lat,
            lng: currentPos.lng,
            height: newHeight,
            heading: currentPos.heading,
            pitch: currentPos.pitch,
            roll: currentPos.roll,
          },
          {
            duration: DEFAULT_CAMERA_ANIMATION_DURATION,
          },
        );
      }
      break;
    }

    case "init": {
      const widgetProperty = reearth.extension.widget
        ?.property as WidgetProperty;
      reearth.ui.postMessage({
        action: "widgetProperty",
        payload: widgetProperty,
      });
      break;
    }

    default:
      break;
  }
});
