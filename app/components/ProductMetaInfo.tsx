import { FaFacebookF, FaTwitter, FaEnvelope } from "react-icons/fa";
import { usePathname } from "next/navigation";

interface ProductMetaInfoProps {
  sku?: string; // optional, but we'll use fixed SKU anyway
  category: string;
}

const ProductMetaInfo = ({ sku, category }: ProductMetaInfoProps) => {
  const pathname = usePathname();
  const shareUrl = `https://yourdomain.com${pathname}`; // replace with your actual domain
  const fixedSku = "AUTO12345"; // fixed SKU as you wanted

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
      </div>
    </div>
  );
};

export default ProductMetaInfo;
