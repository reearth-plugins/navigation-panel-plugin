import {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Home,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

import useHooks from "./hooks";

import { Button } from "@/shared/components/ui/button";

function App() {
  const {
    handleAction,
    isDisabled,
    ripple,
    panelStyle,
    iconStyle,
    sizeConfig,
  } = useHooks();

  const renderRipple = (action: string) => {
    if (!ripple || ripple.action !== action) return null;

    return (
      <div
        key={ripple.key}
        className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden rounded-md"
      >
        <div className="absolute w-4 h-4 bg-white rounded-full animate-[ripple_0.6s_ease-out]" />
      </div>
    );
  };

  return (
    <div className="flex" style={{ gap: `${sizeConfig.panelGap}px` }}>
      {/* Navigation Control Panel */}
      <div
        className="bg-zinc-900/60 backdrop-blur-sm rounded-2xl"
        style={{
          ...panelStyle,
          width: `${sizeConfig.navPanelWidth}px`,
          height: `${sizeConfig.navPanelHeight}px`,
          padding: `${sizeConfig.padding}px`,
        }}
      >
        <div
          className="grid grid-cols-3 grid-rows-3 h-full w-full"
          style={{ gap: `${sizeConfig.gap}px` }}
        >
          {/* Top row - Up arrow centered */}
          <div className="col-start-2">
            <Button
              variant="ghost"
              size="icon"
              className="w-full h-full cursor-pointer hover:bg-transparent relative overflow-hidden"
              onClick={() => handleAction("up")}
              disabled={isDisabled}
            >
              {renderRipple("up")}
              <ArrowUp
                className="relative z-10"
                style={{ ...iconStyle, width: sizeConfig.navIconSize, height: sizeConfig.navIconSize }}
              />
            </Button>
          </div>

          {/* Middle row - Left, Home, Right */}
          <div className="col-start-1 row-start-2">
            <Button
              variant="ghost"
              size="icon"
              className="w-full h-full cursor-pointer hover:bg-transparent relative overflow-hidden"
              onClick={() => handleAction("left")}
              disabled={isDisabled}
            >
              {renderRipple("left")}
              <ArrowLeft
                className="relative z-10"
                style={{ ...iconStyle, width: sizeConfig.navIconSize, height: sizeConfig.navIconSize }}
              />
            </Button>
          </div>
          <div className="col-start-2 row-start-2">
            <Button
              variant="ghost"
              size="icon"
              className="w-full h-full cursor-pointer hover:bg-transparent relative overflow-hidden"
              onClick={() => handleAction("home")}
              disabled={isDisabled}
            >
              {renderRipple("home")}
              <Home
                className="relative z-10"
                style={{ ...iconStyle, width: sizeConfig.navIconSize, height: sizeConfig.navIconSize }}
              />
            </Button>
          </div>
          <div className="col-start-3 row-start-2">
            <Button
              variant="ghost"
              size="icon"
              className="w-full h-full cursor-pointer hover:bg-transparent relative overflow-hidden"
              onClick={() => handleAction("right")}
              disabled={isDisabled}
            >
              {renderRipple("right")}
              <ArrowRight
                className="relative z-10"
                style={{ ...iconStyle, width: sizeConfig.navIconSize, height: sizeConfig.navIconSize }}
              />
            </Button>
          </div>

          {/* Bottom row - Down arrow centered */}
          <div className="col-start-2 row-start-3">
            <Button
              variant="ghost"
              size="icon"
              className="w-full h-full cursor-pointer hover:bg-transparent relative overflow-hidden"
              onClick={() => handleAction("down")}
              disabled={isDisabled}
            >
              {renderRipple("down")}
              <ArrowDown
                className="relative z-10"
                style={{ ...iconStyle, width: sizeConfig.navIconSize, height: sizeConfig.navIconSize }}
              />
            </Button>
          </div>
        </div>
      </div>

      {/* Zoom Control Panel */}
      <div
        className="bg-zinc-900/60 backdrop-blur-sm rounded-2xl"
        style={{
          ...panelStyle,
          width: `${sizeConfig.zoomPanelWidth}px`,
          height: `${sizeConfig.zoomPanelHeight}px`,
          padding: `${sizeConfig.padding}px`,
        }}
      >
        <div
          className="flex flex-col h-full w-full"
          style={{ gap: `${sizeConfig.gap}px` }}
        >
          <Button
            variant="ghost"
            size="icon"
            className="flex-1 cursor-pointer w-full hover:bg-transparent relative overflow-hidden"
            onClick={() => handleAction("zoomIn")}
            disabled={isDisabled}
          >
            {renderRipple("zoomIn")}
            <ZoomIn
              className="relative z-10"
              style={{ ...iconStyle, width: sizeConfig.zoomIconSize, height: sizeConfig.zoomIconSize }}
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="flex-1 cursor-pointer w-full hover:bg-transparent relative overflow-hidden"
            onClick={() => handleAction("zoomOut")}
            disabled={isDisabled}
          >
            {renderRipple("zoomOut")}
            <ZoomOut
              className="relative z-10"
              style={{ ...iconStyle, width: sizeConfig.zoomIconSize, height: sizeConfig.zoomIconSize }}
            />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default App;
