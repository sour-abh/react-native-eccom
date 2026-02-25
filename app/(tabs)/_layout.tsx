import { View, Text } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import { Feather, Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/assets/constants";
import { useCartContext } from "@/context/cartContext";

export default function TabLayout() {
  const color = COLORS.primary;
  const { cartItems } = useCartContext();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: "#708d81",
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: "#F0F0F0",
          height: 56,
          paddingTop: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View className="relative">
              <Feather
                name={focused ? "shopping-cart" : "shopping-cart"}
                size={24}
                color={color}
              />
              {cartItems.length > 0 && (
                <View className="absolute -top-2 -right-2 bg-red-400 rounded-full size-4  flex items-center justify-center">
                  <Ionicons name="ellipse" size={6} color={"#ffff"} />
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="favourite"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "heart" : "heart-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
