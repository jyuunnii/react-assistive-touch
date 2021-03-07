import { AssistiveTouchState } from "./types";

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

export const setStyles = (assistiveTouchState: AssistiveTouchState) => {
    return {
      top: `${assistiveTouchState.position.x}px`,
      left: `${assistiveTouchState.position.y}px`,
      transform: `scale(${assistiveTouchState.isClickedToOpen ? '0' : '1'})`,
    };
};