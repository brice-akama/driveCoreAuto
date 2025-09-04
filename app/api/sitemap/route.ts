import { SitemapStream, streamToPromise } from "sitemap";
import { NextResponse } from "next/server";
import clientPromise from "../../lib/mongodb";

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
    // Plain static pages (canonical only)
    const plainStaticUrls = [
      { url: "scion", changefreq: "daily", priority: 1.0 },
      { url: "toyota", changefreq: "weekly", priority: 0.8 },
      { url: "honda", changefreq: "monthly", priority: 0.6 },
      { url: "subaru", changefreq: "monthly", priority: 0.6 },
      { url: "subframe", changefreq: "monthly", priority: 0.6 },
      { url: "nissan", changefreq: "monthly", priority: 0.6 },
      { url: "blog", changefreq: "monthly", priority: 0.6 },
      { url: "top-sellers", changefreq: "monthly", priority: 0.6 },
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
      { url: "infiniti", changefreq: "monthly", priority: 0.6 },
    ];

    plainStaticUrls.forEach((page) => {
      sitemap.write({
        url: `/${page.url}`,
        changefreq: page.changefreq,
        priority: page.priority,
      });
    });

    // Fetch products and blogs
    const [products, blogs] = await Promise.all([getProducts(), getBlogs()]);

    // Add product URLs (canonical only)
    products.forEach((product) => {
      if (product.slug?.en) {
        sitemap.write({
          url: `/products/${product.slug.en}`,
          changefreq: "daily",
          priority: 0.9,
        });
      }
    });

    // Add blog URLs (canonical only)
    blogs.forEach((blog) => {
      if (blog.slug?.en) {
        sitemap.write({
          url: `/blog/${blog.slug.en}`,
          changefreq: "weekly",
          priority: 0.85,
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
