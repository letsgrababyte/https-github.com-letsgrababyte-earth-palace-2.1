
import { GoogleGenAI, Type } from "@google/genai";
import { Post } from "../types";
import { db } from "./firebase";
import { collection, getDocs, addDoc, orderBy, query, limit } from "firebase/firestore";

// Fallback data in case everything fails
const FALLBACK_POSTS: Post[] = [
  {
    id: '1',
    user: { id: 'u1', username: 'EarthSystem', handle: '@system', avatarUrl: 'https://picsum.photos/100/100?random=1' },
    content: 'Welcome to EarthPost! Configure your Firebase credentials in services/firebase.ts to enable live features.',
    likes: 0,
    comments: 0,
    timestamp: 'Now'
  }
];

export const fetchFeedPosts = async (): Promise<Post[]> => {
  // 1. Try to fetch from Firestore
  if (db) {
    try {
      const postsRef = collection(db, "posts");
      const q = query(postsRef, orderBy("timestamp", "desc"), limit(20));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
      }
      console.log("Firestore empty, generating seed data via Gemini...");
    } catch (error) {
      console.warn("Error fetching from Firestore (check permissions/config):", error);
    }
  }

  // 2. If Firestore is empty or fails, use Gemini to generate content
  try {
    // Initializing GoogleGenAI directly with the environment variable as per SDK rules
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Using gemini-3-flash-preview as recommended for basic text tasks
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Generate 5 diverse social media posts. Some should be about nature, some about technology, and some lifestyle. Include realistic like counts and comments.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              content: { type: Type.STRING },
              likes: { type: Type.INTEGER },
              comments: { type: Type.INTEGER },
              username: { type: Type.STRING },
              handle: { type: Type.STRING },
              hasImage: { type: Type.BOOLEAN, description: "Whether this post should have an image" }
            }
          }
        }
      }
    });

    // Extracting text output directly from the .text property
    const data = JSON.parse(response.text || '[]');
    
    // Transform and optionally save to Firestore so the user has data next time
    const generatedPosts: Post[] = data.map((item: any, index: number) => ({
      id: `gen-${Date.now()}-${index}`,
      user: {
        id: `gen-user-${index}`,
        username: item.username || 'User',
        handle: item.handle || '@user',
        avatarUrl: `https://picsum.photos/100/100?random=${index + 50}`
      },
      content: item.content,
      imageUrl: item.hasImage ? `https://picsum.photos/800/600?random=${index + 200}` : undefined,
      likes: item.likes,
      comments: item.comments,
      timestamp: new Date().toISOString()
    }));

    // Seed Firestore if available
    if (db && generatedPosts.length > 0) {
      generatedPosts.forEach(async (post) => {
        try {
          await addDoc(collection(db, "posts"), {
            ...post,
            timestamp: new Date().toISOString() // Ensure standard format
          });
        } catch (e) { /* ignore write errors */ }
      });
    }

    return generatedPosts;

  } catch (error) {
    console.error("Gemini API Error:", error);
    return FALLBACK_POSTS;
  }
};
