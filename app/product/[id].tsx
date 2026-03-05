import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { dummyProducts } from "@/assets/assets";
import { Product } from "@/assets/constants/types";
import { Feather, Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/assets/constants";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useWishListStore } from "@/store/wishlist.store";
import { useCart } from "@/hooks/useCart";
import CartResource from "@/api/CartResource";
import { useAddToCart } from "@/hooks/useAddToCart";
import { useUpdateCartItems } from "@/hooks/useUpdateCartItems";
export default function ProductDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const width = useWindowDimensions().width;
  const { isInWishlist, toggleWishlist } = useWishListStore.getState();
  let isLiked = false;

  isLiked = isInWishlist(id);

  const { data } = useCart();
  const cartItems = data?.cartItems || [];
  const totalItems = cartItems?.totalItems || "0";

  const { mutateAsync: addToCart } = useAddToCart();
  const { mutateAsync: updateCartItems } = useUpdateCartItems();
  const handleAddtoCart = async (product: Product) => {
    const response = await addToCart(product);
    if (response) {
      Toast.show({
        type: "success",
        text1: "Added to Cart",
      });
    }
  };
  const handleUpdateCartItems = async (id: string, item: any) => {
    const response = await updateCartItems({ id, item });
    if (response) {
      Toast.show({
        type: "success",
        text1: "Updated Cart",
      });
    }
  };
  const quantity = cartItems.find(
    (item: any) => item.product.id === product?.id,
  )?.quantity;

  useEffect(() => {
    if (id) {
      const foundProduct = cartItems.find((p: any) => p.id === id);
      setProduct(foundProduct ?? null);
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Text style={styles.errorText}>Product not found</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header Image */}
      <View className="relative">
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={(e) => {
            const index = Math.round(
              e.nativeEvent.contentOffset.x /
                e.nativeEvent.layoutMeasurement.width,
            );
            if (index !== activeImageIndex) {
              setActiveImageIndex(index);
            }
          }}
        >
          {product?.images.map((image, index) => (
            <Image
              key={index}
              source={{ uri: image }}
              style={{ width: width, height: 450 }}
              className="w-full h-[450px] object-cover"
              resizeMode="cover"
            />
          ))}
        </ScrollView>
        <View className=" absolute left-0 bottom-[60px] w-full">
          <View className="flex-row justify-center w-full">
            {product.images.map((_, index) => (
              <View
                key={index}
                className={` h-3 rounded-full mx-1 transition-all  duration-500 ease-in-out ${index === activeImageIndex ? "bg-zinc-700 w-6" : "bg-gray-300 w-3 "}`}
              />
            ))}
          </View>
        </View>
      </View>
      <TouchableOpacity onPress={() => router.back()} style={styles.backIcon}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          if (product) {
            toggleWishlist(product);
            Toast.show({
              type: "success",
              text1: "Wishlist Updated",
              text2: isLiked ? "Removed from wishlist" : "Added to wishlist",
            });
          }
        }}
        style={styles.heartIcon}
      >
        <Ionicons
          name={isLiked ? "heart" : "heart-outline"}
          size={24}
          color={isLiked ? COLORS.accent : "#000"}
        />
      </TouchableOpacity>

      {/* Product Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{product.name}</Text>
        <View className="flex-row justify-between items-center gap-2 w-full">
          <Text style={styles.price}>${product.price.toString()}</Text>
          <View className="flex-row items-center gap-1">
            <Text>{product.ratings.toString()}</Text>
            <Ionicons name="star" size={20} color="#FFD700" />
          </View>
        </View>

        <View style={styles.divider} />
        {product?.description && (
          <View>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>
        )}
        {product.sizes && product.sizes.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Available Sizes</Text>
            <View style={styles.sizeContainer}>
              {product.sizes.map((size) => (
                <View key={size}>
                  <TouchableOpacity
                    key={size}
                    onPress={() => setSelectedSize(size)}
                    className={`${selectedSize === size ? "bg-zinc-900 text-white " : ""} px-4 py-2 border rounded-lg border-[#E0E0E0] bg-[#F9F9F9] transition-all duration-300 ease-in-out `}
                  >
                    <Text
                      className={`text-[12px] font-bold ${selectedSize === size ? "text-white" : "text-gray-700"}`}
                    >
                      {size}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </>
        )}
        <View className="flex-row justify-between items-center gap-2 w-full mb-5">
          {cartItems.find((item: any) => item.product.id === product.id) ? (
            <View className="flex flex-row justify-between items-center  w-[80%] gap-4">
              <TouchableOpacity
                disabled={(quantity ?? 0) <= 0}
                onPress={() =>
                  handleUpdateCartItems(product.id, { quantity: quantity - 1 })
                }
                className="items-center px-3 py-3 mt-2.5  bg-gray-700  rounded-2xl shadow-lg elevation-[2] border border-gray-800 relative "
              >
                <Ionicons
                  name="remove"
                  size={24}
                  className="transition-transform duration-200"
                  color={"#ffff"}
                />
              </TouchableOpacity>
              <Text className="text-zinc-700  font-bold text-[24px] ">
                {
                  cartItems.find((item: any) => item.product.id === product.id)
                    ?.quantity
                }
              </Text>
              <TouchableOpacity
                disabled={product.stock < (quantity ?? 0)}
                onPress={() => handleAddtoCart(product)}
                className="items-center px-3 py-3 mt-2.5  bg-gray-700  rounded-2xl shadow-lg elevation-[2] border border-gray-800 relative "
              >
                <Ionicons
                  name="add"
                  size={24}
                  className="transition-transform duration-200"
                  color={"#ffff"}
                />
              </TouchableOpacity>
              <TouchableOpacity className="items-center px-3 py-3 mt-2.5  bg-gray-200  rounded-2xl shadow-lg elevation-[2] border border-gray-300 relative ">
                <Ionicons
                  name="trash"
                  size={30}
                  className="transition-transform duration-200 hover:rotate-12"
                  color={COLORS.accent}
                />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.addToCartButton}
              onPress={() => {
                if (product) {
                  handleAddtoCart(product);
                }
                // Add to cart logic would go here
              }}
            >
              <Text style={styles.addToCartText}>Add to Cart</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => router.push("/cart")}
            className="items-center px-3 py-3 mt-2.5  bg-gray-200 w-1/5 rounded-2xl shadow-lg elevation-[2] border border-gray-300 relative "
          >
            <Feather name="shopping-cart" size={30} color={"#000"} />
            {totalItems > 0 && (
              <View className="absolute top-[-8] right-[-8] bg-red-400/80 rounded-full w-8 h-8 items-center justify-center">
                <Text className="text-white text-[12px] font-bold">
                  {totalItems.toString()}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: 450,
  },
  backIcon: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 25,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  heartIcon: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 25,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  infoContainer: {
    padding: 24,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  price: {
    fontSize: 22,
    color: COLORS.accent || "#FF4C3B",
    fontWeight: "600",
    marginTop: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 8,
    marginTop: 10,
  },
  description: {
    fontSize: 15,
    color: COLORS.secondary,
    lineHeight: 24,
    marginBottom: 20,
  },
  sizeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 30,
  },
  sizeBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#F9F9F9",
  },

  addToCartButton: {
    width: "80%",
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 10,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  addToCartText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  errorText: {
    fontSize: 18,
    color: COLORS.secondary,
  },
  backButton: {
    marginTop: 20,
    padding: 12,
  },
  backButtonText: {
    color: COLORS.primary,
    fontWeight: "600",
    fontSize: 16,
  },
});
