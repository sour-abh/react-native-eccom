export const COLORS = {
  primary: "#111111",
  secondary: "#666666",
  background: "#FFFFFF",
  surface: "#F7F7F7",
  accent: "#FF4C3B",
  border: "#EEEEEE",
  error: "#FF4444",
};

export const CATEGORIES = [
  { id: 1, name: "Men", icon: "man-outline" },
  { id: 2, name: "Women", icon: "woman-outline" },
  { id: 3, name: "Kids", icon: "happy-outline" },
  { id: 4, name: "Shoes", icon: "footsteps-outline" },
  { id: 5, name: "Bag", icon: "briefcase-outline" },
  { id: 6, name: "Other", icon: "grid-outline" },
];

export const PROFILE_MENU = [
  { id: 1, title: "My Orders", icon: "receipt-outline", route: "/orders" },
  {
    id: 2,
    title: "Shipping Addresses",
    icon: "location-outline",
    route: "/addresses",
  },
  { id: 4, title: "My Reviews", icon: "star-outline", route: "/" },
  { id: 5, title: "Settings", icon: "settings-outline", route: "/" },
];

export const getStatusColor = (
  status: string,
): { container: object; text: object } => {
  switch (status) {
    case "placed":
      return {
        container: { backgroundColor: "#fefce8" },
        text: { color: "#713f12" },
      };
    case "processing":
      return {
        container: { backgroundColor: "#eef2ff" },
        text: { color: "#312e81" },
      };
    case "shipped":
      return {
        container: { backgroundColor: "#faf5ff" },
        text: { color: "#581c87" },
      };
    case "delivered":
      return {
        container: { backgroundColor: "#f0fdf4" },
        text: { color: "#14532d" },
      };
    case "cancelled":
      return {
        container: { backgroundColor: "#fff1f2" },
        text: { color: "#881337" },
      };
    default:
      return {
        container: { backgroundColor: "#f9fafb" },
        text: { color: "#111827" },
      };
  }
};
