import React, { useEffect, useState } from 'react';
import AssitiveTouchMenu from './AssitiveTouchMenu';

import {getScreenSize, setStyles} from './function';
import { AssitiveTouchPosition, NodeSize } from './types';

import './styles.css';

const AssistiveTouch = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const targetNode = document.getElementById('touch-node');
  const [assistiveTouchPosition, setAssistiveTouchPosition] = useState<AssitiveTouchPosition>({ x: 0, y: 0 });
  const [currentTouchPosition, setCurrentTouchPosition] = useState<AssitiveTouchPosition>({ x: 0, y: 0});
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
    targetNode?.addEventListener('mousedown', onMouseDown, { passive: false });
  };

  const onMouseDown = (e: any) => {
    targetNode?.addEventListener('mousemove', onMouseMove, { passive: false });
    targetNode?.addEventListener('mouseup', onMouseUp, { passive: false });
    targetNode?.addEventListener('touchmove', onTouchMove, { passive: false });
    targetNode?.addEventListener('touchend', onTouchEnd, { passive: false });
    targetNode?.addEventListener('touchcancel', onTouchEnd, { passive: false });
  }
 
  const removeListeners = () => {
    targetNode?.removeEventListener('mousemove', onMouseMove);
    targetNode?.removeEventListener('mouseup', onMouseUp);
    targetNode?.removeEventListener('touchmove', onTouchMove);
    targetNode?.removeEventListener('touchend', onTouchEnd);
    targetNode?.removeEventListener('touchcancel', onTouchEnd);
  };

  const onMouseMove = (e: MouseEvent | Touch) => {
    setOpenMenu(false);

    // detect whether user-touch-position is within screen 
    const isValidMoving = Boolean(e.clientX > 0 && e.clientY > 0);

    // absolute distance between assitive-touch-node initial X position and user-touch-position-X
    const movingDistance_X = Math.abs(e.clientX - currentTouchPosition.y);
    // detect whether user-touch-position-X exceed screen to the right direction
    const exceedArea_RightDirection = Boolean(currentTouchPosition.y > screenSize.width || e.clientX > screenSize.width || movingDistance_X > screenSize.width);
    // detect whetehr user-touch-position-X exceed screen to the left direction
    const exceedArea_LeftDirection = Boolean(e.clientX < nodeSize.width);

    const movingDistance_Y = Math.abs(e.clientY - currentTouchPosition.x);
    const exceedArea_DownDirection = Boolean(currentTouchPosition.x > screenSize.height || e.clientY > screenSize.height || movingDistance_Y > screenSize.height);
    const exceedArea_TopDirection = Boolean(e.clientY < nodeSize.height);
    const diffPos = {
      y:
        exceedArea_RightDirection ? screenSize.width - (nodeSize.width + assistiveTouchPosition.y) : (exceedArea_LeftDirection ? 0 : currentTouchPosition.y - e.clientX),
      x:
      exceedArea_DownDirection ? screenSize.height - (nodeSize.height + assistiveTouchPosition.x) : (exceedArea_TopDirection ? 0 : currentTouchPosition.x - e.clientY),
    };
  
    if (nodeSize && isValidMoving) {
      let y = exceedArea_RightDirection ? screenSize.width - nodeSize.width : exceedArea_LeftDirection ? 0 : assistiveTouchPosition.y - diffPos.y;
     
      y > screenSize.width - nodeSize.width &&
        (y = screenSize.width - nodeSize.width);

      let x = exceedArea_DownDirection ? screenSize.height - nodeSize.height : exceedArea_TopDirection ? 0 : assistiveTouchPosition.x - diffPos.x;
      x > screenSize.height - nodeSize.height &&
        (x = screenSize.height - nodeSize.height);

      setAssistiveTouchPosition({x, y});

      const validX = e.clientX > nodeSize.width ?  Math.min(e.clientX, screenSize.width) : Math.max(e.clientX, 0);
      const validY = e.clientY > nodeSize.height ? Math.min(e.clientY, screenSize.height) : Math.max(e.clientY, 0);
      setCurrentTouchPosition({  x: validY, y: validX});
    }
  };

  const onMouseUp = (e: any) => {
    removeListeners();
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    window.addEventListener('touchstart', () => onTouchStart(e), { passive: false } );
  };

  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if(openMenu){
      setOpenMenu(false);
    }else{
      setOpenMenu(true);
    }

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
          id="touch-node"
          ref={setNode}
          style={setStyles(assistiveTouchPosition)}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          <div className="touch-node-inner"></div>
          <div>{openMenu && <AssitiveTouchMenu/>}</div>
        </div>
    </div>
  );
};

export default AssistiveTouch;
