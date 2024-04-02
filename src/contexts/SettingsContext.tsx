import { createContext, useState } from "react";
import merge from "lodash/merge";
// CUSTOM COMPONENT



// {settings?.themes[settings?.activeTheme]}>

export const SettingsContext = createContext({
  settings: {
    themes: ["light", "dark"],
    activeTheme: "light"
  },
  updateSettings: () => {}
});

export default function SettingsProvider({ settings, children } : {settings: any, children: any}) {
  const [currentSettings, setCurrentSettings] = useState(settings);

  const handleUpdateSettings = (update = {}) => {
    const marged = merge({}, currentSettings, update);
    setCurrentSettings(marged);
  };

  console.log(currentSettings, "currentSettings");

  return (
    <SettingsContext.Provider
      value={{ settings: currentSettings, updateSettings: handleUpdateSettings }}
    >
      {children}
    </SettingsContext.Provider>
  );
}
