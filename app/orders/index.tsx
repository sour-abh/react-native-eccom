import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/Header";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Order } from "@/assets/constants/types";
import { dummyOrders, formatDate } from "@/assets/assets";
import { COLORS, getStatusColor } from "@/assets/constants";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";

export default function Orders() {
  const router = useRouter();
  const [order, setOrder] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    setOrder(dummyOrders as unknown as Order[]);
    setLoading(false);
  };
  useEffect(() => {
    fetchOrder();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["top"]}>
      <Header title="My Orders" showBack />
      {loading ? (
        <View className="flex-1 justify-center items-center ">
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : order.length === 0 ? (
        <View className="flex-1 items-center justify-center ">
          <Text className="text-lg font-bold text-gray-900">
            No Orders Found
          </Text>
        </View>
      ) : (
        <FlatList
          data={order}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => router.push(`/orders/${item.id}`)}
              className="bg-white p-4 rounded-xl mb-4 border border-gray-100 shadow-sm"
            >
              <View className="flex-row flex justify-between items-center mb-2">
                <Text className="text-base text-primary font-bold">
                  Order #{item.orderNumber}
                </Text>
                <Text className="text-sm text-secondary">
                  {formatDate(item.createdAt)}
                </Text>
              </View>

              {/* Status Badge */}
              <View className="flex-row gap-2 mb-3">
                <View
                  className="px-2 py-1 items-center justify-center rounded-full"
                  style={getStatusColor(item.orderStatus).container}
                >
                  <Text
                    className="text-xs font-bold capitalize"
                    style={getStatusColor(item.orderStatus).text}
                  >
                    {item.orderStatus}
                  </Text>
                </View>
                {/* Payment Status */}
                <View
                  className={`px-2 py-1 rounded-full ${item.paymentStatus === "paid" ? "bg-green-100" : "bg-gray-200"}`}
                >
                  <Text
                    className={`px-2 py-1 rounded-full ${item.paymentStatus === "paid" ? "text-green-700" : "text-gray-700"}`}
                  >
                    {item.paymentStatus}
                  </Text>
                </View>
              </View>

              {/* Payment Method */}
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-secondary text-xs">
                  Payment Method:{" "}
                  <Text className="text-primary  font-medium capitalize">
                    {item.paymentMethod}
                  </Text>
                </Text>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="mb-3"
              >
                {item.items.map((prod: any, index) => {
                  const image = prod.product?.images?.[0];
                  return (
                    <View
                      key={index}
                      className="mr-3 border border-gray-100 rounded-md p-1 bg-gray-50"
                    >
                      {image ? (
                        <Image
                          source={{ uri: image }}
                          className="w-12 h-12 rounded-md  "
                          resizeMode="cover"
                        />
                      ) : (
                        <View className="w-12 h-12 rounded-md bg-gray-200 flex items-center justify-center">
                          <Ionicons
                            name="image-outline"
                            size={24}
                            color={COLORS.primary}
                          />
                        </View>
                      )}
                    </View>
                  );
                })}
              </ScrollView>
              <View className="flex-row justify-between items-center mt-2 pt-3 border-t border-gray-100">
                <Text className="text-secondary">
                  Items: {item.items.length}
                </Text>
                <Text className="text-primary font-bold text-lg">
                  Total: ${item.totalAmount}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        ></FlatList>
      )}
    </SafeAreaView>
  );
}
