import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/useTheme';
import { Monitor, Sun, Moon } from 'lucide-react';

const ThemeSwitch = () => {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const themeOptions = [
    { value: 'system', icon: Monitor, label: 'System' },
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'dark', icon: Moon, label: 'Dark' }
  ];

  const toggleThemeMenu = () => {
    setIsOpen(!isOpen);
  };

  const selectTheme = (selectedTheme: 'system' | 'light' | 'dark') => {
    setTheme(selectedTheme);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <motion.button
        onClick={toggleThemeMenu}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-gray-200 dark:bg-gray-700 p-2 rounded-full flex items-center justify-center"
      >
        {themeOptions.find(option => option.value === theme)?.icon && 
          React.createElement(themeOptions.find(option => option.value === theme)!.icon, {
            className: "w-5 h-5 text-gray-600 dark:text-gray-300"
          })
        }
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 top-full mt-2 bg-white dark:bg-gray-800 shadow-lg rounded-lg border dark:border-gray-700 overflow-hidden"
          >
            {themeOptions.map((option) => (
              <motion.button
                key={option.value}
                onClick={() => selectTheme(option.value as 'system' | 'light' | 'dark')}
                whileHover={{ backgroundColor: 'rgba(0,0,0,0.1)' }}
                className={`w-full flex items-center p-2 space-x-2 text-left 
                  ${theme === option.value 
                    ? 'bg-blue-100 dark:bg-blue-900' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
              >
                {React.createElement(option.icon, { 
                  className: `w-5 h-5 ${
                    theme === option.value 
                      ? 'text-blue-600 dark:text-blue-300' 
                      : 'text-gray-600 dark:text-gray-300'
                  }`
                })}
                <span className={
                  theme === option.value 
                    ? 'text-blue-600 dark:text-blue-300 font-semibold' 
                    : 'text-gray-600 dark:text-gray-300'
                }>
                  {option.label}
                </span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemeSwitch;