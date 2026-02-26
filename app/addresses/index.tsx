import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import { dummyAddress } from "@/assets/assets";
import { Address } from "@/assets/constants/types";
import { COLORS } from "@/assets/constants";
import { ScrollView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";

export default function Addresses() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  //Form State
  const [type, setType] = useState("Home");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  //Edit state

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchAddresses = async () => {
    const addresses = dummyAddress as any;
    setAddresses(addresses);
    setLoading(false);
  };
  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleEditSearch = (item: Address) => {
    setIsEditing(true);
    setEditingId(item.id);
    setType(item.type);
    setStreet(item.street);
    setCity(item.city);
    setState(item.state);
    setZipCode(item.zipCode);
    setCountry(item.country);
    setIsDefault(item.isDefault);
    setModalVisible(true);
  };

  const handleSaveAddress = async () => {
    setModalVisible(false);
    resetForm();
    fetchAddresses();
  };

  const handleDeleteAddress = async (id: string) => {};

  const resetForm = () => {
    setStreet("");
    setCity("");
    setState("");
    setZipCode("");
    setCountry("");
    setType("Home");
    setIsDefault(false);
    setIsEditing(false);
    setEditingId(null);
  };

  const openAddModal = () => {
    resetForm();
    setModalVisible(true);
  };

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["top"]}>
      <Header title="Shipping Addresses" showBack />

      {loading ? (
        <View className="flex-1 justify-center items-center">
          {" "}
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1 mt-4 px-4 "
        >
          {addresses.length === 0 ? (
            <View className="flex-1 justify-center items-center">
              {" "}
              <Text className="text-gray-900">No addresses found</Text>
            </View>
          ) : (
            addresses.map((address) => {
              return (
                <View
                  key={address.id}
                  className="bg-white p-4 rounded-xl mb-4 shadow-sm"
                >
                  <View className="flex-row items-center justify-between mb-2">
                    <View className="flex-row items-center">
                      <Ionicons
                        name={
                          address.type === "Home"
                            ? "home-outline"
                            : "briefcase-outline"
                        }
                        size={20}
                        color={COLORS.primary}
                      />
                      <Text className="text-gray-900 font-semibold ml-2">
                        {address.type}
                      </Text>
                      {address.isDefault && (
                        <View className="bg-primary/10 px-2 py-1 rounded ml-2">
                          <Text className="text-primary text-xs font-bold">
                            Default
                          </Text>
                        </View>
                      )}
                    </View>
                    <View className="flex-row items-center gap-4">
                      <TouchableOpacity
                        onPress={() => handleEditSearch(address)}
                      >
                        <Ionicons
                          name="pencil-outline"
                          size={20}
                          color={COLORS.secondary}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleDeleteAddress(address.id)}
                      >
                        <Ionicons
                          name="trash-outline"
                          size={20}
                          color={COLORS.error || "red"}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <Text className="text-secondary leading-5 ml-7">
                    {address.street}, {address.city}, {address.state}{" "}
                    {address.zipCode}, {address.country}
                  </Text>
                </View>
              );
            })
          )}
          <TouchableOpacity
            className="flex-row items-center justify-center p-4 border border-dashed border-gray-300 rounded-xl mt-2 mb-8 bg-gray-100"
            onPress={openAddModal}
          >
            <Ionicons name="add" size={24} color={COLORS.secondary} />
            <Text className="text-secondary font-medium ml-2">
              Add New Address
            </Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
