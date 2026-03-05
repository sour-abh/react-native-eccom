import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/Header";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BANNERS, dummyProducts } from "@/assets/assets";
import { Image } from "react-native";
import { useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { CATEGORIES, COLORS } from "@/assets/constants";
import CategoriesItem from "@/components/Categories-item";
import { Product } from "@/assets/constants/types";
import ProductCard from "@/components/Products-item";
import { useCart } from "@/hooks/useCart";

export default function Home() {
  const { width } = useWindowDimensions();

  const router = useRouter();
  const [activeBanner, setActiveBanner] = useState(0);
  const Categories = [{ id: "all", name: "All", icon: "grid" }, ...CATEGORIES];
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch cart data once at parent level
  const { data: cartData } = useCart();

  const fetchProducts = async () => {
    setProducts(dummyProducts);
    setLoading(false);
  };
  useEffect(() => {
    fetchProducts();
  }, []);
  return (
    <SafeAreaView className="flex-1" edges={["top"]}>
      <Header title="Forever" showLogo showSearch showCart showMenu />
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        <View className="mb-6 ">
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            snapToInterval={width - 32}
            snapToAlignment="center"
            decelerationRate="fast"
            className="w-full h-48 rounded-xl "
            scrollEnabled
            scrollEventThrottle={16}
            onScroll={(e) => {
              const index = Math.round(
                e.nativeEvent.contentOffset.x /
                  e.nativeEvent.layoutMeasurement.width,
              );
              if (index !== activeBanner) {
                setActiveBanner(index);
              }
            }}
          >
            {BANNERS.map((Banner) => {
              return (
                <View
                  key={Banner.id}
                  className="relative h-48 w-full bg-gray-300 overflow-hidden  rounded-lg    "
                  style={{ width: width - 32 }}
                >
                  <Image
                    source={{ uri: Banner.image }}
                    className="w-full h-full bg-black/20"
                    resizeMode="cover"
                    alt={Banner.title}
                  />
                  <View className="absolute bottom-4 left-4 z-10 ">
                    <Text className="text-2xl font-bold text-white">
                      {Banner.title}
                    </Text>
                    <Text className="text-lg font-medium text-white">
                      {Banner.subtitle}
                    </Text>
                    <TouchableOpacity className="bg-white px-4 py-2 rounded-full mt-2 self-start">
                      <Text className="text-primary font-bold text-xs">
                        Shop Now
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View className="absolute  w-full h-full bg-black/20 inset-0" />
                </View>
              );
            })}
          </ScrollView>
          {/* pagination dots */}
          <View className="flex-row justify-center mt-4 w-full">
            {BANNERS.map((_, index) => (
              <View
                key={index}
                className={` h-2 rounded-full mx-1 transition-all duration-500 ease-in-out ${index === activeBanner ? "bg-primary w-6" : "bg-gray-300 w-2"}`}
              />
            ))}
          </View>
        </View>

        {/* Categories */}
        <View className="mb-6 w-full">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-bold text-gray-900">Categories</Text>

            {/* <TouchableOpacity className="flex-row items-center gap-2">
              <Text className="text-primary font-bold text-xs">View All</Text>
              <Ionicons name="arrow-forward" size={16} color={COLORS.primary} />
            </TouchableOpacity> */}
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="w-full "
          >
            <View className="flex-row items-center justify-between gap-4">
              {Categories.map((category) => (
                <CategoriesItem
                  key={category.id}
                  item={category}
                  isSelected={false}
                  onPress={() =>
                    router.push({
                      pathname: `/shop`,
                      params: {
                        category: category.id === "all" ? "all" : category.name,
                      },
                    })
                  }
                />
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Products */}
        <View className="mb-6 w-full">
          <View className="flex-row items-center justify-between  mb-4">
            <Text className="text-lg font-bold text-gray-900">
              Popular Products
            </Text>

            <TouchableOpacity
              onPress={() => router.push("/shop")}
              className="flex-row items-center gap-2"
            >
              <Text className="text-primary font-bold text-xs">View All</Text>
              <Ionicons name="arrow-forward" size={16} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
          {loading ? (
            <ActivityIndicator
              size="large"
              color={COLORS.primary}
              className="mt-20 justify-center flex items-center "
            />
          ) : (
            <View className=" w-full  flex flex-wrap flex-row justify-between gap-2">
              {products
                .filter((product) => product.isFeatured === true)
                .map((product, index) => (
                  <View key={index} className="w-[49%] ">
                    <ProductCard product={product} cartData={cartData} />
                  </View>
                ))}
            </View>
          )}
        </View>

        {/* CTA */}
        <View className="bg-gray-100 p-6 rounded-2xl mb-20 items-center">
          <Text className="text-2xl font-bold text-primary mb-2  tex-center">
            JOIN THE REVOLUTION
          </Text>
          <Text className="text-secondary mb-2 text-center">
            Subscribe to our newsletter and get 10% discount on all of your
            purchases
          </Text>
          <TouchableOpacity className="bg-gray-800 py-4 px-4 rounded-full text-center mt-2.5 w-4/5">
            <Text className="text-white font-bold text-base text-center">
              Subscribe Now
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
