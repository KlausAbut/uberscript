import { Meal } from "./types.ts";

const API_URL = "https://keligmartin.github.io/api/meals.json";

export async function fetchMeals(): Promise<Meal[]> {
  try {
    const reposne = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${Response.status}`);
    }
    const meals: Meal[] = await Response.json();
    return meals;
  } catch (error) {
    console.error("Erreur lors du chargement de repas", error);
    throw error;
  }
}
