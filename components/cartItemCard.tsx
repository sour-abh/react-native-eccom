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
import { CartItem } from "@/assets/constants/types";

const CartItemCard = (item:CartItem) => {
  const width = useWindowDimensions().width;
  
  // Return null if item or required properties are missing
  if (!item || !item.product || !item.product.id) {
    return null;
  }
  
  return (
    <View className="px-2">
      <Link href={`/product/${item.product.id}`} asChild>
        <TouchableOpacity className="border-b-2 border-b-stone-400  py-4  transition-colors duration-200 rounded-lg w-full px-4">
          <View className="flex flex-row gap-2 justify-between items-center w-full">
            <Image
              source={{ uri: item.product.imageUrl?.[0] || "https://via.placeholder.com/80" }}
              className="object-cover object-center w-20 h-20 rounded-lg hover:shadow-md transition-shadow duration-200"
            />
            <View className="flex flex-col gap-2  items-start justify-between w-full">
              <View className="flex flex-col     items-start gap-2">
                <Text className="text-base font-mono text-zinc-700 ">
                  {item.product.name}
                </Text>
                <Text className="text-zinc-700  font-semibold text-xs leading-tight">
                  Size {item.size}
                </Text>
              </View>
              <View
                className="flex flex-row  justify-between items-center  "
                style={{ width: width - 120 }}
              >
                <Text className="text-zinc-700  font-bold text-xl leading-tight">
                  ${item.product.price.toFixed(2)}
                </Text>

                <View className="flex flex-row justify-between items-center gap-4">
                  <TouchableOpacity
                    disabled={item.product.stock === 0}
                    className="bg-stone-500/50 backdrop-blur-3xl text-white py-1.5 px-1.5 sm:py-2.5 sm:px-3 rounded-xl text-xs disabled:bg-stone-300/50 disabled:cursor-not-allowed hover:bg-stone-600/50 transition-all duration-200 active:scale-95"
                  >
                    <Ionicons
                      name="remove"
                      size={18}
                      className="transition-transform duration-200"
                    />
                  </TouchableOpacity>
                  <Text className="text-zinc-700 text-base font-semibold ">
                    {item.quantity}
                  </Text>
                  <TouchableOpacity
                    disabled={item.product.stock <= item.quantity}
                    className="rounded-xl bg-stone-500/50 backdrop-blur-3xl text-xs text-white py-1.5 px-1.5 sm:py-2.5 sm:px-3 disabled:bg-stone-300/50 disabled:cursor-not-allowed hover:bg-stone-600/50 transition-all duration-200 active:scale-95"
                  >
                    <Ionicons
                      name="add"
                      size={18}
                      className="transition-transform duration-200"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity className="bg-stone-500/50 rounded-xl backdrop-blur-3xl text-white text-xs py-1.5 px-1.5 sm:py-2.5 sm:px-3 transition-all duration-200 active:scale-95 ">
                    <Ionicons
                      name="trash"
                      size={18}
                      className="transition-transform duration-200 hover:rotate-12 text-red-400"
                      color={COLORS.accent}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Link>
    </View>
  );
};
export default CartItemCard;
