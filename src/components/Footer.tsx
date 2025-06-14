
const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || "9849530828";
const waLink = `https://wa.me/91${whatsappNumber}`;

const Footer = () => (
  <footer className="bg-gray-100 text-gray-700 px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-2 border-t">
    <div>
      <span className="font-semibold">SS MART</span> &copy; {new Date().getFullYear()}
    </div>
    <div>
      <a
        href={waLink}
        target="_blank"
        rel="noopener"
        className="inline-flex items-center gap-2 text-green-600 font-medium hover:underline hover:scale-105 transition"
      >
        Order instantly on WhatsApp
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 19a9 9 0 1 1 2.2 2.2L3 21z"/><path d="M16 11.37c-.39-.1-.61-.19-1.26-.38a2.56 2.56 0 0 1-.81-.35c-.36-.26-.31-.4-.42-.71a2.55 2.55 0 0 0-.56-.89c-.2-.24-.59-.53-.59-.8s.14-.76.27-.97a.77.77 0 0 0-.13-.82c-.16-.21-.45-.23-.78-.11a5.38 5.38 0 0 0-2.77 2.35c-.63 1.05-.52 2.46-.29 3.08.13.33.27.35.47.36s.23.01.46-.07c.33-.1.44-.16.65-.4a6 6 0 0 0 1.04-1.12c.1-.17.13-.31.2-.39" />
        </svg>
      </a>
    </div>
  </footer>
);

export default Footer;
