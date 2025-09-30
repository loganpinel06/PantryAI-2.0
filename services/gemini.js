//gemini.js will integrate the Google Gemini API create the AI Model

//imports
import { GoogleGenAI } from "@google/genai";
//require and configure dotenv for reading .env variables 
import dotenv from 'dotenv';
dotenv.config();

//https://ai.google.dev/gemini-api/docs/quickstart boiler plate code
//The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Explain how AI works in a few words",
  });
  console.log(response.text);
}

main();
