import React from "react";
import whatsappIcon from "../assets/whatsapp.png"; // path to your icon
import "./Whatsapp.css";

function WhatsAppIcon() {
  const phoneNumber = "6380577090"; // Replace with your number
  const whatsappLink = `https://wa.me/${phoneNumber}`;

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
      aria-label="Chat on WhatsApp"
    >
      <img src={whatsappIcon} alt="WhatsApp" className="whatsapp-icon" />
    </a>
  );
}

export default WhatsAppIcon;
