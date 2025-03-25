import { useEffect, useState } from "react";

const useTheme = () => {
  // Initialize theme from local storage or use system preference
  const getInitialTheme = () => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      return savedTheme;
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  const [theme, setTheme] = useState(getInitialTheme);

  const changeTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleSystemThemeChange = (e) => {
      const systemTheme = e.matches ? "dark" : "light";
      if (!localStorage.getItem("theme")) {
        setTheme(systemTheme);
        document.documentElement.classList.toggle(
          "dark",
          systemTheme === "dark"
        );
      }
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);

    // Apply theme on initial load based on local storage
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Cleanup event listener on unmount
    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, [theme]);

  return { theme, changeTheme };
};

export default useTheme;
