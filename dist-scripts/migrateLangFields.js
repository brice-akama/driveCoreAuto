"use strict";
// Adjust the relative path as needed
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = __importDefault(require("@/app/lib/mongodb"));
async function migrateLangFields() {
    const client = await mongodb_1.default;
    const db = client.db('autodrive');
    const products = await db.collection('products').find().toArray();
    for (const product of products) {
        const update = {};
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
        // Add other multilingual fields similarly (Specifications, Shipping, Warranty, etc.)
        if (Object.keys(update).length > 0) {
            await db.collection('products').updateOne({ _id: product._id }, { $set: update });
        }
    }
    console.log('Migration completed');
}
migrateLangFields().catch((err) => {
    console.error('Migration failed:', err);
    process.exit(1);
});
