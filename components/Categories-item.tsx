import { COLORS } from "@/assets/constants";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, Text, View } from "react-native";

export default function CategoriesItem({
  item,
  isSelected,
  onPress,
}: {
  item: { id: string | number; name: string; icon: string };
  isSelected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity className="mr-4 items-center " onPress={onPress}>
      <View
        className={`w-14 h-14 items-center justify-center rounded-full mb-1 ${isSelected ? "bg-primary" : "bg-surface"}`}
      >
        <Ionicons
          name={item.icon as any}
          size={24}
          color={isSelected ? "#fff" : COLORS.primary}
        />
      </View>
      <Text
        className={`${isSelected ? "text-primary" : "text-secondary"} text-xs font-medium`}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );
}
