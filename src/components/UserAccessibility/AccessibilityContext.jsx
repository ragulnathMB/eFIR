// AccessibilityContext.js
import React, { createContext, useState, useContext } from 'react';

// Create a context to hold the accessibility settings
const AccessibilityContext = createContext();

// Create a provider component to wrap the application and provide the accessibility settings
export const AccessibilityProvider = ({ children }) => {
  const [textSize, setTextSize] = useState(16); // Default text size
  const [colorMode, setColorMode] = useState('normal'); // 'normal', 'high', 'dark'

  // Increase text size
  const increaseTextSize = () => {
    if (textSize < 24) {
      setTextSize(textSize + 2);
      console.log(textSize);
    }
  };

  // Decrease text size
  const decreaseTextSize = () => {
    if (textSize > 10) {
      setTextSize(textSize - 2);
    }
  };

  // Reset text size
  const resetTextSize = () => {
    setTextSize(16);
  };

  // Toggle High Contrast mode
  const toggleHighContrast = () => {
    setColorMode(colorMode === 'high' ? 'normal' : 'high');
  };

  // Toggle Dark Contrast mode
  const toggleDarkContrast = () => {
    setColorMode(colorMode === 'dark' ? 'normal' : 'dark');
  };

  return (
    <AccessibilityContext.Provider
      value={{
        textSize,
        colorMode,
        increaseTextSize,
        decreaseTextSize,
        resetTextSize,
        toggleHighContrast,
        toggleDarkContrast,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

// Custom hook to use accessibility context in any component
export const useAccessibility = () => {
  return useContext(AccessibilityContext);
};
