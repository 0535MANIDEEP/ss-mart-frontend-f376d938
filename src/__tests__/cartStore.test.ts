import { useCartStore } from "../store/cartStore";

describe("Cart store", () => {
  beforeEach(() => {
    localStorage.clear();
    useCartStore.setState({ items: [] });
  });
  it("adds items to cart", () => {
    useCartStore.getState().addToCart({
      _id: "1", name: "A", price: 25, quantity: 1, stock: 10
    });
    const items = useCartStore.getState().items;
    expect(items.length).toBe(1);
    expect(items[0].name).toBe("A");
  });
  it("removes item by id", () => {
    useCartStore.getState().addToCart({ _id: "a", name: "A", price: 10, quantity: 1, stock: 10 });
    useCartStore.getState().removeFromCart("a");
    expect(useCartStore.getState().items.length).toBe(0);
  });
  it("updates quantity", () => {
    useCartStore.getState().addToCart({ _id: "1", name: "B", price: 10, quantity: 1, stock: 10 });
    useCartStore.getState().updateQuantity("1", 3);
    const items = useCartStore.getState().items;
    expect(items[0].quantity).toBe(3);
  });
});
