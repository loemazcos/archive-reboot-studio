import { useEffect, useState } from "react";

const SCREEN_WIDTH = 390;
const SCREEN_HEIGHT = 844;
const FRAME_WIDTH = 418;
const FRAME_HEIGHT = 872;
const WINDOW_MARGIN = 32;
const PHONE_VIEWPORT_MAX = 500;

function computeScale() {
  if (window.innerWidth <= PHONE_VIEWPORT_MAX) {
    return Math.min(window.innerWidth / SCREEN_WIDTH, window.innerHeight / SCREEN_HEIGHT);
  }
  return Math.min(
    1,
    (window.innerWidth - WINDOW_MARGIN) / FRAME_WIDTH,
    (window.innerHeight - WINDOW_MARGIN) / FRAME_HEIGHT,
  );
}

export function usePhoneScale() {
  const [scale, setScale] = useState(computeScale);

  useEffect(() => {
    const handleResize = () => setScale(computeScale());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return scale;
}
