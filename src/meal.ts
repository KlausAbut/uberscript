import { Meal } from "./types.js";

const API_URL = "https://keligmartin.github.io/api/meals.json";

export async function fetchMeals(): Promise<Meal[]> {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    const meals: Meal[] = await response.json();
    return meals;
  } catch (error) {
    console.error("Erreur lors du chargement de repas", error);
    throw error;
  }
}
