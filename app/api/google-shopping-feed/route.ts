// app/api/google-shopping-feed/route.ts
import { NextResponse } from 'next/server';
import { getAllProducts } from '../lib/products';


export const dynamic = 'force-dynamic';
export const revalidate = 86400;

export async function GET() {
  try {
    const products = await getAllProducts();
    const siteUrl = 'https://www.drivecoreauto.com'; // ✅ NO TRAILING SPACE

    if (!products || products.length === 0) {
      console.warn('⚠️ No products found for Google Shopping feed');
    }

    const itemsXml = products
      .map(product => {
        const title = product.name || 'Untitled Product';
        const description = product.description || 'High-quality automotive product from DriveCore Auto.';
        const link = `${siteUrl}/products/${product.slug}`;
        const image = product.mainImage || `${siteUrl}/images/placeholder-product.jpg`;
        const price = (product.price || 0).toFixed(2);
        const brand = product.brand || 'DriveCore Auto';
        const availability = 'in stock'; // You don't track stock — assume always available

        return `
        <item>
          <g:id>${product.id}</g:id>
          <g:title><![CDATA[${title}]]></g:title>
          <g:description><![CDATA[${description}]]></g:description>
          <g:link>${link}</g:link>
          <g:image_link>${image}</g:image_link>
          <g:price>${price} USD</g:price>
          <g:brand>${brand}</g:brand>
          <g:condition>new</g:condition>
          <g:availability>${availability}</g:availability>
        </item>
        `.trim();
      })
      .join('');

    const rss = `
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>DriveCore Auto</title>
    <link>${siteUrl}</link>
    <description>Premium automotive parts and accessories for enthusiasts and professionals.</description>
    ${itemsXml}
  </channel>
</rss>
`.trim();

    return new NextResponse(rss, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200',
      },
    });
  } catch (error) {
    console.error('❌ Failed to generate Google Shopping feed:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}