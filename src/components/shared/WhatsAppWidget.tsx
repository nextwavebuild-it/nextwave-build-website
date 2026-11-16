"use client";

import { FaWhatsapp } from "react-icons/fa";

const WHATSAPP_NUMBER = "971507561183";

export default function WhatsAppWidget() {
  const message =
    "Hello NextWave Build! I would like to know more about your programmes.";

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with NextWave Build on WhatsApp"
      title="Chat with us on WhatsApp"
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        width: "60px",
        height: "60px",
        borderRadius: "50%",
        backgroundColor: "#25D366",
        color: "#FFFFFF",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2147483647,
        boxShadow: "0 8px 30px rgba(37,211,102,0.35)",
        cursor: "pointer",
        textDecoration: "none",
        transition: "transform 0.3s ease",
      }}
      onMouseEnter={(event) => {
        event.currentTarget.style.transform = "scale(1.1)";
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.transform = "scale(1)";
      }}
    >
      <FaWhatsapp size={35} />
    </a>
  );
}
