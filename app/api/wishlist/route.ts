import { NextResponse } from 'next/server';
import clientPromise from '../../lib/mongodb';

type WishlistItem = {
  slug: string;
  name: string;
  price: number;
  mainImage: string;
};

type Wishlist = {
  guestId: string;
  items: WishlistItem[];
};

// POST: Add or update wishlist items
export async function POST(req: Request) {
  const { slug, language } = await req.json();
  console.log(`Received data: slug=${slug}`);

  // Extract or generate guestId
  const cookies = req.headers.get('cookie') || '';
  const newGuestId = 'guest-' + Date.now();
  const guestId =
    cookies.split('; ').find((c) => c.startsWith('guestId='))?.split('=')[1] || newGuestId;

  console.log(`[POST] Updating wishlist. GuestID: ${guestId}, Slug: ${slug}`);

  if (!slug) {
    return NextResponse.json({ error: 'Product slug is required' }, { status: 400 });
  }
  if (!language) {
    return NextResponse.json({ error: 'Language is required' }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db("autodrive");
    const wishlistCollection = db.collection('wishlist');
    const productsCollection = db.collection("products");

    // Fetch product using slug and language
    const product = await productsCollection.findOne({ [`slug.${language}`]: slug });
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Fetch or create wishlist
    let wishlist = (await wishlistCollection.findOne({ guestId })) as Wishlist | null;

    if (!wishlist) {
      wishlist = {
        guestId,
        items: [
          {
            slug,
            name: product.name[language] || product.name.en,
            price: product.price,
            mainImage: product.mainImage,
          },
        ],
      };
      await wishlistCollection.insertOne(wishlist);
    } else {
      const itemIndex = wishlist.items.findIndex((item) => item.slug === slug);
      if (itemIndex >= 0) {
        // If already in wishlist, no quantity update needed, so no change
      } else {
        wishlist.items.push({
          slug,
          name: product.name[language] || product.name.en,
          price: product.price,
          mainImage: product.mainImage,
        });
      }
      await wishlistCollection.updateOne({ guestId }, { $set: { items: wishlist.items } });
    }

    const headers = new Headers();
    if (newGuestId === guestId) {
      headers.append('Set-Cookie', `guestId=${guestId}; Path=/; HttpOnly; SameSite=Strict`);
    }

    const updatedWishlist = await wishlistCollection.findOne({ guestId });
    return NextResponse.json(
      { message: 'Wishlist updated', wishlist: updatedWishlist },
      { headers }
    );
  } catch (error) {
    console.error('Error updating wishlist:', error);
    return NextResponse.json({ error: 'Failed to update wishlist' }, { status: 500 });
  }
}

// GET: Retrieve wishlist data
export async function GET(req: Request) {
  const cookies = req.headers.get('cookie') || '';
  const newGuestId = 'guest-' + Date.now();
  const guestId =
    cookies.split('; ').find((c) => c.startsWith('guestId='))?.split('=')[1] || newGuestId;

  console.log(`[GET] Fetching wishlist. GuestID: ${guestId}`);

  try {
    const client = await clientPromise;
    const db = client.db("autodrive");
    const wishlistCollection = db.collection('wishlist');
    const wishlist = (await wishlistCollection.findOne({ guestId })) as Wishlist | null;

    const headers = new Headers();
    if (newGuestId === guestId) {
      headers.append('Set-Cookie', `guestId=${guestId}; Path=/; HttpOnly; SameSite=Strict`);
    }

    if (!wishlist) {
      return NextResponse.json(
        { message: 'Wishlist is empty', wishlist: null },
        { headers }
      );
    }

    return NextResponse.json({ wishlist }, { headers });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return NextResponse.json({ error: 'Failed to fetch wishlist' }, { status: 500 });
  }
}

// DELETE: Remove an item or clear the wishlist
export async function DELETE(req: Request) {
  const { slug } = await req.json();

  // Extract guestId
  const cookies = req.headers.get('cookie') || '';
  const guestId =
    cookies.split('; ').find((c) => c.startsWith('guestId='))?.split('=')[1];

  if (!guestId) {
    return NextResponse.json({ error: 'No wishlist found' }, { status: 400 });
  }

  console.log(`[DELETE] Removing item from wishlist. GuestID: ${guestId}, Slug: ${slug}`);

  try {
    const client = await clientPromise;
    const db = client.db("autodrive");
    const wishlistCollection = db.collection('wishlist');

    // Fetch the wishlist
    let wishlist = (await wishlistCollection.findOne({ guestId })) as Wishlist | null;
    if (!wishlist) {
      return NextResponse.json({ error: 'Wishlist not found' }, { status: 404 });
    }

    if (slug) {
      // Remove specific item
      wishlist.items = wishlist.items.filter((item) => item.slug !== slug);
      if (wishlist.items.length > 0) {
        await wishlistCollection.updateOne({ guestId }, { $set: { items: wishlist.items } });
      } else {
        await wishlistCollection.deleteOne({ guestId }); // Delete wishlist if empty
      }
    } else {
      // Delete entire wishlist
      await wishlistCollection.deleteOne({ guestId });
    }

    return NextResponse.json({ message: 'Wishlist updated', wishlist });
  } catch (error) {
    console.error('Error removing item from wishlist:', error);
    return NextResponse.json({ error: 'Failed to remove item' }, { status: 500 });
  }
}
