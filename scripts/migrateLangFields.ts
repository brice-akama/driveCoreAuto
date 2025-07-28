// Adjust the relative path as needed
// migrateLangFields.ts
import clientPromise from "../app/lib/mongodb"; // use relative path without alias

async function migrateLangFields() {
  const client = await clientPromise;
  const db = client.db('autodrive');

  const products = await db.collection('products').find().toArray();

  for (const product of products) {
    const update: any = {};

    if (product.name?.ja && !product.name.fr) {
      update['name.fr'] = product.name.ja;
    }
    if (product.name?.zh && !product.name.es) {
      update['name.es'] = product.name.zh;
    }

    if (product.description?.ja && !product.description.fr) {
      update['description.fr'] = product.description.ja;
    }
    if (product.description?.zh && !product.description.es) {
      update['description.es'] = product.description.zh;
    }

    if (Object.keys(update).length > 0) {
      await db.collection('products').updateOne(
        { _id: product._id },
        { $set: update }
      );
    }
  }
  console.log('Migration completed');
}

migrateLangFields().catch(console.error);
