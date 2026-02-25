import { Stack } from "expo-router";
import "../global.css";
import { CartProvider } from "@/context/cartContext";
import { WhishlistProvider } from "@/context/WhishListContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <CartProvider>
        <WhishlistProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </WhishlistProvider>
      </CartProvider>
      <Toast />
    </GestureHandlerRootView>
  );
}
