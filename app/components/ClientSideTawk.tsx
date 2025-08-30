"use client";
import Script from "next/script";
import { usePathname } from "next/navigation";

const SmartsuppChat = () => {
  const pathname = usePathname();

  // Don't render chat on admin pages
  if (pathname.startsWith("/admin")) return null;

  return (
    <Script
      id="smartsupp-chat"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          var _smartsupp = _smartsupp || {};
          _smartsupp.key = '839428531e6a48d28a74b48685c1dc7fbd811e45';
          window.smartsupp||(function(d) {
            var s,c,o=smartsupp=function(){ o._.push(arguments)};o._=[];
            s=d.getElementsByTagName('script')[0];c=d.createElement('script');
            c.type='text/javascript';c.charset='utf-8';c.async=true;
            c.src='https://www.smartsuppchat.com/loader.js?';s.parentNode.insertBefore(c,s);
          })(document);
        `,
      }}
    />
  );
};

export default SmartsuppChat;

