import { useEffect, useState } from "react";

// Fallback to simple state storage to prevent crashes in Expo Go
function useLocalStorage(key: string, initialValue: any) {
  const [value, setValue] = useState(() => {
    // In React Native, window.localStorage doesn't exist.
    // We should use AsyncStorage, but for now we'll use a simple state
    // to allow the app to boot and avoid the MMKV NitroModules error.
    return initialValue;
  });

  // You should install @react-native-async-storage/async-storage for real persistence:
  // npx expo install @react-native-async-storage/async-storage

  return [value, setValue];
}

export default useLocalStorage;
