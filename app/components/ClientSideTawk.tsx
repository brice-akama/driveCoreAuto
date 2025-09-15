"use client";
import Script from "next/script";
import { usePathname } from "next/navigation";

const SalesIQChat = () => {
  const pathname = usePathname();

  // Don't render chat on admin pages
  if (pathname.startsWith("/admin")) return null;

  return (
    <>
      <Script id="zoho-salesiq-init" strategy="afterInteractive">
        {`window.$zoho=window.$zoho || {};
          $zoho.salesiq=$zoho.salesiq||{ready:function(){}};`}
      </Script>

      <Script
        id="zoho-salesiq-widget"
        src="https://salesiq.zohopublic.com/widget?wc=siqbcdf509db068508a1f2594f772b1e4b8644715f86e380ec9b9081aa03cee738c"
        strategy="afterInteractive"
        defer
      />
    </>
  );
};

export default SalesIQChat;
