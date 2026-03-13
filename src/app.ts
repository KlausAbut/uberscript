import { fetchMeals } from "./meal.js";
import { User, TropPauvreErreur } from "./user.js";
import { Meal } from "./types.js";

// Initialisation de l'utilisateur
const user = new User(1, "Bob", 30);

//DOM
const mealListEl = document.getElementById(
  "mealList",
) as HTMLUListElement | null;
const walletEl = document.getElementById("wallet") as HTMLElement | null;
const orderHistoryEl = document.getElementById(
  "orderHistory",
) as HTMLUListElement | null;
const totalSpentEl = document.getElementById(
  "totalSpent",
) as HTMLElement | null;
const errorEl = document.getElementById("error") as HTMLElement | null;
const filterInput = document.getElementById(
  "filterPrice",
) as HTMLInputElement | null;

let allMeals: Meal[] = [];

// Affichage portefeuille
function renderWallet(): void {
  if (!walletEl) return;
  walletEl.textContent = `Solde : ${user.wallet.toFixed(2)}€`;
}

// Affichage dépense
function renderTotalSpent(): void {
  if (!totalSpentEl) return;
  totalSpentEl.textContent = `Total dépensé : ${user.getTotalSpent().toFixed(2)}€`;
}

// Affichage repas
function renderMeals(meals: Meal[]): void {
  if (!mealListEl) return;

  mealListEl.innerHTML = "";

  meals.forEach((meal) => {
    const li = document.createElement("li");
    li.className =
      "list-group-item d-flex justify-content-between align-items-center";
    li.innerHTML = `
      <span>${meal.name} — ${meal.price.toFixed(2)} € (${meal.calories} kcal)</span>
      <button class="btn btn-sm btn-primary">Commander</button>
    `;
    const btn = li.querySelector("button");
    btn?.addEventListener("click", () => handleOrder(meal));
    mealListEl.appendChild(li);
  });
}

// Affichage historique
function renderHistory(): void {
  if (!orderHistoryEl) return;

  orderHistoryEl.innerHTML = "";

  user.orders.forEach((order) => {
    const li = document.createElement("li");
    const mealNames = order.meals.map((m) => m.name).join(", ");

    li.className =
      "list-group-item d-flex justify-content-between align-items-center";
    li.innerHTML = `
        <span>#${order.id} — ${mealNames} — ${order.total.toFixed(2)} €</span>
        <button class="btn btn-sm btn-danger">Supprimer</button>
        `;
    const deleteBtn = li.querySelector("button");
    deleteBtn?.addEventListener("click", () => {
      user.deleteOrder(order.id);
      renderHistory();
      renderWallet();
      renderTotalSpent();
    });

    orderHistoryEl.appendChild(li);
  });
}

// Commande
function handleOrder(meal: Meal): void {
  if (errorEl) errorEl.textContent = "";
  try {
    user.orderMeal(meal);
    renderWallet();
    renderHistory();
    renderTotalSpent();
  } catch (e) {
    if (!errorEl) return;

    if (e instanceof TropPauvreErreur) {
      errorEl.textContent = e.message;
    } else {
      errorEl.textContent = "Une erreur inattendue est survenue.";
    }
  }
}

// Filtre prix
filterInput?.addEventListener("input", () => {
  const maxPrice = parseFloat(filterInput.value);
  if (isNaN(maxPrice)) {
    renderMeals(allMeals);
  } else {
    renderMeals(allMeals.filter((meal) => meal.price <= maxPrice));
  }
});

// Démarrage app
async function init(): Promise<void> {
  renderWallet();
  renderHistory();
  renderTotalSpent();

  try {
    allMeals = await fetchMeals();
    renderMeals(allMeals);
  } catch {
    if (errorEl) {
      errorEl.textContent =
        "Impossible de charger les repas. Veuillez réessayer.";
    }
  }
}

init();
