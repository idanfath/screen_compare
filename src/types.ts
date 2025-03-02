export interface ScreenSize {
  id: string;
  inch: number;
  aspectRatio: string;
  isUserScreen?: boolean;
}

export interface ComparisonResult extends ScreenSize {
  widthDiff: number;
  heightDiff: number;
  areaDiff: number;
}
