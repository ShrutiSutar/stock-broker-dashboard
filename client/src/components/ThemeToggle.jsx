import { useEffect, useState } from "react";

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light") {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (isDark) {
      localStorage.setItem("theme", "light");
      document.documentElement.classList.remove("dark");
      document.body.style.background = "#f8fafc";
      document.body.style.color = "#1e293b";
    } else {
      localStorage.setItem("theme", "dark");
      document.documentElement.classList.add("dark");
      document.body.style.background =
        "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)";
      document.body.style.color = "white";
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-slate-800 border border-cyan-500/30 flex items-center justify-center hover:bg-slate-700 transition-all shadow-lg hover:shadow-cyan-500/20"
      title="Toggle theme"
    >
      <span className="text-xl">{isDark ? "☀️" : "🌙"}</span>
    </button>
  );
};

export default ThemeToggle;
