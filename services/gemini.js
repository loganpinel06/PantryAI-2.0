//gemini.js will integrate the Google Gemini API create the AI Model
//documentation followed https://ai.google.dev/gemini-api/docs/quickstart

//imports
import { GoogleGenAI, Type } from "@google/genai";
//require and configure dotenv for reading .env variables 
import dotenv from 'dotenv';
dotenv.config();

//create a async function to prompt the Gemini API for a recipe 
const generate_recipe = async (ingredients_list, meal_type) => {
  /*
   *Generate recipes using the Gemini API based on provided ingredients and meal type.
   *Args:
        ingredients_list (list[str]): List of available ingredients
        meal_type (str): Type of meal (e.g., 'breakfast', 'lunch', 'dinner')
   *Returns:
        Response object from Gemini API containing recipe data, or an error message if error occurs
   */
  //try, catch block to handle errors when generating a recipe 
  try {
    //initialize the client 
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    //define the prompt 
    const prompt = `
      Imagine you are needing to cook a meal using only the ingredients available to you in your pantry.
      You are a professional chef with years of experience crafting delicious meals.
      You are tasking with creating a meal for a specific meal type ${meal_type}.
      You have the following ingredients available to you: ${ingredients_list.join(', ')}.
      Please create two quality recipes and provide detailed instructions for how to prepare each recipe.
    `;

    //send the prompt to the Gemini API 
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
      config: {
        //configure the response to JSON 
        //and provide the structure of the JSON 
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              recipe_name: { type: Type.STRING },
              meal_type: { type: Type.STRING },
              ingredients: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              instructions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            propertyOrdering: ["recipe_name", "meal_type", "ingredients", "instructions"],
          },
        },
        //Disable Thinking
        thinkingConfig: {
          thinkingBudget: 0,
        },
      },
    })

    //return the response as parsed JSON
    return JSON.parse(response.text);

  } catch (err) {
    //log the error
    console.log(err);
  }
};

//export the generate_recipe function
export default generate_recipe;
