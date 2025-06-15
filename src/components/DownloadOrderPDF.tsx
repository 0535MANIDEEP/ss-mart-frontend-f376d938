
import React from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

type OrderItem = {
  product_id?: string;
  name: string;
  qty: number; // quantity
  price: number;
};

type Order = {
  id: string;
  user_id?: string;
  created_at: string;
  items: OrderItem[];
  total_amount?: number;
};

type Props = {
  order: Order;
};

const DownloadOrderPDF: React.FC<Props> = ({ order }) => {
  const handleDownload = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("🛒 SS MART - Order Invoice", 14, 20);

    doc.setFontSize(12);
    doc.text(`Order ID: ${order.id}`, 14, 30);
    doc.text(`Date: ${new Date(order.created_at).toLocaleString()}`, 14, 38);
    if (order.user_id) {
      doc.text(`User ID: ${order.user_id}`, 14, 46);
    }

    const itemRows = order.items.map(item => [
      item.name,
      item.qty,
      `₹${item.price}`,
      `₹${item.qty * item.price}`
    ]);

    // Y position for the table start
    const startY = order.user_id ? 55 : 48;

    // @ts-ignore -- Types mismatch between jspdf-autotable and @types
    doc.autoTable({
      head: [["Product", "Qty", "Price", "Total"]],
      body: itemRows,
      startY,
    });

    // Calculate total if not present
    const total =
      typeof order.total_amount === "number"
        ? order.total_amount
        : order.items.reduce((sum, i) => sum + i.qty * i.price, 0);

    doc.text(
      `Grand Total: ₹${total}`,
      14,
      // @ts-ignore
      (doc.lastAutoTable?.finalY ?? startY + 10) + 10
    );

    doc.save(`ssmart-invoice-${order.id}.pdf`);
  };

  return (
    <button
      type="button"
      className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded flex items-center gap-2 mt-4 focus-visible:ring-2 focus-visible:ring-yellow-400 focus:outline-none transition-colors dark:bg-[#FFD700bb] dark:text-[#232336] dark:hover:bg-lux-gold"
      style={{ borderRadius: 8 }}
      onClick={handleDownload}
      tabIndex={0}
      aria-label="Download Invoice PDF"
    >
      <span aria-hidden>📄</span>
      Download Invoice
    </button>
  );
};

export default DownloadOrderPDF;
