import { AssitiveTouchPosition } from "./types";

export const getScreenSize = () => {
    return {
      width: Math.max(
        document.documentElement.clientWidth,
        window.innerWidth || 0,
      ),
      height: Math.max(
        document.documentElement.clientHeight,
        window.innerHeight || 0,
      ),
    };
};

export const setStyles = (assistiveTouchPosition: AssitiveTouchPosition) => {
    return {
      top: `${assistiveTouchPosition.x}px`,
      left: `${assistiveTouchPosition.y}px`
    };
};