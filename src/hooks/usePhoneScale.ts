import { useEffect, useState } from "react";

const SCREEN_WIDTH = 390;
const SCREEN_HEIGHT = 844;
const FRAME_WIDTH = 418;
const FRAME_HEIGHT = 872;
const WINDOW_MARGIN = 32;
const PHONE_VIEWPORT_MAX = 500;

function computeScale() {
  const width = window.visualViewport?.width ?? window.innerWidth;
  const height = window.visualViewport?.height ?? window.innerHeight;
  if (width <= PHONE_VIEWPORT_MAX)
    return Math.min(1, width / SCREEN_WIDTH, height / SCREEN_HEIGHT);
  return Math.min(
    1,
    (width - WINDOW_MARGIN) / FRAME_WIDTH,
    (height - WINDOW_MARGIN) / FRAME_HEIGHT,
  );
}

export function usePhoneScale() {
  const [scale, setScale] = useState(computeScale);

  useEffect(() => {
    const handleResize = () => setScale(computeScale());
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
    window.visualViewport?.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
      window.visualViewport?.removeEventListener("resize", handleResize);
    };
  }, []);

  return scale;
}
