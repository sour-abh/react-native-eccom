export const CART_ACTIONS = {
  ADD_ITEM: "ADD_ITEM",
  DELETE_ITEM: "DELETE_ITEM",
  UPDATE_QTY: "UPDATE_QTY",
  CLEAR_CART: "CLEAR_CART",
};

export default function CartReducer(state: any, action: any): any {
  switch (action.type) {
    case CART_ACTIONS.ADD_ITEM: {
      const product = action.payload;

      // prevent adding out-of-stock
      if (product.stock === 0) return state;

      const existingItem = state.items.find(
        (item: any) => item.id === product.id,
      );

      let updatedItems;

      if (existingItem) {
        updatedItems = state.items.map((item: any) =>
          item.id === product.id
            ? {
                ...item,
                quantity: Math.min(item.quantity + 1, item.stock),
              }
            : item,
        );
      } else {
        updatedItems = [
          ...state.items,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            stock: product.stock,
            image: product.image,
            quantity: 1,
          },
        ];
      }

      return { ...state, items: updatedItems };
    }

    case CART_ACTIONS.DELETE_ITEM: {
      return {
        ...state,
        items: state.items.filter((item: any) => item.id !== action.payload),
      };
    }

    case CART_ACTIONS.UPDATE_QTY: {
      const { id, qty } = action.payload;

      if (qty <= 0) {
        return {
          ...state,
          items: state.items.filter((item: any) => item.id !== id),
        };
      }

      return {
        ...state,
        items: state.items.map((item: any) =>
          item.id === id
            ? {
                ...item,
                quantity: Math.min(qty, item.stock),
              }
            : item,
        ),
      };
    }

    case CART_ACTIONS.CLEAR_CART:
      return { ...state, items: [] };

    default:
      return state;
  }
}
