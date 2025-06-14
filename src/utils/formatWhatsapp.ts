
export const formatWhatsappMessage = (cartItems, total, userInfo) => {
  const itemLines = cartItems
    .map(
      (item, i) =>
        `${i + 1}. ${item.name} x${item.quantity} - ₹${item.price * item.quantity}`
    )
    .join("\n");

  return `
Hello SS MART 👋
I'd like to place an order:

${itemLines}

Name: ${userInfo.name}
Phone: ${userInfo.phone}
Address: ${userInfo.address}
Total Amount: ₹${total}

Please confirm availability.
`.trim();
};
