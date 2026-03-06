import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/Header";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, PROFILE_MENU } from "@/assets/constants";
import { useAuthStore } from "@/store/auth.store";

export default function Profile() {

  const user =useAuthStore((state)=>state.user)
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["top"]}>
      <Header title="Profile" showMenu showCart />
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1 px-4"
        contentContainerStyle={
          !user
            ? {
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                paddingTop: 16,
              }
            : {}
        }
      >
        <View className="flex-1 items-center justify-center">
          {!user ? (
            //guest user screen
            <View className=" items-center w-full mt-10">
              <View className="w-24 h-24 rounded-full bg-gray-200 items-center justify-center mb-6">
                <Ionicons name="person" size={40} color={COLORS.secondary} />
              </View>
              <Text className="text-xl font-bold text-gray-800 mb-2">
                Welcome to Our Store
              </Text>
              <Text className="text-gray-600 mb-6">
                Sign in to enjoy exclusive benefits
              </Text>
              <View className="flex-row gap-2 items-center">
              <TouchableOpacity
                onPress={() => {
                  router.push("/auth/login");
                }}
                className="bg-primary px-6 py-3 rounded-full"
              >
                <Text className="text-white font-bold">Log In</Text>
              </TouchableOpacity>
                            <TouchableOpacity
                onPress={() => {
                  router.push("/auth/signin");
                }}
                className="bg-secondary px-6 py-3 rounded-full"
              >
                <Text className="text-white font-bold">Sign Up</Text>
              </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View className="flex-1 items-center justify-center my-8 w-full">
              <View className="items-center">
                <View className="mb-3">
                  <Image
                    source={{ uri: user.imageUrl }}
                    className="size-20 rounded-full shadow-lg border-2 border-white"
                  />
                </View>

                <Text className="text-xl font-bold text-gray-800 mb-1">
                  {user.firstName + " " + user.lastName}
                </Text>
                <Text className="text-gray-600 mb-6">{user.email}</Text>
                {user?.role === "ADMIN" && (
                  <TouchableOpacity
                    onPress={() => {
                      router.push("/admin");
                    }}
                    className="bg-primary rounded-full px-6 py-3 mt-4 "
                  >
                    <Text className="text-white font-bold">Admin Panel</Text>
                  </TouchableOpacity>
                )}
              </View>
              {/* Menu */}
              <View className="w-full mt-4">
                {PROFILE_MENU.map((item) => {
                  return (
                    
                      <TouchableOpacity
                        key={item.id}
                        onPress={() => router.push(item.route as any)}
                        className="flex-row items-center justify-between bg-gray-100 p-4 rounded-xl mb-2 border border-gray-200 w-full"
                      >
                        <View className="flex-row items-center">
                          <View className="bg-primary/10 p-2 rounded-lg mr-4">
                            <Ionicons
                              name={item?.icon as any}
                              size={24}
                              color={COLORS.primary}
                            />
                          </View>
                          <Text className="text-gray-800 font-bold">
                            {item.title}
                          </Text>
                        </View>
                        <Ionicons
                          name="chevron-forward"
                          size={24}
                          color={COLORS.secondary}
                        />
                      </TouchableOpacity>
                    
                  );
                })}
              </View>
              {/* Logout button */}
              <TouchableOpacity className="bg-gray-200 rounded-xl px-6 py-3 mt-4 w-full text-center items-center border border-gray-300">
                <Text className="text-red-500 font-bold text-lg">Logout</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
