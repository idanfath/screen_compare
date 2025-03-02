import type React from "react";
import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { ScreenSize } from "../types";
import { PlusCircle, Trash2, Monitor, BarChart3 } from "lucide-react";

export default function IndexPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [screens, setScreens] = useState<ScreenSize[]>([
    { id: "user", inch: 0, aspectRatio: "16:9", isUserScreen: true },
    { id: crypto.randomUUID(), inch: 0, aspectRatio: "16:9" },
  ]);

  useEffect(() => {
    const screensParam = searchParams.getAll("screens");
    if (screensParam.length > 0) {
      try {
        const parsedScreens = screensParam.map((s) => JSON.parse(s));
        if (!parsedScreens.some((screen) => screen.isUserScreen)) {
          setScreens([
            {
              id: "user",
              inch: 0,
              aspectRatio: "16:9",
              isUserScreen: true,
            },
            ...parsedScreens,
          ]);
        } else {
          setScreens(parsedScreens);
        }
      } catch (error) {
        console.error("Failed to parse screens from URL:", error);
      }
    }
  }, [searchParams]);

  const addScreen = useCallback(() => {
    setScreens((currentScreens) => [
      ...currentScreens,
      {
        id: crypto.randomUUID(),
        inch: 0,
        aspectRatio: "16:9",
      },
    ]);
  }, []);

  const updateScreen = useCallback(
    (id: string, field: keyof ScreenSize, value: string | number) => {
      setScreens((currentScreens) =>
        currentScreens.map((screen) =>
          screen.id === id ? { ...screen, [field]: value } : screen
        )
      );
    },
    []
  );

  const removeScreen = useCallback((id: string) => {
    setScreens((currentScreens) => {
      if (currentScreens.length <= 2) return currentScreens;
      return currentScreens.filter((screen) => screen.id !== id);
    });
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const userScreen = screens.find((s) => s.isUserScreen);
      if (!userScreen) return;

      // Validate screens before navigating
      const validScreens = screens.filter(
        (screen) => screen.inch > 0 && screen.aspectRatio.trim() !== ""
      );

      if (validScreens.length < 2) {
        alert(
          "Please enter valid details for at least two screens to compare."
        );
        return;
      }

      const params = new URLSearchParams();
      const sortedScreens = [
        screens[0],
        ...screens.slice(1).sort((a, b) => a.inch - b.inch),
      ];
      sortedScreens.forEach((screen) => {
        params.append("screens", JSON.stringify(screen));
      });
      navigate(`/compare?${params.toString()}`);
    },
    [screens, navigate]
  );

  return (
    <div className="min-h-screen flex-col gap-10 overflow-y-auto bg-gradient-to-br flex justify-center items-center from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800 px-4 py-12">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl  font-bold tracking-tight text-zinc-800 dark:text-white mb-3">
          Screen Size Comparison
        </h1>
        <p className="text-xl  text-zinc-600 dark:text-zinc-300">
          Compare different screen sizes to see how they stack up against each
          other
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-md p-6 w-full max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-4">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-800 dark:text-white">
              Enter Screen Sizes
            </h2>
            <p className="text-zinc-600 dark:text-zinc-300">
              Enter the screen sizes and aspect ratios you want to compare.
            </p>
          </div>

          <div className="space-y-4">
            {screens.map((screen, index) => (
              <div
                key={screen.id}
                className={`p-4 rounded-lg border transition-all ${
                  screen.isUserScreen
                    ? "border-blue-300/30 bg-blue-50/50 dark:border-blue-500/20 dark:bg-blue-950/10"
                    : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"
                }`}
              >
                <div className="flex items-center mb-3">
                  <Monitor
                    className="size-5 text-zinc-500 dark:text-zinc-400 mr-2"
                    aria-hidden="true"
                  />
                  <h3 className="font-medium text-zinc-700 dark:text-zinc-200">
                    {screen.isUserScreen
                      ? "Your Screen"
                      : `Comparison Screen ${index}`}
                  </h3>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label
                      htmlFor={`inch-${screen.id}`}
                      className="text-sm text-zinc-500 dark:text-zinc-400"
                    >
                      Screen Size (inches)
                    </label>
                    <input
                      id={`inch-${screen.id}`}
                      type="number"
                      step="0.1"
                      min="0"
                      placeholder="e.g., 15.6"
                      value={screen.inch || ""}
                      onChange={(e) =>
                        updateScreen(
                          screen.id,
                          "inch",
                          e.target.value ? Number.parseFloat(e.target.value) : 0
                        )
                      }
                      className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:text-white"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor={`aspect-${screen.id}`}
                      className="text-sm text-zinc-500 dark:text-zinc-400"
                    >
                      Aspect Ratio
                    </label>
                    <input
                      id={`aspect-${screen.id}`}
                      type="text"
                      placeholder="e.g., 16:9"
                      value={screen.aspectRatio}
                      onChange={(e) =>
                        updateScreen(screen.id, "aspectRatio", e.target.value)
                      }
                      pattern="\d+:\d+"
                      title="Please use format like 16:9"
                      className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:text-white"
                      required
                    />
                  </div>
                </div>

                {!screen.isUserScreen && screens.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeScreen(screen.id)}
                    className="mt-3  inline-flex items-center text-sm text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                    aria-label={`Remove comparison screen ${index}`}
                  >
                    <Trash2 className="size-4 mr-1" aria-hidden="true" />
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={addScreen}
              className="inline-flex cursor-pointer items-center px-4 py-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-zinc-700 dark:text-zinc-200 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              aria-label="Add another screen for comparison"
            >
              <PlusCircle className="size-4 mr-2" aria-hidden="true" />
              Add Screen
            </button>
            <button
              type="submit"
              className="inline-flex cursor-pointer items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <BarChart3 className="size-4 mr-2" aria-hidden="true" />
              Compare Screens
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
