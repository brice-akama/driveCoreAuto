import { SitemapStream, streamToPromise } from "sitemap";
import { NextResponse } from "next/server";
import clientPromise from "../../lib/mongodb";

const getProducts = async () => {
  const client = await clientPromise;
  const db = client.db("autodrive");
  return db.collection("products")
    .find({}, { projection: { slug: 1, updatedAt: 1 } })
    .toArray();
};

const getBlogs = async () => {
  const client = await clientPromise;
  const db = client.db("autodrive");
  return db.collection("news")
    .find({}, { projection: { slug: 1, updatedAt: 1 } })
    .toArray();
};

export async function GET() {
  try {
    const hostname = "https://www.drivecoreauto.com";

    // Create sitemap stream
    const sitemap = new SitemapStream({ hostname });

    // ✅ Static pages with improved priorities
    const staticPages = [
      { url: "/", changefreq: "weekly", priority: 1.0 }, // Homepage - highest priority
      { url: "/toyota", changefreq: "weekly", priority: 0.9 }, // Major brand
      { url: "/honda", changefreq: "weekly", priority: 0.9 }, // Major brand
      { url: "/nissan", changefreq: "weekly", priority: 0.8 }, // Popular brand
      { url: "/lexus", changefreq: "weekly", priority: 0.8 }, // Luxury brand
      { url: "/acura", changefreq: "monthly", priority: 0.7 }, // Premium brand
      { url: "/subaru", changefreq: "monthly", priority: 0.7 }, // Niche brand
      { url: "/infiniti", changefreq: "monthly", priority: 0.7 }, // Luxury brand
      { url: "/scion", changefreq: "monthly", priority: 0.6 }, // Discontinued brand
      { url: "/blog", changefreq: "weekly", priority: 0.8 }, // Content section
      { url: "/top-sellers", changefreq: "weekly", priority: 0.8 }, // Important commercial page
      { url: "/accessories", changefreq: "monthly", priority: 0.7 }, // Product category
      { url: "/subframe", changefreq: "monthly", priority: 0.6 }, // Specific category
      { url: "/free-shipping", changefreq: "monthly", priority: 0.6 }, // Info page
      { url: "/contact", changefreq: "monthly", priority: 0.5 }, // Contact page
      { url: "/about", changefreq: "monthly", priority: 0.5 }, // About page
    ];

    const languages = ["en", "fr", "es", "de"];

    // ✅ Static pages with multi-language support
    staticPages.forEach((page) => {
      languages.forEach((lang) => {
        sitemap.write({
          url: page.url === "/" ? `/?lang=${lang}` : `${page.url}?lang=${lang}`,
          changefreq: page.changefreq,
          priority: lang === "en" ? page.priority : page.priority * 0.9
        });
      });
    });

    const [products, blogs] = await Promise.all([getProducts(), getBlogs()]);

    // ✅ Products with improved change frequency and lastmod
    products.forEach((product) => {
      if (!product.slug?.en) return;
      
      languages.forEach((lang) => {
        sitemap.write({
          url: `/products/${product.slug.en}?lang=${lang}`,
          changefreq: "weekly", // More realistic than daily
          priority: lang === "en" ? 0.8 : 0.7,
          lastmod: product.updatedAt || new Date()
        });
      });
    });

    // ✅ Blogs with improved settings and lastmod
    blogs.forEach((blog) => {
      if (!blog.slug?.en) return;
      
      languages.forEach((lang) => {
        sitemap.write({
          url: `/blog/${blog.slug.en}?lang=${lang}`,
          changefreq: "weekly", // Blogs might be updated weekly
          priority: lang === "en" ? 0.75 : 0.65,
          lastmod: blog.updatedAt || new Date()
        });
      });
    });

    // End sitemap
    sitemap.end();

    // Convert stream to proper XML
    const xml = await streamToPromise(sitemap);

    return new NextResponse(xml, {
      headers: { 
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600" // Cache for 1 hour
      },
    });
  } catch (err) {
    console.error("Sitemap generation error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}