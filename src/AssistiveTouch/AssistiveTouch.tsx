import React, { useEffect, useState } from 'react';

import {getScreenSize, setStyles} from './function';
import { AssistiveTouchState, AssitiveTouchPosition, NodeSize } from './types';

import './styles.css';

const AssistiveTouch = () => {
  const [assistiveTouchState, setAssistiveTouchState] = useState<AssistiveTouchState>({
    position: { x: 0, y: 0 },
    isClickedToOpen: false,
  });
  const [initialTouchPosition, setInitialTouchPosition] = useState<AssitiveTouchPosition>({ x: 0, y: 0});
  const [node, setNode] = useState<HTMLDivElement | null>();
  const [nodeSize, setNodeSize] = useState<NodeSize>({width: 0, height: 0});
  const screenSize = getScreenSize();

  useEffect(() => {
    if (node) {
      setNodeSize({
        width: node.clientWidth,
        height: node.clientHeight,
      });
    }
  }, [node]);

  const handleMouseDown = () => {
    window.addEventListener('mousedown', onMouseDown, { passive: false });
  };

  const onMouseDown = (e: any) => {
    window.addEventListener('mousemove', onMouseMove, { passive: false });
    window.addEventListener('mouseup', onMouseUp, { passive: false });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd, { passive: false });
    window.addEventListener('touchcancel', onTouchEnd, { passive: false });
  };

  const removeListeners = () => {
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
    window.removeEventListener('touchmove', onTouchMove);
    window.removeEventListener('touchend', onTouchEnd);
    window.removeEventListener('touchcancel', onTouchEnd);
  };

  const onMouseMove = (e: MouseEvent | Touch) => {
    // detect whether user-touch-position is within screen 
    const isValidMoving = Boolean(e.clientX > 0 && e.clientY > 0);

    // absolute distance between assitive-touch-node initial X position and user-touch-position-X
    const movingDistance_X = Math.abs(e.clientX - initialTouchPosition.y);
    // detect whether user-touch-position-X exceed screen to the right direction
    const exceedArea_RightDirection = Boolean(initialTouchPosition.y > screenSize.width || e.clientX > screenSize.width || movingDistance_X > screenSize.width);
    // detect whetehr user-touch-position-X exceed screen to the left direction
    const exceedArea_LeftDirection = Boolean(e.clientX < nodeSize.width);

    const movingDistance_Y = Math.abs(e.clientY - initialTouchPosition.x);
    const exceedArea_DownDirection = Boolean(initialTouchPosition.x > screenSize.height || e.clientY > screenSize.height || movingDistance_Y > screenSize.height);
    const exceedArea_TopDirection = Boolean(e.clientY < nodeSize.height);

    const diffPos = {
      y:
        exceedArea_RightDirection ? screenSize.width - (nodeSize.width + assistiveTouchState.position.y) : (exceedArea_LeftDirection ? 0 : initialTouchPosition.y - e.clientX),
      x:
      exceedArea_DownDirection ? screenSize.height - (nodeSize.height + assistiveTouchState.position.x) : (exceedArea_TopDirection ? 0 : initialTouchPosition.x - e.clientY),
    };
  
    if (nodeSize && isValidMoving) {
      let y = exceedArea_RightDirection ? screenSize.width - nodeSize.width : exceedArea_LeftDirection ? 0 : assistiveTouchState.position.y - diffPos.y;
     
      y > screenSize.width - nodeSize.width &&
        (y = screenSize.width - nodeSize.width);

      let x = exceedArea_DownDirection ? screenSize.height - nodeSize.height : exceedArea_TopDirection ? 0 : assistiveTouchState.position.x - diffPos.x;
      x > screenSize.height - nodeSize.height &&
        (x = screenSize.height - nodeSize.height);

      setAssistiveTouchState({
        position: {x, y},
        isClickedToOpen: assistiveTouchState.isClickedToOpen,
      });

      const validX = e.clientX > nodeSize.width ?  Math.min(e.clientX, screenSize.width) : Math.max(e.clientX, 0);
      const validY = e.clientY > nodeSize.height ? Math.min(e.clientY, screenSize.height) : Math.max(e.clientY, 0);
      setInitialTouchPosition({  x: validY, y: validX});
    }
  };

  const onMouseUp = (e: any) => {
    removeListeners();
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    window.addEventListener('touchstart', () => onTouchStart(e), { passive: false } );
  };

  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    onMouseDown(e.changedTouches[0]);
  };

  const onTouchMove = (e: TouchEvent) => {
    e.preventDefault();
    onMouseMove(e.changedTouches[0]);
  };

  const onTouchEnd = (e: TouchEvent) => {
    e.preventDefault();
    onMouseUp(e.changedTouches[0]);
  };

  return (
    <div>
        <div
          className="touch-node"
          ref={setNode}
          style={setStyles(assistiveTouchState)}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          <div className="touch-node-inner"></div>
        </div>
    </div>
  );
};

export default AssistiveTouch;
