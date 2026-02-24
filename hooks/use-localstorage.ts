import { useEffect, useState } from "react";

function useLocalStorage(key: string, initialValue: any) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key);
      if (stored === null) return initialValue;
      return JSON.parse(stored);
    } catch (error) {
      console.error("error reading Local Storage", error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error(err);
    }
  }, [value, key]);
  return [value, setValue];
}
export default useLocalStorage;
