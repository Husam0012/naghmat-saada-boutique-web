'use client';

import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // اقرأ الوضع من localStorage
    const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const root = window.document.documentElement;

    if (storedTheme === 'dark') {
      root.classList.add('dark');
      setTheme('dark');
    } else {
      root.classList.remove('dark');
      setTheme('light');
    }
  }, []);

  const toggleTheme = () => {
    const root = window.document.documentElement;

    if (theme === 'light') {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setTheme('dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setTheme('light');
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md border border-gray-400 dark:border-gray-200 bg-white dark:bg-gray-800 text-black dark:text-white hover:shadow transition"
    >
      {theme === 'dark' ? 'وضع النهار' : 'وضع الليل'}
    </button>
  );
}