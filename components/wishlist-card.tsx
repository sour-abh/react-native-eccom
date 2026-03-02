import { Ionicons } from "@expo/vector-icons";
import {
  Image,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { Link } from "expo-router";
import { COLORS } from "@/assets/constants";
import { Product } from "@/assets/constants/types";
import { useCart } from "@/hooks/useCart";
import { useWishListStore } from "@/store/wishlist.store";
import Toast from "react-native-toast-message";
import { useAddToCart } from "@/hooks/useAddToCart";

const WishlistCard = (item: Product) => {
  const width = useWindowDimensions().width;
  const { isInWishlist, toggleWishlist } = useWishListStore();
  const { data } = useCart();
  const cartItems = data?.cartItems || [];
  const isLiked = isInWishlist(item.id);
  const { mutateAsync: addToCart } = useAddToCart();
  const handleAddtoCart = async (product: Product) => {
    const response = await addToCart(product);
    if (response) {
      Toast.show({
        type: "success",
        text1: "Added to Cart",
      });
    }
  };

  const categoryColor = [
    "bg-red-600",
    "bg-blue-700",
    "bg-green-700",
    "bg-yellow-700",
    "bg-purple-600",
    "bg-pink-600",
    "bg-orange-600",
    "bg-indigo-600",
    "bg-teal-600",
    "bg-cyan-600",
    "bg-lime-600",
    "bg-fuchsia-600",
    "bg-rose-600",
    "bg-emerald-600",
    "bg-sky-500",
    "bg-violet-500",
    "bg-amber-500",
    "bg-slate-500",
    "bg-stone-500",
    "bg-neutral-500",
  ];
  const getCategoryColorIndex = (category: string) => {
    let hash = 0;
    for (let i = 0; i < category.length; i++) {
      hash = category.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash) % categoryColor.length;
  };
  const categoryName =
    typeof item.category === "object" ? item.category?.name : item.category;
  const colorIndex = getCategoryColorIndex(categoryName || "default");
  const quantity = cartItems.find(
    (cartItem: any) => cartItem.id === item.id,
  )?.quantity;
  return (
    <View className="px-2 relative">
      <Link href={`/product/${item.id}`} asChild>
        <TouchableOpacity className="bg-gray-300 backdrop-blur-3xl text-white rounded-xl flex flex-row items-center justify-between py-2 px-2">
          <View className="flex flex-row items-center gap-2">
            <Image
              source={{ uri: item.images[0] }}
              className="object-cover object-center w-20 h-20 rounded-lg hover:shadow-md transition-shadow duration-200"
              resizeMode="contain"
            />

            <View className="flex flex-col gap-1">
              <View
                className={`py-1 px-2 w-fit rounded-full ${categoryColor[colorIndex]} `}
              >
                <Text className="text-white  font-bold text-xs leading-tight">
                  {typeof item.category === "object"
                    ? item.category?.name
                    : item.category}
                </Text>
              </View>
              <Text className="text-gray-900  font-bold text-sm leading-tight">
                {item.name.length > 20
                  ? item.name.slice(0, 20) + "..."
                  : item.name}
              </Text>
              {item.description && (
                <Text
                  className="text-primary  font-semibold text-xs leading-tight"
                  numberOfLines={4}
                >
                  {item?.description.length > 30
                    ? item?.description?.slice(0, 30) + "..."
                    : item?.description}
                </Text>
              )}
            </View>
          </View>
          <View className="flex flex-col italic justify-between items-end gap-4">
            <View>
              <Text className="text-stone-600  font-bold  text-lg leading-tight text-right">
                ${item.price}
              </Text>
            </View>
            <View>
              {cartItems.find(
                (cartItem: any) => cartItem.product.id === item.id,
              ) ? (
                <View className="flex flex-row justify-between items-center   gap-2">
                  <TouchableOpacity
                    disabled={(quantity ?? 0) <= 0}
                    className="bg-secondary p-2 rounded-full"
                  >
                    <Ionicons
                      name="remove"
                      size={16}
                      className="transition-transform duration-200"
                      color={"#ffff"}
                    />
                  </TouchableOpacity>
                  <Text className="text-zinc-700  font-bold text-[14px] ">
                    {
                      cartItems.find(
                        (cartItem: any) => cartItem.product.id === item.id,
                      )?.quantity
                    }
                  </Text>
                  <TouchableOpacity
                    disabled={item.stock < (quantity ?? 0)}
                    className="bg-secondary p-2 rounded-full"
                  >
                    <Ionicons
                      name="add"
                      size={16}
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
                <View className="flex flex-row items-center gap-2">
                  {/* <Text className="text-secondary  font-medium text-base ">
                    Add To Cart
                  </Text> */}
                  <TouchableOpacity
                    disabled={item.stock === 0}
                    onPress={() => handleAddtoCart(item)}
                    className="bg-primary p-2 rounded-full items-center justify-center"
                  >
                    <Ionicons name="bag-add-outline" size={20} color="white" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </Link>
      <TouchableOpacity
        onPress={() => toggleWishlist(item)}
        className="absolute top-2 left-2 bg-white p-2 rounded-full"
      >
        <Ionicons
          name="trash"
          size={20}
          color={isLiked ? "red" : COLORS.primary}
        />
      </TouchableOpacity>
    </View>
  );
};
export default WishlistCard;
