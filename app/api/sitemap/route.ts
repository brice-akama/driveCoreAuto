import { SitemapStream, streamToPromise } from "sitemap";
import { NextResponse } from "next/server";
import clientPromise from "../../lib/mongodb";

// Supported languages
const languages = ["en", "fr", "de", "es"]; // add/remove as needed

// Fetch products from MongoDB
const getProducts = async () => {
  const client = await clientPromise;
  const db = client.db("autodrive");
  return db
    .collection("products")
    .find({}, { projection: { slug: 1 } })
    .toArray();
};

// Fetch blogs from MongoDB
const getBlogs = async () => {
  const client = await clientPromise;
  const db = client.db("autodrive");
  return db.collection("news").find({}, { projection: { slug: 1 } }).toArray();
};

export async function GET() {
  const sitemap = new SitemapStream({
    hostname: "https://www.drivecoreauto.com",
  });

  try {
    // Localized static pages (with /en/, /fr/, etc.)
    const localizedStaticUrls = [
      { url: "warranty", changefreq: "monthly", priority: 0.6 },
      { url: "shipping", changefreq: "monthly", priority: 0.6 },
      { url: "support", changefreq: "monthly", priority: 0.6 },
      { url: "track-order", changefreq: "monthly", priority: 0.6 },
      { url: "faqs", changefreq: "monthly", priority: 0.6 },
      { url: "refund-policy", changefreq: "monthly", priority: 0.6 },
      { url: "privacy-policy", changefreq: "monthly", priority: 0.6 },
      { url: "terms-condictions", changefreq: "monthly", priority: 0.6 },
    ];

    localizedStaticUrls.forEach((page) => {
      languages.forEach((lang) => {
        sitemap.write({
          url: `/${lang}/${page.url}`,
          changefreq: page.changefreq,
          priority: page.priority,
        });
      });
    });

    // Plain static pages (no language prefix)
    const plainStaticUrls = [
      { url: "scion", changefreq: "daily", priority: 1.0 }, // home
      { url: "toyota", changefreq: "weekly", priority: 0.8 },
      { url: "honda", changefreq: "monthly", priority: 0.6 },
      { url: "subaru", changefreq: "monthly", priority: 0.6 },
      { url: "subframe", changefreq: "monthly", priority: 0.6 },
      { url: "nissan", changefreq: "monthly", priority: 0.6 },
      { url: "blog", changefreq: "monthly", priority: 0.6 },
      { url: "top-sellers", changefreq: "monthly", priority: 0.6 },  // / transmissions/nissan/automatic
      { url: "lexus", changefreq: "monthly", priority: 0.6 },
      { url: "free-shipping", changefreq: "monthly", priority: 0.6 },
      { url: "acura", changefreq: "monthly", priority: 0.6 },
      { url: "transmissions/toyota/automatic", changefreq: "monthly", priority: 0.6 },
       { url: "transmissions/scion/automatic", changefreq: "monthly", priority: 0.6 },
      { url: "transmissions/honda/automatic", changefreq: "monthly", priority: 0.6 },
       { url: "transmissions/subaru/automatic", changefreq: "monthly", priority: 0.6 },
        { url: "transmissions/lexus/automatic", changefreq: "monthly", priority: 0.6 },
         { url: "transmissions/infiniti/automatic", changefreq: "monthly", priority: 0.6 },
      { url: "transmissions/nissan/automatic", changefreq: "monthly", priority: 0.6 },
      { url: "transmissions/acura/automatic", changefreq: "monthly", priority: 0.6 },
      { url: "transmissions/toyota/manual", changefreq: "monthly", priority: 0.6 },
      { url: "transmissions/nissan/manual", changefreq: "monthly", priority: 0.6 },
      { url: "transmissions/infiniti/manual", changefreq: "monthly", priority: 0.6 },
      { url: "transmissions/scion/manual", changefreq: "monthly", priority: 0.6 },
      { url: "transmissions/honda/manual", changefreq: "monthly", priority: 0.6 },
      { url: "transmissions/acura/manual", changefreq: "monthly", priority: 0.6 },
      { url: "transmissions/subaru/manual", changefreq: "monthly", priority: 0.6 },
      { url: "swaps/infiniti", changefreq: "monthly", priority: 0.6 },
      { url: "swaps/nissan", changefreq: "monthly", priority: 0.6 },
      { url: "swaps/subaru", changefreq: "monthly", priority: 0.6 },
      { url: "swaps/toyota", changefreq: "monthly", priority: 0.6 },
      { url: "swaps/honda", changefreq: "monthly", priority: 0.6 },
      { url: "accessories", changefreq: "monthly", priority: 0.6 },
      { url: "infiniti", changefreq: "monthly", priority: 0.6 }, // example plain path
    ];

    plainStaticUrls.forEach((page) => {
      sitemap.write({
        url: `/${page.url}`,
        changefreq: page.changefreq,
        priority: page.priority,
      });
    });

    // Add product URLs for each language (always English slug)
    const [products, blogs] = await Promise.all([getProducts(), getBlogs()]);

    products.forEach((product) => {
      if (product.slug?.en) {
        languages.forEach((lang) => {
          sitemap.write({
            url: `/products/${product.slug.en}?lang=${lang}`,
            changefreq: "daily",
            priority: 0.7,
          });
        });
      }
    });

    // Add blog URLs for each language
    blogs.forEach((blog) => {
      if (blog.slug?.en) {
        languages.forEach((lang) => {
          sitemap.write({
            url: `/blog/${blog.slug.en}?lang=${lang}`,
            changefreq: "weekly",
            priority: 0.65,
          });
        });
      }
    });

    sitemap.end();

    const sitemapXml = await streamToPromise(sitemap);
    return new NextResponse(sitemapXml, {
      headers: { "Content-Type": "application/xml" },
    });
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
