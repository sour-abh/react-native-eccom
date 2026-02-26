import { COLORS } from "@/assets/constants";
import { Product } from "@/assets/constants/types";
import { useCartContext } from "@/context/cartContext";
import { useWhishlist } from "@/context/WhishListContext";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";

const ProductCard = React.memo(({ product }: { product: Product }) => {
  let stockLabel = "In Stock";
  let discount = 0;
  if (product.stock === 0) stockLabel = "Out of Stock";
  else if (product.stock < 5) stockLabel = "Low Stock";

  if (product?.comparePrice) {
    discount = Math.round(
      ((product?.comparePrice - product.price) / product?.comparePrice) * 100,
    );
  }
  const { cartItems } = useCartContext();
  const { isInWishlist, toggleWishlist } = useWhishlist();
  const isLiked = isInWishlist(product.id);
  const quantity = cartItems.find((item) => item.id === product.id)?.quantity;
  return (
    <Link href={`/product/${product.id}`} asChild>
      <TouchableOpacity className="flex flex-col p-1.5 gap-3 rounded-xl justify-between max-w-md w-full overflow-hidden bg-white shadow-xs border border-gray-100 mb-1 h-[300px]">
        <View className="rounded-xl  w-full relative ">
          <Image
            source={{ uri: product.images[0] }}
            className="h-40 w-full object-cover object-center rounded-xl bg-gray-100"
          />
          {product.isFeatured ? (
            <View className="bg-black/30 backdrop-blur-md absolute top-2 left-2 px-2 py-1 rounded-lg">
              <Text className="text-white text-[10px] font-bold">Featured</Text>
            </View>
          ) : (
            <View className="bg-black/30 backdrop-blur-md absolute top-2 left-2 px-2 py-1 rounded-lg">
              <Text className="text-white text-[10px] font-bold">
                {typeof product.category === "object"
                  ? product.category?.name
                  : product.category}
              </Text>
            </View>
          )}

          <View className="absolute top-2 right-2 flex flex-col gap-1">
            <TouchableOpacity
              className="bg-white/70 backdrop-blur-md rounded-full p-1.5 shadow-sm"
              aria-label="add to favourites"
              onPress={(e) => {
                e.stopPropagation();
                toggleWishlist(product);
                if (product) {
                  toggleWishlist(product);
                  Toast.show({
                    type: "success",
                    text1: "Wishlist Updated",
                    text2: isLiked
                      ? "Removed from wishlist"
                      : "Added to wishlist",
                  });
                }
              }}
            >
              <Ionicons
                name={isLiked ? "heart" : "heart-outline"}
                size={16}
                color={isLiked ? COLORS.accent : COLORS.primary}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View className="flex-1 px-1">
          <Text
            numberOfLines={2}
            className="text-sm font-semibold text-gray-800 mb-1 h-10"
          >
            {product.name}
          </Text>

          <View className="flex-row items-center gap-1 mb-2">
            <Ionicons name="star" size={12} color="#FBBF24" />
            <Text className="text-xs font-bold text-gray-700">
              {product.ratings.toFixed(2)}
            </Text>
          </View>

          <View className="flex-row items-center justify-between">
            <View>
              <View className="flex-row items-center gap-2">
                <Text className="text-lg font-bold text-amber-600">
                  ${product.price.toFixed(2)}
                </Text>
                {product?.comparePrice && discount > 0 && (
                  <Text className="text-xs text-gray-400 line-through">
                    ${product.comparePrice.toFixed(2)}
                  </Text>
                )}
              </View>
              {discount > 0 && (
                <Text className="text-[10px] font-bold text-emerald-600">
                  {discount}% OFF
                </Text>
              )}
            </View>
            {cartItems.find((item) => item.product.id === product.id) ? (
              <View className="flex flex-row justify-between items-center   gap-2">
                <TouchableOpacity
                  disabled={(quantity ?? 0) <= 0}
                  className="bg-secondary p-2 rounded-full"
                >
                  <Ionicons
                    name="remove"
                    size={20}
                    className="transition-transform duration-200"
                    color={"#ffff"}
                  />
                </TouchableOpacity>
                <Text className="text-zinc-700  font-bold text-[14px] ">
                  {
                    cartItems.find((item) => item.product.id === product.id)
                      ?.quantity
                  }
                </Text>
                <TouchableOpacity
                  disabled={product.stock < (quantity ?? 0)}
                  className="bg-secondary p-2 rounded-full"
                >
                  <Ionicons
                    name="add"
                    size={20}
                    className="transition-transform duration-200"
                    color={"#ffff"}
                  />
                </TouchableOpacity>
                {/* <TouchableOpacity className="bg-primary p-1 rounded-full">
                  <Ionicons
                    name="trash"
                    size={16}
                    className="transition-transform duration-200 hover:rotate-12"
                    color={COLORS.accent}
                  />
                </TouchableOpacity> */}
              </View>
            ) : (
              <TouchableOpacity
                disabled={product.stock === 0}
                onPress={() => {
                  if (product) {
                    toggleWishlist(product);
                    Toast.show({
                      type: "success",
                      text1: "cart Updated",
                      text2: "Added to cart",
                    });
                  }
                }}
                className="bg-primary p-2 rounded-full"
              >
                <Ionicons name="bag-add-outline" size={20} color="white" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View
          className={`mt-2 py-1 rounded-md items-center ${
            stockLabel === "In Stock"
              ? "bg-emerald-50"
              : stockLabel === "Low Stock"
                ? "bg-amber-50"
                : "bg-red-50"
          }`}
        >
          <Text
            className={`text-[10px] font-bold ${
              stockLabel === "In Stock"
                ? "text-emerald-700"
                : stockLabel === "Low Stock"
                  ? "text-amber-700"
                  : "text-red-700"
            }`}
          >
            {stockLabel.toUpperCase()}
          </Text>
        </View>
      </TouchableOpacity>
    </Link>
  );
});

ProductCard.displayName = "ProductCard";
export default ProductCard;
