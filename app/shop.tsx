import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
// import {  useState } from "react";
// import { Product } from "@/assets/constants/types";
// import { dummyProducts } from "@/assets/assets";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/Header";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/assets/constants";
import { FlatList, TextInput } from "react-native-gesture-handler";
import ProductCard from "@/components/Products-item";
import { useProducts } from "@/hooks/useProducts";

export default function Shop() {

  const {data,isLoading,fetchNextPage,hasNextPage,isFetchingNextPage}=useProducts({limit:10})

  const loadMore = () => {
    if (!isLoading && !isFetchingNextPage && hasNextPage) {
      fetchNextPage()
    }
  };
  return (
    <SafeAreaView className="flex-1 bg-surface " edges={["top"]}>
      <Header title="Shop" showBack showCart />

      <View className="flex-row gap-2 mb-4 mx-4 my-2">
        {/* Search Icon */}
        <View className="flex-1 flex-row items-center bg-white rounded-xl border border-gray-100">
          <Ionicons
            name="search"
            size={20}
            color={COLORS.secondary}
            className="ml-4"
          />
          <TextInput
            placeholder="Search products ...."
            className="flex-1 ml-2 text-primary px-4 py-3"
            returnKeyType="search"
          />
        </View>
        {/* Filter icon */}
        <TouchableOpacity className="bg-primary rounded-xl text-white ">
          <Ionicons
            name="options-outline"
            size={20}
            color="white"
            className="p-3"
          />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={COLORS.secondary} />
        </View>
      ) : (
        <FlatList
          horizontal={false}
          data={data?.flattenedData || []}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View className="w-1/2">
              <ProductCard product={item} />
            </View>
          )}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetchingNextPage ? (
              <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color={COLORS.secondary} />
              </View>
            ) : null
          }
          ListEmptyComponent={
            !isLoading && (
              <View>
                <Text>No products found</Text>
              </View>
            )
          }
        ></FlatList>
      )}
    </SafeAreaView>
  );
}
