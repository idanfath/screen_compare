"use client";

import { twMerge } from "tailwind-merge";
import { useEffect, useState, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import type { ScreenSize, ComparisonResult } from "../types";
import {
  calculateScreenDimensions,
  calculateDifference,
} from "../utils/screenCalculations";
import { ArrowLeft } from "lucide-react";

const colors = [
  "border-transparent",
  "border-blue-800/60 bg-blue-600/5",
  "border-green-800/60 bg-green-600/5",
  "border-red-800/60 bg-red-600/5",
  "border-yellow-800/60 bg-yellow-600/5",
  "border-purple-800/60 bg-purple-600/5",
  "border-pink-800/60 bg-pink-600/5",
  "border-indigo-800/60 bg-indigo-600/5",
  "border-orange-800/60 bg-orange-600/5",
  "border-teal-800/60 bg-teal-600/5",
  "border-cyan-800/60 bg-cyan-600/5",
];
export default function ComparisonPage() {
  const [searchParams] = useSearchParams();
  const [screens, setScreens] = useState<ScreenSize[]>([]);
  const [comparisons, setComparisons] = useState<ComparisonResult[]>([]);
  const [scale, setScale] = useState(1);

  const calculateScale = useCallback((screens: ScreenSize[]) => {
    if (screens.length === 0) return 1;

    const largestScreen = screens.reduce((max, screen) =>
      screen.inch > max.inch ? screen : max
    );
    const { width } = calculateScreenDimensions(
      largestScreen.inch,
      largestScreen.aspectRatio
    );
    return window.innerWidth / width;
  }, []);

  useEffect(() => {
    const screensParam = searchParams.getAll("screens");
    const parsedScreens = screensParam.map((s) => JSON.parse(s));
    const filteredScreens = parsedScreens.filter((_, index) => index < 10);
    setScreens(filteredScreens);
    setScale(calculateScale(filteredScreens));

    // Calculate differences
    const userScreen = filteredScreens.find((s) => s.isUserScreen);
    if (userScreen) {
      const results = filteredScreens
        .filter((s) => !s.isUserScreen)
        .map((screen) => calculateDifference(userScreen, screen));
      setComparisons(results);
    }
  }, [searchParams, calculateScale]);

  useEffect(() => {
    const handleResize = () => {
      setScale(calculateScale(screens));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [screens, calculateScale]);

  const getScreenStyle = (screen: ScreenSize) => {
    const { width, height } = calculateScreenDimensions(
      screen.inch,
      screen.aspectRatio
    );

    return {
      width: `${width * scale}px`,
      height: `${height * scale}px`,
    };
  };

  const formatDifference = (value: number) => {
    const sign = value > 0 ? "+" : "";
    return `${sign}${value.toFixed(1)}%`;
  };

  return (
    <div className="min-h-dvh bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800 relative overflow-hidden">
      <div className="h-screen w-screen relative">
        {[...screens]
          .sort((a, b) => b.inch - a.inch)
          .map((screen, index) => {
            const comparison = comparisons.find((c) => c.id === screen.id);

            return (
              <div
                key={screen.id}
                style={getScreenStyle(screen)}
                className={twMerge(
                  "transition-all duration-300 border-2 rounded-md absolute bottom-0",
                  colors[index % colors.length],
                  `z-[${index}]`
                )}
              >
                {screen.id !== "user" && comparison && (
                  <div
                    className={twMerge(
                      "absolute hover:z-[51] z-50 text-center border top-4 left-1/2 transform -translate-x-1/2 bg-white dark:bg-zinc-800 px-3 py-1 rounded-lg shadow font-medium text-zinc-700 dark:text-zinc-300 whitespace-nowrap",
                      colors[index % colors.length]
                    )}
                  >
                    <div>
                      {screen.inch}" ({screen.aspectRatio})
                    </div>
                    <div className="text-xs flex justify-center gap-2">
                      <span>
                        Width:{" "}
                        <span
                          className={twMerge(
                            comparison.widthDiff > 0
                              ? "dark:text-green-400 text-green-500"
                              : "dark:text-red-400 text-red-500"
                          )}
                        >
                          {formatDifference(comparison.widthDiff)}
                        </span>
                      </span>
                      <span>
                        Height:{" "}
                        <span
                          className={twMerge(
                            comparison.heightDiff > 0
                              ? "dark:text-green-400 text-green-500"
                              : "dark:text-red-400 text-red-500"
                          )}
                        >
                          {formatDifference(comparison.heightDiff)}
                        </span>
                      </span>
                      <span>
                        Area:{" "}
                        <span
                          className={twMerge(
                            comparison.areaDiff > 0
                              ? "dark:text-green-400 text-green-500"
                              : "dark:text-red-400 text-red-500"
                          )}
                        >
                          {formatDifference(comparison.areaDiff)}
                        </span>
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
      </div>
      <div className="fixed flex gap-1.5 top-4 z-50 left-1/2 transform -translate-x-1/2">
        <Link
          to={`/?${searchParams.toString()}`}
          aria-label="Back to comparison"
          className="bg-white flex gap-1 items-center dark:bg-zinc-800 px-4 py-2 rounded-full shadow-md font-medium text-zinc-700 dark:text-zinc-300"
        >
          <ArrowLeft className="text-zinc-600 dark:text-zinc-300" /> Back
        </Link>
        {screens.length > 0 && (
          <div className="bg-white flex items-center dark:bg-zinc-800 px-4 py-2 rounded-full shadow-md font-medium text-zinc-700 dark:text-zinc-300">
            {screens[0].inch}" ({screens[0].aspectRatio})
          </div>
        )}
        <div className="bg-white flex items-center dark:bg-zinc-800 px-4 py-2 rounded-full shadow-md font-medium text-zinc-700 dark:text-zinc-300">
          {screens.length} screens compared
        </div>
      </div>
    </div>
  );
}
