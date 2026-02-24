import { COLORS } from "@/assets/constants";
import { Product } from "@/assets/constants/types";
import { useWhishlist } from "@/context/WhishListContext";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

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
  const { isInWishlist, toggleWishlist } = useWhishlist();
  const isLiked = isInWishlist(product.id);
  return (
    <TouchableOpacity className="flex flex-col p-1.5 gap-3 rounded-xl justify-between max-w-md w-full h-full overflow-hidden bg-white shadow-xs border border-gray-100 mb-4">
      <View className="rounded-xl  w-full relative ">
        <Link href={`/product/${product.id}`} asChild>
          <Image
            source={{ uri: product.images[0] }}
            className="h-40 w-full object-cover object-center rounded-xl bg-gray-100"
          />
        </Link>
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
            className="bg-white/80 backdrop-blur-md rounded-full p-1.5 shadow-sm"
            aria-label="add to favourites"
            onPress={(e) => {
              e.stopPropagation();
              toggleWishlist(product);
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
        <Link href={`/product/${product.id}`} asChild>
          <Text
            numberOfLines={2}
            className="text-sm font-semibold text-gray-800 mb-1 h-10"
          >
            {product.name}
          </Text>
        </Link>

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

          <TouchableOpacity
            disabled={product.stock === 0}
            className="bg-primary p-2 rounded-full"
          >
            <Ionicons name="bag-add-outline" size={20} color="white" />
          </TouchableOpacity>
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
  );
});

export default ProductCard;
