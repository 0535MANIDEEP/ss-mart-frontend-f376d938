
import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const heroVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { type: "spring" as const, duration: 1 as const } },
};
const subVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { delay: 0.35, duration: 0.7 as const } },
};

const HeroSection: React.FC = () => {
  const { t } = useTranslation();
  return (
    <motion.section
      className="lux-hero animate-fade-in w-full max-w-2xl mx-auto"
      initial="hidden"
      animate="visible"
      aria-label="SS MART Introduction"
    >
      <motion.h1
        className="text-4xl lg:text-5xl font-bold mb-2 tracking-tight font-sans"
        variants={heroVariants}
      >
        <span className="bg-gradient-to-r from-yellow-500 to-yellow-300 bg-clip-text text-transparent drop-shadow-[0_2px_24px_rgba(212,175,55,0.15)]">
          {t("brand")}
        </span>
      </motion.h1>
      <motion.p
        className="text-lg mb-2 mt-2 leading-relaxed text-lux-gold/90 font-medium"
        variants={subVariants}
      >
        Sai Sangameshwara Mart &mdash; {t("shankarpally")}'s luxury marketplace.
      </motion.p>
      <div className="flex flex-col gap-2 mt-2">
        {/* App banner for showroom mode */}
        <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded text-center text-sm font-semibold dark:bg-[#E8C40033] dark:text-lux-gold border border-yellow-300 mb-2">
          ⚠️ No Delivery. Visit SS MART to complete your reservation!
        </div>
        <Button className="bg-primary text-white rounded-lg px-5 py-2 text-lg font-semibold shadow hover:bg-primary/90 max-w-xs mx-auto">
          Browse & Reserve In-Store
        </Button>
      </div>
      <motion.div
        className="flex items-center gap-2 text-sm text-lux-gold font-medium mt-3"
        variants={subVariants}
      >
        <svg className="inline mr-1" width={20} height={20} fill="none" stroke="currentColor" strokeWidth={2}>
          <circle cx="10" cy="10" r="9" stroke="#FFD700"/><path d="M10 10v4l2 2" stroke="#FFD700"/><path d="M10 6a4 4 0 1 1-2.8 1.2" stroke="#FFD700"/>
        </svg>
        {t("shankarpally")}, Telangana &bull;&nbsp;
        <a
          href="https://g.co/kgs/v1e9RSN"
          className="underline hover:text-lux-gold"
          target="_blank"
          rel="noopener"
          aria-label={t("googleMaps")}
        >
          {t("googleMaps")}
        </a>
      </motion.div>
    </motion.section>
  );
};

export default HeroSection;
