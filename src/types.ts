export type Meal = {
  id: number;
  name: string;
  calories: number;
  price: number;
};

export type Order = {
  id: number;
  meals: Meal[];
  total: number;
  createdAt: string;
};
