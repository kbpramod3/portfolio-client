export interface Stock {
  symbol: string;
  name: string;
  sector: string;
}

export interface PortfolioStock {
  id: string;
  user_id: string;
  stock: string;
  ticker: string;
  qty: number;
  price: number;
  created_date?: string;
  updated_date?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
}

export interface Orders {
  id: string;
  ticker: string;
  stock: string;
  qty: number;
  price: number;
  actions: React.ReactNode;
}

export interface PortfolioRow {
  id: number;
  ticker: string;
  stock: string;
  price: number;
  qty: number;
  livePrice: number;
  investment: number;
  presentValue: number;
  gainLoss: number;
  portfolioPercent: number;
  peRatio: number | null;
  eps: number | null;
}

export interface addStock {
  ticker: string;
  price: number;
  qty: number;
}

