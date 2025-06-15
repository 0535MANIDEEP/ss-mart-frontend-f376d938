import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

// Remove the 'type' from transition, just keep duration.
// This prevents TS errors on framer-motion strict typings.
const heroVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};
const subVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { delay: 0.21, duration: 0.6 } },
};

const HeroSection: React.FC = () => {
  const { t } = useTranslation();
  return (
    <motion.section
      className="w-full max-w-2xl mx-auto mt-2 sm:mt-6 mb-6 px-2"
      initial="hidden"
      animate="visible"
      aria-label="SS MART Introduction"
    >
      <motion.div
        className="bg-ssblue-card/90 dark:bg-[#162044] border border-ssblue-secondary dark:border-ssblue-accent rounded-2xl shadow-ssblue py-7 px-3 xs:px-7 flex flex-col items-center animate-fade-in"
        variants={heroVariants}
        style={{
          boxShadow: "0 4px 20px 0 #60A5FA22, 0 .5px 12px #60A5FA33"
        }}
      >
        <motion.h1
          className="text-3xl xs:text-4xl font-bold mb-1 text-center font-sans tracking-wide"
          style={{
            color: "#1E3A8A",
            textShadow: "0 4px 18px #3B82F680"
          }}
          variants={heroVariants}
        >
          SS MART
        </motion.h1>
        <motion.p
          className="text-base xs:text-lg mb-2 mt-2 leading-snug sm:leading-relaxed text-gray-800 dark:text-ssblue-onblue font-medium text-center"
          style={{ fontWeight: 500 }}
          variants={subVariants}
        >
          Sai Sangameshwara Mart &mdash; <span className="hidden xs:inline">{t("shankarpally")},</span> Telangana's luxury marketplace.
        </motion.p>

        {/* Delivery warning */}
        <motion.div
          className="my-3 xs:my-3 bg-ssblue-card border border-ssblue-accent/50 dark:bg-[#1E2544dd] dark:border-[#60A5FA88] text-ssblue-primary dark:text-ssblue-accent w-full rounded-lg px-3 py-2 font-semibold shadow text-sm flex items-center justify-center text-center"
          variants={subVariants}
          style={{ maxWidth: 410, boxShadow: "0 2px 14px #3B82F644" }}
        >
          <span className="flex gap-1.5 items-center justify-center text-md">
            <span aria-hidden="true">⚠️</span>
            <span>{t("noDelivery") || "No Delivery. Visit SS MART to complete your reservation!"}</span>
          </span>
        </motion.div>

        <motion.div
          className="w-full flex justify-center mt-1 mb-2"
          variants={subVariants}
        >
          <Button
            className="lux-cta w-full max-w-xs text-center text-lg"
            style={{
              background: "linear-gradient(96deg, #3B82F6 70%, #1E3A8A 130%)",
              color: "#F9FAFB",
              boxShadow: "0 8px 36px #60A5FA7a, 0 4px 14px #60A5FA33"
            }}
          >
            {t("browseReserveNow") || "Browse & Reserve In-Store"}
          </Button>
        </motion.div>

        <motion.div
          className="flex flex-col xs:flex-row xs:items-center gap-y-1 xs:gap-x-2 text-sm text-ssblue-primary/95 font-medium mt-2 text-center xs:text-start justify-center"
          variants={subVariants}
        >
          <span className="flex items-center gap-1">
            <svg className="inline" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2}>
              <circle cx="9" cy="9" r="7.8" stroke="#3B82F6"/><path d="M9 10v3l2 2" stroke="#3B82F6"/><path d="M9 6a4 4 0 1 1-2.6 1.2" stroke="#3B82F6"/>
            </svg>
            <span className="ml-0.5">{t("shankarpally")},{" Telangana"}</span>
          </span>
          <span className="hidden xs:inline">•</span>
          <a
            href="https://g.co/kgs/v1e9RSN"
            className="underline hover:text-ssblue-accent font-medium ml-0.5"
            style={{ textDecorationThickness: 2 }}
            target="_blank"
            rel="noopener"
            aria-label={t("googleMaps")}
          >
            {t("googleMaps")}
          </a>
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default HeroSection;
