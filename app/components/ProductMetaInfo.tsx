import { FaFacebookF, FaTwitter, FaEnvelope } from "react-icons/fa";
import { FiCopy } from "react-icons/fi";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface ProductMetaInfoProps {
  sku?: string; // optional, but we'll use fixed SKU anyway
  category: string;
}

const ProductMetaInfo = ({ sku, category }: ProductMetaInfoProps) => {
  const pathname = usePathname();
  const shareUrl = `https://yourdomain.com${pathname}`; // replace with your actual domain
  const fixedSku = "AUTO12345"; // fixed SKU as you wanted
  const [copied, setCopied] = useState(false);

  const handleCopyClick = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // hide after 2 seconds
    });
  };

  return (
    <div className="mt-4 text-sm text-gray-700 space-y-1">
      <p>
        <span className="font-semibold">SKU:</span> {fixedSku}
      </p>

      <p>
        <span className="font-semibold">Category:</span> {category}
      </p>

      <div className="flex items-center gap-3 mt-2">
        <span className="font-semibold">Share:</span>

        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on Facebook"
        >
          <FaFacebookF className="text-blue-600 hover:scale-110 transition cursor-pointer" />
        </a>

        <a
          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on Twitter"
        >
          <FaTwitter className="text-blue-400 hover:scale-110 transition cursor-pointer" />
        </a>

        <a
          href={`mailto:?subject=Check this product&body=${encodeURIComponent(shareUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share by Email"
        >
          <FaEnvelope className="text-gray-600 hover:scale-110 transition cursor-pointer" />
        </a>

        {/* Copy Link Icon */}
        <button
          onClick={handleCopyClick}
          aria-label="Copy link to clipboard"
          className="relative text-gray-600 hover:text-gray-900 transition cursor-pointer"
        >
          <FiCopy className="w-5 h-5" />
          {copied && (
            <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 select-none">
              Copied!
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductMetaInfo;
