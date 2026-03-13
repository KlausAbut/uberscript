import { fetchMeals } from "./meal.ts";
import { User, TropPauvreErreur } from "./user.ts";
import { Meal } from "./types.ts";

// --- Initialisation de l'utilisateur ---
const user = new User(1, "Bob", 30);

// --- Sélection des éléments DOM ---
const mealListEl = document.getElementById("mealList") as HTMLUListElement;
const walletEl = document.getElementById("wallet") as HTMLElement;
const orderHistoryEl = document.getElementById(
  "orderHistory",
) as HTMLUListElement;
const totalSpentEl = document.getElementById("totalSpent") as HTMLElement;
const errorEl = document.getElementById("error") as HTMLElement;
const filterInput = document.getElementById("filterPrice") as HTMLInputElement;

let allMeals: Meal[] = [];

// --- Affichage du portefeuille ---
function renderWallet(): void {
  walletEl.textContent = `Solde : ${user.wallet.toFixed(2)}€`;
}

// --- Affichage du total dépensé ---
function renderTotalSpent(): void {
  totalSpentEl.textContent = `Total dépensé : ${user.getTotalSpent().toFixed(2)}€`;
}

// --- Affichage des repas ---
function renderMeals(meals: Meal[]): void {
  mealListEl.innerHTML = "";
  meals.forEach((meal) => {
    const li = document.createElement("li");
    li.className = "meal-item";
    li.innerHTML = `
      <span>${meal.name} — ${meal.price}€ (${meal.calories} kcal)</span>
      <button data-id="${meal.id}">Commander</button>
    `;
    const btn = li.querySelector("button")!;
    btn.addEventListener("click", () => handleOrder(meal));
    mealListEl.appendChild(li);
  });
}

// --- Affichage de l'historique ---
function renderHistory(): void {
  orderHistoryEl.innerHTML = "";
  user.orders.forEach((order) => {
    const li = document.createElement("li");
    const mealNames = order.meals.map((m) => m.name).join(", ");
    li.innerHTML = `
      <span>#${order.id} — ${mealNames} — ${order.total}€</span>
      <button class="delete-btn" data-order-id="${order.id}">Supprimer</button>
    `;
    const deleteBtn = li.querySelector(".delete-btn")!;
    deleteBtn.addEventListener("click", () => {
      user.deleteOrder(order.id);
      renderHistory();
      renderWallet();
      renderTotalSpent();
    });
    orderHistoryEl.appendChild(li);
  });
}

// --- Gestion d'une commande ---
function handleOrder(meal: Meal): void {
  errorEl.textContent = "";
  try {
    user.orderMeal(meal);
    renderWallet();
    renderHistory();
    renderTotalSpent();
  } catch (e) {
    if (e instanceof TropPauvreErreur) {
      errorEl.textContent = e.message;
    } else {
      errorEl.textContent = "Une erreur inattendue est survenue.";
    }
  }
}

// --- Filtrage par prix ---
filterInput?.addEventListener("input", () => {
  const maxPrice = parseFloat(filterInput.value);
  if (isNaN(maxPrice)) {
    renderMeals(allMeals);
  } else {
    renderMeals(allMeals.filter((m) => m.price <= maxPrice));
  }
});

// --- Démarrage de l'application ---
async function init(): Promise<void> {
  renderWallet();
  renderHistory();
  renderTotalSpent();

  try {
    allMeals = await fetchMeals();
    renderMeals(allMeals);
  } catch {
    errorEl.textContent =
      "Impossible de charger les repas. Veuillez réessayer.";
  }
}

init();
