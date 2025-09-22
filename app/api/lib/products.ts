// lib/products.ts
import clientPromise from '../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function getAllProducts() {
  try {
    const client = await clientPromise;
    const db = client.db('autodrive'); // 👈 Your DB name from POST handler

    const products = await db.collection('products').find({}).toArray();
    
    return products.map(product => ({
      _id: product._id,
      id: product._id?.toString(),
      name: product.name?.en || 'Untitled Product',
      slug: product.slug?.en || product._id?.toString(),
      description: product.description?.en || product.seoDescription?.en || 'No description available.',
      mainImage: product.mainImage || '',
      price: product.price || 0,
      stock: 999, // You don't have stock field — assume always in stock
      brand: 'DriveCore Auto',
      category: product.category || '',
      isPublished: product.isPublished,
    }));
  } catch (error) {
    console.error('❌ Failed to fetch products for Google feed:', error);
    throw error;
  }
}