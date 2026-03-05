import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import React, { useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/Header";
import { COLORS } from "@/assets/constants";
import { useRouter } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";
import CartItemCard from "@/components/cartItemCard";
import { useCart } from "@/hooks/useCart";
export default function Cart() {
  const router = useRouter();
  const { data, isLoading } = useCart();
  const cartItems = data?.cartItems || [];
  const totalItems = cartItems.length;
  const totalPrice = data?.totalPrice || 0;
  const shipping = 10;
  const tax = 5;
  const total = useMemo(() => {
    return totalPrice + shipping + tax;
  }, [totalPrice, shipping, tax]);
  return (
    <SafeAreaView className="flex-1 bg-surface " edges={["top"]}>
      <Header title="Cart" showBack showSearch />
      {isLoading ? (
        <ActivityIndicator size="large" color={COLORS.primary} />
      ) : totalItems < 0 ? (
        <View className="flex-1">
          <Text className="text-2xl font-bold text-center text-gray-900">
            Cart is Empty
          </Text>
          <TouchableOpacity className="mt-4" onPress={() => router.push("/")}>
            <Text className="text-2xl font-bold text-center bg-gray-900 text-white p-2 rounded">
              Start Shopping
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <ScrollView
            className="flex-1  mt-4"
            showsVerticalScrollIndicator={false}
          >
            {cartItems.map((item: any) => (
              <CartItemCard key={item.id} {...item} />
            ))}
          </ScrollView>
          <View className="px-2 pb-2  ">
            <View className="bg-stone-400/20 backdrop-blur-3xl rounded-xl p-2 ">
              <View className="flex flex-row justify-between items-center">
                <Text className=" text-zinc-700 text-base">Subtotal: </Text>
                <Text className=" text-zinc-700 text-base font-semibold">
                  ${totalPrice.toFixed(2)}
                </Text>
              </View>

              <View className="flex flex-row justify-between items-center">
                <Text className=" text-zinc-700 text-base">Shipping: </Text>
                <Text className=" text-zinc-700 text-base font-semibold">
                  ${shipping.toFixed(2)}
                </Text>
              </View>
              <View className="flex flex-row justify-between items-center">
                <Text className=" text-zinc-700 text-base">taxes: </Text>
                <Text className=" text-zinc-700 text-base font-semibold">
                  ${tax.toFixed(2)}
                </Text>
              </View>
              <View className="flex flex-row justify-between items-center">
                <Text className=" text-zinc-700 text-base font-semibold">
                  Total:
                </Text>
                <Text className=" text-amber-700 text-lg  font-bold">
                  ${total.toFixed(2)}
                </Text>
              </View>
            </View>

            <View className="mt-4 ">
              <TouchableOpacity
                className="rounded-xl py-2.5 w-full bg-zinc-900 text-white  font-semibold"
                onPress={() => router.push("/checkout")}
              >
                <Text
                  className="text-center text-white font-semibold"
                  style={{ fontFamily: "oxanium-bold" }}
                >
                  Checkout
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}
