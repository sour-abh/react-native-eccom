import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "expo-router";
import { dummyAddress } from "@/assets/assets";
import { Address } from "@/assets/constants/types";
import Toast from "react-native-toast-message";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "@/assets/constants";
import Header from "@/components/Header";
import { ScrollView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { useCart } from "@/hooks/useCart";

export default function Checkout() {
  const router = useRouter();
  const { data } = useCart();
  const totalPrice = data?.totalPrice || 0;
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [Address, setAddress] = useState<Address | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "STRIPE">(
    "STRIPE",
  );
  const shipping = 2.0;
  const tax = 0.5;
  const total = useMemo(() => {
    return totalPrice + shipping + tax;
  }, [totalPrice, shipping, tax]);
  const fetchAddress = async () => {
    const addrList = dummyAddress;
    if (addrList.length > 0) {
      const defaultAddr =
        addrList.find((addr: any) => addr.isDefault) || addrList[0];
      setAddress(defaultAddr as Address);
    }
    setPageLoading(false);
  };

  const handlePlaceOrder = async () => {
    if (!Address) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please select an address",
      });
      return;
    }

    if (paymentMethod === "STRIPE") {
      return Toast.show({
        type: "info",
        text1: "Stripe Payment",
        text2: "Stripe payment integration will be implemented soon",
      });
      //cash on delivery
    }
    router.replace("/orders");
  };
  useEffect(() => {
    fetchAddress();
  }, []);

  if (pageLoading) {
    return (
      <SafeAreaView className="bg-surface flex-1 justify-center items-center">
        <ActivityIndicator size={"large"} color={COLORS.primary} />
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["top"]}>
      <Header title="Checkout" showBack />
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 mt-4 ">
        <View className="px-4">
          {/* address section */}
          <View className="flex flex-col items-start gap-4 ">
            <Text className="text-lg font-bold text-gray-900">
              Shipping Address
            </Text>

            {Address ? (
              <View className="bg-white p-4 rounded-xl mb-6 shadow-lg w-full">
                <View className="flex flex-row justify-between items-center mb-2">
                  <Text className="text-base font-bold">{Address.type}</Text>
                  <TouchableOpacity onPress={() => router.push("/addresses")}>
                    <Text className="text-sm text-accent">Change</Text>
                  </TouchableOpacity>
                </View>
                <Text className="text-secondary text-sm ">
                  {Address.street},{Address.city}
                  {"\n"}
                  {Address.state},{Address.zipCode}
                  {"\n"}
                  {Address.country}
                </Text>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => router.push("/addresses")}
                className="bg-gray-300 rounded-xl py-2.5 w-full flex flex-row items-center gap-2 justify-center"
              >
                <Ionicons name="add" size={24} color={COLORS.primary} />
                <Text className="text-center text-gray-900 font-semibold">
                  Add Address
                </Text>
              </TouchableOpacity>
            )}
          </View>
          {/* Payment section */}
          <Text className="text-lg font-bold text-gray-900 mb-4">
            Payment Method
          </Text>
          <View className="flex flex-row justify-between items-center gap-2 mb-2 w-full">
            <TouchableOpacity
              onPress={() => setPaymentMethod("STRIPE")}
              className={
                paymentMethod === "STRIPE"
                  ? "bg-white border-2 border-primary p-4 rounded-xl mb-6 shadow-xl relative w-[48%]   "
                  : "bg-white border-2 border-transparent p-4 rounded-xl mb-6 shadow-lg relative w-[48%] "
              }
            >
              <View className="flex flex-col items-start gap-2 ">
                <Ionicons name="card" size={24} color={COLORS.primary} />
                <Text className="text-base font-bold text-gray-900">
                  STRIPE
                </Text>
                <Text className="text-secondary text-sm">Pay with Stripe</Text>
              </View>
              {paymentMethod === "STRIPE" && (
                <Ionicons
                  name="shield-checkmark"
                  size={24}
                  color={COLORS.primary}
                  className="absolute top-2 right-2"
                />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setPaymentMethod("CASH")}
              className={
                paymentMethod === "CASH"
                  ? "bg-white border-2 border-primary p-4 rounded-xl mb-6 shadow-xl relative w-[48%] "
                  : "bg-white border-2 border-transparent p-4 rounded-xl mb-6 shadow-lg relative w-[48%] "
              }
            >
              <View className="flex flex-col items-start gap-2 ">
                <Ionicons name="wallet" size={24} color={COLORS.primary} />
                <Text className="text-base font-bold text-gray-900">CASH</Text>
                <Text className="text-secondary text-xs">Cash on delivery</Text>
              </View>
              {paymentMethod === "CASH" && (
                <Ionicons
                  name="shield-checkmark"
                  size={24}
                  color={COLORS.primary}
                  className="absolute top-2 right-2"
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      {/* Order Summary */}
      <View className="px-4 pb-4">
        <View className="bg-white p-4 rounded-xl mb-6 shadow-lg">
          <Text className="text-lg font-bold text-gray-900 mb-4">
            Order Summary
          </Text>
          <View className="flex flex-col items-start gap-1.5 w-full">
            <View className="flex flex-row justify-between items-center w-full">
              <Text className="text-base font-medium text-secondary">
                Subtotal:
              </Text>
              <Text className="text-base font-semibold text-primary">
                ${totalPrice.toFixed(2)}
              </Text>
            </View>
            <View className="flex flex-row justify-between items-center w-full">
              <Text className="text-base font-medium text-secondary">
                Shipping:
              </Text>
              <Text className="text-base font-semibold text-primary">
                ${shipping.toFixed(2)}
              </Text>
            </View>
            <View className="flex flex-row justify-between items-center w-full mb-4">
              <Text className="text-base font-medium text-secondary">Tax:</Text>
              <Text className="text-base font-semibold text-primary">
                ${tax.toFixed(2)}
              </Text>
            </View>
            <View className="flex flex-row justify-between items-center w-full">
              <Text className="text-lg font-bold text-gray-900">Total:</Text>
              <Text className="text-lg font-bold text-cyan-800">
                ${total.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          className={`rounded-xl py-4 mb-2 items-center w-full bg-zinc-900 text-white  font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed `}
          disabled={loading}
          onPress={() => handlePlaceOrder()}
        >
          {loading ? (
            <ActivityIndicator size={"large"} color={"#fff"} />
          ) : (
            <Text
              className="text-center text-white font-semibold"
              style={{ fontFamily: "oxanium-bold" }}
            >
              Place Order
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
