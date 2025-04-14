'use client';

import React from "react";
import CookieConsent from "react-cookie-consent";
import Link from "next/link";
import Cookies from "js-cookie";

const CookieConsentBanner = () => {
  return (
    <CookieConsent
      location="bottom"
      buttonText="Accept All"
      declineButtonText="Decline"
      enableDeclineButton
      cookieName="uomeCookieConsent"
      style={{ background: "#2B373B", color: "#FFF" }}
      buttonStyle={{ backgroundColor: "#4CAF50", color: "#FFF", fontSize: "14px" }}
      declineButtonStyle={{ backgroundColor: "#f44336", color: "#FFF", fontSize: "14px" }}
      expires={365}
      onAccept={() => {
        // Enable analytics or tracking cookies
        Cookies.set("analytics", "enabled", { expires: 365 });
        console.log("Cookies accepted");
      }}
      onDecline={() => {
        // Disable analytics or tracking cookies
        Cookies.remove("analytics");
        console.log("Cookies declined");
      }}
    >
      This website uses cookies to enhance your experience. By using our website, you consent to the use of cookies.
      You can read more in our <Link href="/privacy" legacyBehavior><a>privacy policy</a></Link>.
    </CookieConsent>
  );
};

export default CookieConsentBanner;
