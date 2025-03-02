import { ScreenSize } from "../types";

export function calculateScreenDimensions(inch: number, aspectRatio: string) {
  const [width, height] = aspectRatio.split(":").map(Number);
  const ratio = width / height;
  const screenHeight = Math.sqrt((inch * inch) / (ratio * ratio + 1));
  const screenWidth = screenHeight * ratio;

  return { width: screenWidth, height: screenHeight };
}

export function calculateDifference(base: ScreenSize, compare: ScreenSize) {
  const baseScreen = calculateScreenDimensions(base.inch, base.aspectRatio);
  const compareScreen = calculateScreenDimensions(
    compare.inch,
    compare.aspectRatio
  );

  const widthDiff =
    ((compareScreen.width - baseScreen.width) / baseScreen.width) * 100;
  const heightDiff =
    ((compareScreen.height - baseScreen.height) / baseScreen.height) * 100;
  const areaDiff =
    ((compareScreen.width * compareScreen.height -
      baseScreen.width * baseScreen.height) /
      (baseScreen.width * baseScreen.height)) *
    100;

  return {
    ...compare,
    widthDiff,
    heightDiff,
    areaDiff,
  };
}
