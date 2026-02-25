import { COLORS } from "@/assets/constants";
import { HeaderProps } from "@/assets/constants/types";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";

export default function Header({
  title,
  showBack,
  showCart,
  showSearch,
  showLogo,
  showMenu,
}: HeaderProps) {
  const router = useRouter();
  const itemCount = { itemsCount: 10 };
  return (
    <View className="flex flex-row items-center justify-between px-4 py-3 bg-white ">
      {/* left side */}
      <View className="flex-row items-center flex-1 ">
        {showBack && (
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        )}

        {showMenu && (
          <TouchableOpacity className="mr-3">
            <Ionicons name="menu-outline" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        )}
        {showLogo ? (
          <View className="flex-1">
            <Image
              source={require("@/assets/logo.png")}
              style={{ height: 24, width: "100%" }}
              resizeMode="contain"
            />
          </View>
        ) : (
          title && (
            <Text className="text-lg font-bold text-gray-900 text-center flex-1">
              {title}
            </Text>
          )
        )}

        {!title && !showSearch && <View className="flex-1"></View>}
      </View>

      {/* Right side */}
      <View className="flex-row items-center gap-4">
        {showSearch && (
          <TouchableOpacity>
            <Ionicons name="search-outline" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        )}
        {showCart && (
          <TouchableOpacity onPress={() => router.push("/(tabs)/cart")}>
            <View className="relative">
              <Ionicons name="bag-outline" size={24} color={COLORS.primary} />
              {itemCount?.itemsCount > 0 && (
                <View
                  className={`absolute -top-1 -right-1 ${itemCount?.itemsCount > 9 ? "w-5 bg-emerald-700" : "w-4 bg-accent"} rounded-full w-4 h-4 items-center justify-center`}
                >
                  <Text className="text-white  text-[10px]">
                    {itemCount?.itemsCount || 0}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
