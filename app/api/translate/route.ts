import { NextRequest, NextResponse } from "next/server";
import clientPromise from "../../lib/mongodb"; // Ensure this is your MongoDB connection helper

// Helper function to get translation from the database
async function getTranslationFromDatabase(text: string, source: string, target: string) {
  try {
    const client = await clientPromise;
     const db = client.db("autodrive");
    const translations = db.collection("translations"); // Use your collection name
    const cachedTranslation = await translations.findOne({ text, source, target });

    return cachedTranslation ? cachedTranslation.translatedText : null;
  } catch (error) {
    console.error("Database error:", error);
    return null;
  }
}

// Helper function to store translation in the database
async function storeTranslationInDatabase(text: string, source: string, target: string, translatedText: string) {
  try {
    const client = await clientPromise;
     const db = client.db("autodrive");
    const translations = db.collection("translations"); // Use your collection name

    await translations.insertOne({
      text,
      source,
      target,
      translatedText,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error("Database error:", error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { text, source, target } = await req.json();

    if (!text || !source || !target) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    // First, check if the translation exists in the database
    const cachedTranslation = await getTranslationFromDatabase(text, source, target);
    if (cachedTranslation) {
      return NextResponse.json({ translatedText: cachedTranslation });
    }

    // If no cached translation, make the API call
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${source}|${target}`
    );

    const data = await response.json();
    if (data.responseStatus !== 200) {
      throw new Error(data.responseDetails || "Translation API failed");
    }

    // Store the translated text in the database for future use
    await storeTranslationInDatabase(text, source, target, data.responseData.translatedText);

    // Return the translated text from the API
    return NextResponse.json({ translatedText: data.responseData.translatedText });
  } catch (error) {
    console.error("Translation API Error:", error);
    return NextResponse.json({ error: "Translation failed" }, { status: 500 });
  }
}