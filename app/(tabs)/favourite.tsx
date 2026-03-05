import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import Header from "@/components/Header";
import WishlistCard from "@/components/wishlist-card";
import { Product } from "@/assets/constants/types";
import { useWishListStore } from "@/store/wishlist.store";
export default function Favourite() {
  const { wishList } = useWishListStore.getState();

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["top"]}>
      <Header title="WishList" showMenu showCart />
      {wishList && wishList.length > 0 ? (
        <ScrollView showsVerticalScrollIndicator={false} className="gap-2">
          <View className="mt-4 gap-2">
            {wishList.map((item: Product) => (
              <WishlistCard key={item.id} {...item} />
            ))}
          </View>
        </ScrollView>
      ) : (
        <View className="flex-1 items-center justify-center">
          <Text>No items in wishlist</Text>
          <Text className="text-primary font-bold items-center text-center">
            Start shopping
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}
