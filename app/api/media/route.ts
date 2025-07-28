import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import clientPromise from '../../lib/mongodb'; // adjust path if needed
import { ObjectId } from 'mongodb';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_SECRET_KEY!,
});

// POST: Upload image to Cloudinary and save URL to MongoDB
export async function POST(req: Request) {
  try {
    const { image } = await req.json();

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // Extract base64 data
    const matches = image.match(/^data:(.+);base64,(.+)$/);
    if (!matches) {
      return NextResponse.json({ error: 'Invalid image format' }, { status: 400 });
    }

    const buffer = Buffer.from(matches[2], 'base64');

    // Upload to Cloudinary
    const uploadFromBuffer = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ folder: 'uploads' }, (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
        Readable.from(buffer).pipe(stream);
      });
    };

    const result: any = await uploadFromBuffer();

    // Save to MongoDB
    const client = await clientPromise;
   const db = client.db("autodrive");
    const collection = db.collection('media');

    await collection.insertOne({
      url: result.secure_url,
      uploadedAt: new Date(),
    });

    return NextResponse.json({ imageUrl: result.secure_url });
  } catch (error) {
    console.error('POST upload error:', error);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}

// GET: Fetch uploaded images from MongoDB
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("autodrive");
    const collection = db.collection('media');

    const images = await collection.find({}).sort({ uploadedAt: -1 }).toArray();

    const formatted = images.map((img) => ({
      id: img._id,
      url: img.url,
    }));

    return NextResponse.json({ images: formatted });
  } catch (error) {
    console.error('GET fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
  }
}

// DELETE: Remove image from Cloudinary and MongoDB
export async function DELETE(req: Request) {
  try {
    const { id, url } = await req.json();

    if (!id || !url) {
      return NextResponse.json({ error: 'Missing id or url' }, { status: 400 });
    }

    // Extract public_id from Cloudinary URL
    const publicId = url.split('/').pop()?.split('.')[0];
    if (publicId) {
      await cloudinary.uploader.destroy(`uploads/${publicId}`);
    }

    const client = await clientPromise;
    const db = client.db("autodrive");
    const collection = db.collection('media');

    await collection.deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 });
  }
}