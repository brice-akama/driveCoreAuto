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
      { url: "shipping-info", changefreq: "monthly", priority: 0.6 },
      { url: "support", changefreq: "monthly", priority: 0.6 },
      { url: "terms", changefreq: "monthly", priority: 0.6 },
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
      { url: "", changefreq: "daily", priority: 1.0 }, // home
      { url: "about-us", changefreq: "weekly", priority: 0.8 },
      { url: "contact-us", changefreq: "monthly", priority: 0.6 },
      { url: "privacy-policy", changefreq: "monthly", priority: 0.6 },
      { url: "refund-policy", changefreq: "monthly", priority: 0.6 },
      { url: "shop", changefreq: "monthly", priority: 0.6 },
      { url: "blog", changefreq: "monthly", priority: 0.6 },
      { url: "cookie-policy", changefreq: "monthly", priority: 0.6 },
      { url: "faqs", changefreq: "monthly", priority: 0.6 },
      { url: "toyota", changefreq: "monthly", priority: 0.6 }, // example plain path
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
