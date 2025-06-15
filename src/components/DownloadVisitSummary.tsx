
import React from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

type VisitItem = {
  _id: string;
  name: string;
  quantity: number;
  price: number;
};

type Props = {
  items: VisitItem[];
  total: number;
};

const STORE_NAME = "SS MART";
const STORE_ADDRESS = "Sai Sangameshwara Mart, Shankarpally, Telangana 501203";
const STORE_MAPS = "https://g.co/kgs/v1e9RSN";
const STORE_TIMINGS = "Open Daily: 8:00 AM – 10:00 PM";

function generateBookingId() {
  // Generates a short random booking ID for offline in-store use.
  return Math.random().toString(36).slice(2, 10).toUpperCase();
}

const DownloadVisitSummary: React.FC<Props> = ({ items, total }) => {
  const handleDownload = () => {
    const doc = new jsPDF();
    const bookingId = generateBookingId();
    const now = new Date();

    doc.setFontSize(18);
    doc.text("🛍️ Reservation Summary — Visit SS MART", 14, 20);

    doc.setFontSize(12);
    doc.text(`Booking ID: ${bookingId}`, 14, 30);
    doc.text(`Reserved On: ${now.toLocaleString()}`, 14, 38);
    doc.text(`Store: ${STORE_ADDRESS}`, 14, 46);
    doc.text(`Store Timings: ${STORE_TIMINGS}`, 14, 54);

    const itemRows = items.map(item => [
      item.name,
      item.quantity,
      `₹${item.price}`,
      `₹${item.quantity * item.price}`
    ]);

    // Table start
    const startY = 62;
    // @ts-ignore
    doc.autoTable({
      head: [["Product", "Qty", "Price", "Total"]],
      body: itemRows,
      startY,
    });

    // Estimated total
    doc.text(
      `Estimated Total: ₹${total}`,
      14,
      // @ts-ignore
      (doc.lastAutoTable?.finalY ?? startY + 10) + 10
    );

    doc.save(`ssmart-visit-summary-${bookingId}.pdf`);
  };

  return (
    <button
      type="button"
      className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded flex items-center gap-2 mt-0 focus-visible:ring-2 focus-visible:ring-yellow-400 focus:outline-none transition-colors dark:bg-[#FFD700bb] dark:text-[#232336] dark:hover:bg-lux-gold"
      style={{ borderRadius: 8 }}
      onClick={handleDownload}
      tabIndex={0}
      aria-label="Download Visit Summary PDF"
    >
      <span aria-hidden>📄</span>
      Download Visit Summary
    </button>
  );
};

export default DownloadVisitSummary;
