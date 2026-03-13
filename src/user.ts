import { Meal, Order } from "./types.js";

export class TropPauvreErreur extends Error {
  public readonly walletBalance: number;
  public readonly orderTotal: number;

  constructor(message: string, walletBalance: number, orderTotal: number) {
    super(message);
    this.name = "TropPauvreErreur";
    this.walletBalance = walletBalance;
    this.orderTotal = orderTotal;
  }
}

export class User {
  id: number;
  name: string;
  wallet: number;
  orders: Order[];

  constructor(id: number, name: string, wallet: number) {
    this.id = id;
    this.name = name;
    this.wallet = wallet;
    this.orders = this.loadOrders();
  }

  orderMeal(meal: Meal): Order {
    if (this.wallet < meal.price) {
      throw new TropPauvreErreur(
        `Fonds insuffisants. Solde : ${this.wallet.toFixed(2)}€, prix du repas : ${meal.price.toFixed(2)}€.`,
        this.wallet,
        meal.price,
      );
    }
    this.wallet -= meal.price;

    const order: Order = {
      id: Date.now(),
      meals: [meal],
      total: meal.price,
    };

    this.orders.push(order);
    this.saveOrders();

    return order;
  }

  deleteOrder(orderID: number): void {
    const order = this.orders.find((o) => o.id === orderID);

    if (order) {
      this.wallet += order.total;
      this.orders = this.orders.filter((o) => o.id !== orderID);
      this.saveOrders();
    }
  }

  getTotalSpent(): number {
    return this.orders.reduce((sum, order) => sum + order.total, 0);
  }

  private saveOrders(): void {
    localStorage.setItem(`orders_${this.id}`, JSON.stringify(this.orders));
    localStorage.setItem(`wallet_${this.id}`, JSON.stringify(this.wallet));
  }

  private loadOrders(): Order[] {
    const savedOrders = localStorage.getItem(`orders_${this.id}`);
    const savedWallet = localStorage.getItem(`wallet_${this.id}`);
    if (savedWallet !== null) {
      this.wallet = JSON.parse(savedWallet);
    }
    return savedOrders ? JSON.parse(savedOrders) : [];
  }
}
