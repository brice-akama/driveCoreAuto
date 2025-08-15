import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import slugify from 'slugify';
import clientPromise from '../../lib/mongodb';
import cloudinary from 'cloudinary';
import { Readable } from 'stream';
import sanitizeHTML from 'sanitize-html';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_SECRET_KEY!,
});

const bufferToStream = (buffer: Buffer) => {
  const readable = new Readable();
  readable.push(buffer);
  readable.push(null);
  return readable;
};

const sanitizeInput = (input: string) => {
  return sanitizeHTML(input, {
    allowedTags: ['b', 'i', 'em', 'strong', 'u', 'p', 'br', 'a', 'ul', 'ol', 'li'],
    allowedAttributes: { '*': ['href', 'target'] },
    allowedIframeHostnames: ['www.youtube.com', 'player.vimeo.com'],
  });
};

const getMultilingualField = (form: FormData, field: string) => ({
  en: sanitizeInput(form.get(`${field}[en]`) as string || ''),
  de: sanitizeInput(form.get(`${field}[de]`) as string || ''),
  fr: sanitizeInput(form.get(`${field}[fr]`) as string || ''),
  es: sanitizeInput(form.get(`${field}[es]`) as string || ''),
});

type CacheEntry = {
  data: any;
  total: number;
  timestamp: number;
};

const productCache = new Map<string, CacheEntry>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes









export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();

    // Get multilingual fields
    const name = getMultilingualField(form, 'name');
    const description = getMultilingualField(form, 'description');
    const Specifications = getMultilingualField(form, 'Specifications');
    const Shipping = getMultilingualField(form, 'Shipping');
    const Warranty = getMultilingualField(form, 'Warranty');
    const seoTitle = getMultilingualField(form, 'seoTitle');
    const seoDescription = getMultilingualField(form, 'seoDescription');
    const seoKeywords = getMultilingualField(form, 'seoKeywords');

    // Use name in English to create slug (fallback to any other if needed)
    const baseName = sanitizeInput(name?.en || "");
    const slug = {
      en: slugify(sanitizeInput(name.en || ''), { lower: true, strict: true }),
      de: slugify(sanitizeInput(name.de || ''), { lower: true, strict: true }),
      fr: slugify(sanitizeInput(name.fr || ''), { lower: true, strict: true }),
      es: slugify(sanitizeInput(name.es || ''), { lower: true, strict: true }),
    };



    // Other fields
    const rawPrice = form.get('price') as string;
    const price = parseFloat(rawPrice.replace(/,/g, ''));

    const category = sanitizeInput(form.get('category') as string);

    const toyota = form.get('toyota') === 'true';
    const acura = form.get('acura') === 'true';
    const scion = form.get('scion') === 'true';
    const honda = form.get('honda') === 'true';
    const lexus = form.get('lexus') === 'true';
    const infiniti = form.get('infiniti') === 'true';        // transmissionsToyotaManuel
    const subaru = form.get('subaru') === 'true';
    const partsFluids = form.get('partsFluids') === 'true';
const wheelsTires = form.get('wheelsTires') === 'true';
const subframe = form.get('subframe') === 'true';
const accessories = form.get('accessories') === 'true';
const bumpers = form.get('bumpers') === 'true';
const freeShipping = form.get('freeShipping') === 'true';
const topSellers = form.get('topSellers') === 'true';

const swapsToyota = form.get('swapsToyota') === 'true';
const swapsHonda = form.get('swapsHonda') === 'true';
const swapsAcura = form.get('swapsAcura') === 'true';
const swapsScion = form.get('swapsScion') === 'true';
const swapsLexus = form.get('swapsLexus') === 'true';
const swapsNissan = form.get('swapsNissan') === 'true';
const swapsSubaru = form.get('swapsSubaru') === 'true';
const swapsInfiniti = form.get('swapsInfiniti') === 'true';


    const transmissionsToyotaAutomatic = form.get('transmissionsToyotaAutomatic') === 'true';
    const transmissionsHondataAutomatic = form.get('transmissionsHondataAutomatic') === 'true';
    const transmissionsAcuretaAutomatic = form.get('transmissionsAcuretaAutomatic') === 'true';
    const transmissionsInfinitAutomatic = form.get('transmissionsInfinitAutomatic') === 'true';
    const transmissionsSaburaAutomatic = form.get('transmissionsSaburaAutomatic') === 'true';
    const transmissionsScionAutomatic = form.get('transmissionsScionAutomatic') === 'true';
    const transmissionsNissanAutomatic = form.get('transmissionsNissanAutomatic') === 'true';
    const transmissionsLexusAutomatic = form.get('transmissionsLexusAutomatic') === 'true';
    const transmissionsToyotaManuel = form.get('transmissionsToyotaManuel') === 'true';
    const transmissionsHondaaManuel = form.get('transmissionsHondaaManuel') === 'true';
    const transmissionsAcureaManuel = form.get('transmissionsAcureaManuel') === 'true';
    const transmissionsInfinitManuel = form.get('transmissionsInfinitManuel') === 'true';
    const transmissionsSaburaManuel = form.get('transmissionsSaburaManuel') === 'true';
    const transmissionScionburaManuel = form.get('transmissionScionburaManuel') === 'true';
    const transmissionNissanburaManuel = form.get('transmissionNissanburaManuel') === 'true';
    const transmissionLexuxburaManuel = form.get('transmissionLexuxburaManuel') === 'true';
    const nissan = form.get('nissan') === 'true';
    const popularProduct = form.get('popularProduct') === 'true';
    const isPublished = form.get('isPublished') === 'true';

    const weights = JSON.parse(form.get('weights') as string || '[]');
    const seeds = JSON.parse(form.get('seeds') as string || '[]');

    const mainImage = form.get('mainImage') as File;
    const thumbnails = Array.from(form.getAll('thumbnails'));

    // ✅ Validate required fields
    if (!name?.en) return NextResponse.json({ error: 'Missing name.en' }, { status: 400 });
    if (!description?.en) return NextResponse.json({ error: 'Missing description.en' }, { status: 400 });
    if (!price) return NextResponse.json({ error: 'Missing price' }, { status: 400 });
    if (!category) return NextResponse.json({ error: 'Missing category' }, { status: 400 });
    if (!mainImage) return NextResponse.json({ error: 'Missing main image' }, { status: 400 });


    // ✅ Upload main image
    const mainImageBuffer = Buffer.from(await mainImage.arrayBuffer());
    const mainImageUpload = await new Promise<any>((resolve, reject) => {
      cloudinary.v2.uploader.upload_stream(
        { folder: 'products/main' },
        (error, result) => error ? reject(error) : resolve(result)
      ).end(mainImageBuffer);
    });

    // ✅ Upload thumbnails
    const uploadedThumbnails = await Promise.all(
      thumbnails.map(async (thumbnail) => {
        if (thumbnail instanceof File) {
          const buffer = Buffer.from(await thumbnail.arrayBuffer());
          const upload = await new Promise<any>((resolve, reject) => {
            cloudinary.v2.uploader.upload_stream(
              { folder: 'products/thumbnails' },
              (error, result) => error ? reject(error) : resolve(result)
            ).end(buffer);
          });
          return upload.secure_url;
        }
        return null;
      })
    );

    const client = await clientPromise;
    const db = client.db("autodrive");
    const newId = new ObjectId().toHexString();

    const newProduct = {
      _id: new ObjectId(newId),
      name,
      slug,
      description,
      Specifications,
      Shipping,
      Warranty,
      seoTitle,
      seoDescription,
      seoKeywords,
      category,
      price,
      toyota,
      acura,
      scion,
      honda,
      lexus,
      infiniti,
      swapsToyota,
  swapsHonda,
  swapsAcura,
  swapsScion,
  swapsLexus,
  swapsNissan,
  swapsSubaru,
  swapsInfiniti,
      transmissionsToyotaAutomatic,//
      transmissionsToyotaManuel,//
      transmissionsHondataAutomatic,//
      transmissionsHondaaManuel,//
      transmissionsAcuretaAutomatic,//
      transmissionsAcureaManuel,//
      transmissionsInfinitAutomatic,//
      transmissionsInfinitManuel,//
      transmissionsSaburaAutomatic,//
      transmissionsScionAutomatic,//
      transmissionsSaburaManuel,//
      transmissionScionburaManuel,//
      transmissionsNissanAutomatic,//
      transmissionNissanburaManuel,//
      transmissionLexuxburaManuel,//
      transmissionsLexusAutomatic,//
      subaru,
      nissan,
      partsFluids,
wheelsTires,
subframe,
accessories,
bumpers,
freeShipping,
topSellers,

      popularProduct,
      isPublished,
      mainImage: mainImageUpload?.secure_url || '',
      thumbnails: uploadedThumbnails.filter(Boolean) as string[],
      weights,
      seeds,
    };

    await db.collection('products').insertOne(newProduct);

    const relatedProducts = await db.collection('products')
      .find({
        _id: { $ne: new ObjectId(newId) },
        category: newProduct.category,
        price: { $gte: newProduct.price * 0.7, $lte: newProduct.price * 1.3 }
      })
      .limit(4)
      .project({ _id: 1 })
      .toArray();

    const relatedProductIds = relatedProducts.map(p => p._id);

    await db.collection('products').updateOne(
      { _id: new ObjectId(newId) },
      { $set: { relatedProductIds } }
    );

    const updatedProduct = await db.collection('products').findOne({ _id: new ObjectId(newId) });

    return NextResponse.json({
      message: 'Product created successfully',
      product: updatedProduct,
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Handle Product Fetching (GET request)
// Handle Product Fetching (GET request with pagination)
export async function GET(req: NextRequest) {
  try {
    console.log("Fetching product data...");

    const client = await clientPromise;
    const db = client.db("autodrive");

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const slug = searchParams.get("slug");    
    const lang = searchParams.get("lang") || "en";              //      transmissionsInfinitManuel
    const toyota = searchParams.get("toyota") === "true";
    const engineCode = searchParams.get("engineCode");
const vehicleModel = searchParams.get("vehicleModel");

    const transmissionsToyotaAutomatic = searchParams.get("transmissionsToyotaAutomatic") === "true";
    const transmissionsToyotaManuel = searchParams.get("transmissionsToyotaManuel") === "true";
    const transmissionsHondataAutomatic = searchParams.get("transmissionsHondataAutomatic") === "true";
    const transmissionsHondaaManuel = searchParams.get("transmissionsHondaaManuel") === "true";
    const transmissionsAcuretaAutomatic = searchParams.get("transmissionsAcuretaAutomatic") === "true";
    const transmissionsAcureaManuel = searchParams.get("transmissionsAcureaManuel") === "true";
    const transmissionsInfinitAutomatic = searchParams.get("transmissionsInfinitAutomatic") === "true";
    const transmissionsInfinitManuel = searchParams.get("transmissionsInfinitManuel") === "true";
    const transmissionsSaburaAutomatic = searchParams.get("transmissionsSaburaAutomatic") === "true";
    const transmissionsScionAutomatic = searchParams.get("transmissionsScionAutomatic") === "true";
    const transmissionsSaburaManuel = searchParams.get("transmissionsSaburaManuel") === "true";
    const transmissionScionburaManuel = searchParams.get("transmissionScionburaManuel") === "true";
    const transmissionsNissanAutomatic = searchParams.get("transmissionsNissanAutomatic") === "true";
    const transmissionLexuxburaManuel = searchParams.get("transmissionLexuxburaManuel") === "true";
    const transmissionNissanburaManuel = searchParams.get("transmissionNissanburaManuel") === "true";
    const transmissionsLexusAutomatic = searchParams.get("transmissionsLexusAutomatic") === "true";
    const scion = searchParams.get("scion") === "true";
    const infiniti = searchParams.get("infiniti") === "true";
    const nissan = searchParams.get("nissan") === "true";
    const lexus = searchParams.get("lexus") === "true";
    const subaru = searchParams.get("subaru") === "true";
    const honda = searchParams.get("honda") === "true";
    const acura = searchParams.get("acura") === "true";
    const popularProduct = searchParams.get("popularProduct") === "true";
    const partsFluids = searchParams.get("partsFluids") === "true";
const wheelsTires = searchParams.get("wheelsTires") === "true";
const subframe = searchParams.get("subframe") === "true";
const accessories = searchParams.get("accessories") === "true";
const bumpers = searchParams.get("bumpers") === "true";
const freeShipping = searchParams.get("freeShipping") === "true";
const topSellers = searchParams.get("topSellers") === "true";
// Swap filters
const swapsToyota = searchParams.get("swapsToyota") === "true";
const swapsHonda = searchParams.get("swapsHonda") === "true";
const swapsAcura = searchParams.get("swapsAcura") === "true";
const swapsScion = searchParams.get("swapsScion") === "true";
const swapsLexus = searchParams.get("swapsLexus") === "true";
const swapsNissan = searchParams.get("swapsNissan") === "true";
const swapsSubaru = searchParams.get("swapsSubaru") === "true";
const swapsInfiniti = searchParams.get("swapsInfiniti") === "true";

   

    // Pagination (optional)
    // Pagination (optional)
    const pageParam = searchParams.get("page") || searchParams.get("_page");
    const perPageParam = searchParams.get("perPage") || searchParams.get("_limit");
    const limitParam = searchParams.get("limit"); // 👈 new addition

    let skip = 0;
    let limit = 0;

    if (pageParam && perPageParam) {
      const page = parseInt(pageParam, 10);
      const perPage = parseInt(perPageParam, 10);
      skip = (page - 1) * perPage;
      limit = perPage;
    } else if (limitParam) {
      limit = parseInt(limitParam, 10); // 👈 now supports limit=4 directly
    }


    // Sorting
    const sortField = searchParams.get("sort") || searchParams.get("_sort") || "createdAt";
    const sortOrder =
      (searchParams.get("order") || searchParams.get("_order") || "desc").toLowerCase() === "asc" ? 1 : -1;

    // Construct a simple cache key based on all query parameters
    const key = req.url;

    // Check for cached result
    const cached = productCache.get(key);
    if (cached && (Date.now() - cached.timestamp < CACHE_DURATION)) {
      console.log("Serving products from cache");
      return NextResponse.json(
        {
          data: cached.data,
          total: cached.total,
        },
        { status: 200 }
      );
    }


    console.log("Request received", {
      id,
      slug,
      toyota,
      scion,
      popularProduct,
      subaru,
      infiniti,
      nissan,
      lexus,
      honda,
      swapsToyota,
  swapsHonda,
  swapsAcura,
  swapsScion,
  swapsLexus,
  swapsNissan,
  swapsSubaru,
  swapsInfiniti,
      transmissionsToyotaAutomatic,
      transmissionsToyotaManuel,
      transmissionsHondataAutomatic,
      transmissionsHondaaManuel,
      transmissionsAcuretaAutomatic,
      transmissionsAcureaManuel,
      transmissionsInfinitAutomatic,
      transmissionsInfinitManuel,
      transmissionsSaburaAutomatic,
      transmissionsScionAutomatic,
      transmissionsSaburaManuel,
      transmissionScionburaManuel,
      transmissionsNissanAutomatic,
      transmissionNissanburaManuel,
      transmissionLexuxburaManuel,
      transmissionsLexusAutomatic,
      acura,
      partsFluids,
  wheelsTires,
  subframe,
  accessories,
  bumpers,
  freeShipping,
  topSellers,
      skip,
      limit,
      sortField,
      sortOrder,
    });

    // Fetch by ID
    if (id) {
      if (!ObjectId.isValid(id)) {
        return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
      }
      const product = await db.collection("products").findOne({ _id: new ObjectId(id) });
      if (!product) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }
      return NextResponse.json({ data: { id: product._id.toString(), ...product } }, { status: 200 });
    }

    // Fetch product by slug
    if (slug) {
  const product = await db.collection("products").findOne({ [`slug.${lang}`]: slug });

      if (!product) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }

      // Fetch related products based on the relatedProductIds field
      const relatedProducts = await db.collection("products").find({
        _id: {
          $in: product.relatedProductIds.map((id: string) => new ObjectId(id)),
        },
      }).toArray();




      return NextResponse.json({
        data: {
          id: product._id.toString(),
          ...product,
          relatedProducts: relatedProducts.map((relatedProduct) => ({
            id: relatedProduct._id.toString(),
            name: relatedProduct.name,
            slug: relatedProduct.slug,
            mainImage: relatedProduct.mainImage,
            price: relatedProduct.price
          }))
        }
      }, { status: 200 });
    }



    const filter: any = {};

    

    // 1. Brand filters (unchanged)
    const brandFilters = {
      toyota: searchParams.get("toyota") === "true",
      nissan: searchParams.get("nissan") === "true",
      subaru: searchParams.get("subaru") === "true",
      infiniti: searchParams.get("infiniti") === "true",
      lexus: searchParams.get("lexus") === "true",
      honda: searchParams.get("honda") === "true",
      scion: searchParams.get("scion") === "true",
      acura: searchParams.get("acura") === "true",
      swapsToyota: searchParams.get("swapsToyota") === "true",
swapsHonda: searchParams.get("swapsHonda") === "true",
swapsAcura: searchParams.get("swapsAcura") === "true",
swapsScion: searchParams.get("swapsScion") === "true",
swapsLexus: searchParams.get("swapsLexus") === "true",
swapsNissan: searchParams.get("swapsNissan") === "true",
swapsSubaru: searchParams.get("swapsSubaru") === "true",
swapsInfiniti: searchParams.get("swapsInfiniti") === "true",

      
      transmissionsToyotaAutomatic: searchParams.get("transmissionsToyotaAutomatic") === "true",
  transmissionsToyotaManuel: searchParams.get("transmissionsToyotaManuel") === "true",
  transmissionsHondataAutomatic: searchParams.get("transmissionsHondataAutomatic") === "true",
  transmissionsHondaaManuel: searchParams.get("transmissionsHondaaManuel") === "true",
  transmissionsAcuretaAutomatic: searchParams.get("transmissionsAcuretaAutomatic") === "true",
  transmissionsAcureaManuel: searchParams.get("transmissionsAcureaManuel") === "true",
  transmissionsInfinitAutomatic: searchParams.get("transmissionsInfinitAutomatic") === "true",
  transmissionsInfinitManuel: searchParams.get("transmissionsInfinitManuel") === "true",
  transmissionsSaburaAutomatic: searchParams.get("transmissionsSaburaAutomatic") === "true",
  transmissionsSaburaManuel: searchParams.get("transmissionsSaburaManuel") === "true",
  transmissionsScionAutomatic: searchParams.get("transmissionsScionAutomatic") === "true",
  transmissionScionburaManuel: searchParams.get("transmissionScionburaManuel") === "true",
  transmissionsNissanAutomatic: searchParams.get("transmissionsNissanAutomatic") === "true",
  transmissionNissanburaManuel: searchParams.get("transmissionNissanburaManuel") === "true",
  transmissionsLexusAutomatic: searchParams.get("transmissionsLexusAutomatic") === "true",
  transmissionLexuxburaManuel: searchParams.get("transmissionLexuxburaManuel") === "true",
    };

   

    for (const [brand, isSelected] of Object.entries(brandFilters)) {
      if (isSelected) {
        filter[brand] = true;
      }
    }

   // 2. Engine code or vehicle model logic (applies to all selected brands, swaps, transmissions)
if (engineCode) {
  // Match category exactly with the engine code (case-insensitive)
  filter.category = { $regex: new RegExp(`^${engineCode}$`, "i") };
} else if (vehicleModel) {
  // Search vehicle model by product name in all supported languages
  const langKeys = ["en", "de", "fr", "es"];
  filter.$or = langKeys.map((lang) => ({
    [`name.${lang}`]: { $regex: new RegExp(`\\b${vehicleModel}\\b`, "i") },
  }));
}

// Now filter only the selected brands/swaps/transmissions
const brandAndSwapKeys = [
  "toyota", "nissan", "subaru", "infiniti", "lexus", "honda", "scion", "acura",
  "swapsToyota", "swapsHonda", "swapsAcura", "swapsScion", "swapsLexus",
  "swapsNissan", "swapsSubaru", "swapsInfiniti",
  "transmissionsToyotaAutomatic","transmissionsToyotaManuel",
  "transmissionsHondataAutomatic","transmissionsHondaaManuel",
  "transmissionsAcuretaAutomatic","transmissionsAcureaManuel",
  "transmissionsInfinitAutomatic","transmissionsInfinitManuel",
  "transmissionsSaburaAutomatic","transmissionsSaburaManuel",
  "transmissionsScionAutomatic","transmissionScionburaManuel",
  "transmissionsNissanAutomatic","transmissionNissanburaManuel",
  "transmissionsLexusAutomatic","transmissionLexuxburaManuel"
];

brandAndSwapKeys.forEach((key) => {
  const value = searchParams.get(key) === "true";
  if (value) {
    filter[key] = true;
  }
});




    
    if (partsFluids) filter.partsFluids = true;
if (wheelsTires) filter.wheelsTires = true;
if (subframe) filter.subframe = true;
if (accessories) filter.accessories = true;
if (bumpers) filter.bumpers = true;
if (freeShipping) filter.freeShipping = true;
if (topSellers) filter.topSellers = true;
     

    // 3. Optional: popularProduct filter
    if (searchParams.get("popularProduct") === "true") {
      filter.popularProduct = true;
    }

    const totalCount = await db.collection("products").countDocuments(filter);

    
// Build query
    const query = db.collection("products").find(filter).sort({ [sortField]: sortOrder });

    if (limit > 0) {
      query.skip(skip).limit(limit);
    }

    const products = await query.toArray();


    const formattedProducts = products.map(product => ({
      id: product._id.toString(),
      ...product
    }));

    // Cache the result
    productCache.set(key, {
      data: formattedProducts,
      total: totalCount,
      timestamp: Date.now(),
    });


    return NextResponse.json(
      {
        data: formattedProducts,
        total: totalCount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


export async function PUT(req: NextRequest) {
  try {
    const form = await req.formData();

    const id = form.get('id') as string;
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid or missing ID' }, { status: 400 });
    }

    // Multilingual fields (including name)
    const name = getMultilingualField(form, 'name');
    const description = getMultilingualField(form, 'description');
    const Specifications = getMultilingualField(form, 'Specifications');
    const Shipping = getMultilingualField(form, 'Shipping');
    const Warranty = getMultilingualField(form, 'Warranty');
    const seoTitle = getMultilingualField(form, 'seoTitle');
    const seoDescription = getMultilingualField(form, 'seoDescription');
    const seoKeywords = getMultilingualField(form, 'seoKeywords');

    // Sanitize name fields to generate multilingual slug object
    const slug = {
      en: slugify(sanitizeInput(name.en || ''), { lower: true, strict: true }),
      de: slugify(sanitizeInput(name.de || ''), { lower: true, strict: true }),
      fr: slugify(sanitizeInput(name.fr || ''), { lower: true, strict: true }),
      es: slugify(sanitizeInput(name.es || ''), { lower: true, strict: true }),
    };


    // Other fields
    const rawPrice = form.get('price') as string;
    const price = rawPrice ? parseFloat(rawPrice.replace(/,/g, '')) : 0;

    const category = sanitizeInput(form.get('category') as string || '');

    const toyota = form.get('toyota') === 'true';
    const acura = form.get('acura') === 'true';
    const scion = form.get('scion') === 'true';
    const honda = form.get('honda') === 'true';
    const lexus = form.get('lexus') === 'true';
    const infiniti = form.get('infiniti') === 'true';
    const subaru = form.get('subaru') === 'true';
    const nissan = form.get('nissan') === 'true';
    const popularProduct = form.get('popularProduct') === 'true';
    const partsFluids = form.get('partsFluids') === 'true';
const wheelsTires = form.get('wheelsTires') === 'true';
const subframe = form.get('subframe') === 'true';
const accessories = form.get('accessories') === 'true';
const bumpers = form.get('bumpers') === 'true';
const freeShipping = form.get('freeShipping') === 'true';
const topSellers = form.get('topSellers') === 'true';
const swapsToyota = form.get('swapsToyota') === 'true';
const swapsHonda = form.get('swapsHonda') === 'true';
const swapsAcura = form.get('swapsAcura') === 'true';
const swapsScion = form.get('swapsScion') === 'true';
const swapsLexus = form.get('swapsLexus') === 'true';
const swapsNissan = form.get('swapsNissan') === 'true';
const swapsSubaru = form.get('swapsSubaru') === 'true';
const swapsInfiniti = form.get('swapsInfiniti') === 'true';


    // Transmission type flags
const transmissionsToyotaAutomatic = form.get('transmissionsToyotaAutomatic') === 'true';
const transmissionsToyotaManuel = form.get('transmissionsToyotaManuel') === 'true';
const transmissionsHondataAutomatic = form.get('transmissionsHondataAutomatic') === 'true';
const transmissionsHondaaManuel = form.get('transmissionsHondaaManuel') === 'true';
const transmissionsAcuretaAutomatic = form.get('transmissionsAcuretaAutomatic') === 'true';
const transmissionsAcureaManuel = form.get('transmissionsAcureaManuel') === 'true';
const transmissionsInfinitAutomatic = form.get('transmissionsInfinitAutomatic') === 'true';
const transmissionsInfinitManuel = form.get('transmissionsInfinitManuel') === 'true';
const transmissionsSaburaAutomatic = form.get('transmissionsSaburaAutomatic') === 'true';
const transmissionsSaburaManuel = form.get('transmissionsSaburaManuel') === 'true';
const transmissionsScionAutomatic = form.get('transmissionsScionAutomatic') === 'true';
const transmissionScionburaManuel = form.get('transmissionScionburaManuel') === 'true';
const transmissionsNissanAutomatic = form.get('transmissionsNissanAutomatic') === 'true';
const transmissionNissanburaManuel = form.get('transmissionNissanburaManuel') === 'true';
const transmissionsLexusAutomatic = form.get('transmissionsLexusAutomatic') === 'true';
const transmissionLexuxburaManuel = form.get('transmissionLexuxburaManuel') === 'true';

    const isPublished = form.get('isPublished') === 'true';

    const weights = JSON.parse(form.get('weights') as string || '[]');
    const seeds = JSON.parse(form.get('seeds') as string || '[]');

    const mainImageFile = form.get('mainImage') as File | null;
    const thumbnailsFiles = Array.from(form.getAll('thumbnails'));

    // Upload main image if provided
    let mainImageUrl = '';
    if (mainImageFile && mainImageFile.size > 0) {
      const mainImageBuffer = Buffer.from(await mainImageFile.arrayBuffer());
      mainImageUrl = await new Promise<string>((resolve, reject) => {
        cloudinary.v2.uploader.upload_stream(
          { folder: 'products/main' },
          (error, result) => (error ? reject(error) : resolve(result?.secure_url || ''))
        ).end(mainImageBuffer);
      });
    }

    // Upload thumbnails if provided
    const uploadedThumbnails = await Promise.all(
      thumbnailsFiles.map(async (thumb) => {
        if (thumb instanceof File && thumb.size > 0) {
          const buffer = Buffer.from(await thumb.arrayBuffer());
          const url = await new Promise<string>((resolve, reject) => {
            cloudinary.v2.uploader.upload_stream(
              { folder: 'products/thumbnails' },
              (error, result) => (error ? reject(error) : resolve(result?.secure_url || ''))
            ).end(buffer);
          });
          return url;
        }
        return null;
      })
    );

    // Build update object
    const updateFields: any = {
      name,
      slug,
      description,
      Specifications,
      Shipping,
      Warranty,
      seoTitle,
      seoDescription,
      seoKeywords,
      price,
      category,
      toyota,
      acura,
      swapsToyota,
swapsHonda,
swapsAcura,
swapsScion,
swapsLexus,
swapsNissan,
swapsSubaru,
swapsInfiniti,

      scion,
      honda,
      lexus,
      infiniti,
      transmissionsToyotaAutomatic,
transmissionsToyotaManuel,
transmissionsHondataAutomatic,
transmissionsHondaaManuel,
transmissionsAcuretaAutomatic,
transmissionsAcureaManuel,
transmissionsInfinitAutomatic,
transmissionsInfinitManuel,
transmissionsSaburaAutomatic,
transmissionsSaburaManuel,
transmissionsScionAutomatic,
transmissionScionburaManuel,
transmissionsNissanAutomatic,
transmissionNissanburaManuel,
transmissionsLexusAutomatic,
transmissionLexuxburaManuel,
partsFluids,
wheelsTires,
subframe,
accessories,
bumpers,
freeShipping,
topSellers,


      subaru,
      nissan,
      popularProduct,
      isPublished,
      weights,
      seeds,
      updatedAt: new Date(),
    };

    if (mainImageUrl) updateFields.mainImage = mainImageUrl;
    if (uploadedThumbnails.filter(Boolean).length > 0)
      updateFields.thumbnails = uploadedThumbnails.filter(Boolean);

    const client = await clientPromise;
    const db = client.db('autodrive');

    const result = await db.collection('products').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Product updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// ✅ DELETE PRODUCT
export async function DELETE(req: NextRequest) {
  try {
    console.log("Received DELETE request");

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    console.log("Product ID:", id);

    if (!id) {
      console.error("Error: Product ID is required");
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("autodrive");

    console.log("Connecting to database...");
    const product = await db.collection("products").findOne({ _id: new ObjectId(id) });
    console.log("Product found:", product);

    if (!product) {
      console.error("Error: Product not found");
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Delete images from Cloudinary
    try {
      if (product.mainImage) {
        console.log("Deleting main image from Cloudinary:", product.mainImage);
        await cloudinary.v2.uploader.destroy(product.mainImage);
        console.log("Main image deleted successfully");
      }

      if (product.thumbnails?.length) {
        console.log(`Deleting ${product.thumbnails.length} thumbnails from Cloudinary...`);
        for (const thumbnail of product.thumbnails) {
          await cloudinary.v2.uploader.destroy(thumbnail);
          console.log("Deleted thumbnail:", thumbnail);
        }
      }
    } catch (cloudinaryError) {
      console.error("Error deleting images from Cloudinary:", cloudinaryError);
    }

    console.log("Deleting product from database...");
    await db.collection("products").deleteOne({ _id: new ObjectId(id) });
    console.log("Product deleted successfully");

    return NextResponse.json({ message: "Product deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Internal Server Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}