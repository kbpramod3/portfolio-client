"use client";

import { useState } from "react";
import { Stock } from "../types";

interface Props {
  allStocks: Stock[];
  onAdd: (stockId: string, purchasePrice: number, quantity: number) => void;
}

export default function AddStockForm({ allStocks, onAdd }: Props) {
  const [selectedStock, setSelectedStock] = useState("");
  const [price, setPrice] = useState("");
  const [qty, setQty] = useState("");

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!selectedStock || !price || !qty) return;
    onAdd(selectedStock, parseFloat(price), parseInt(qty));
    setPrice("");
    setQty("");
    setSelectedStock("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 flex-wrap pb-10">
      <select
        value={selectedStock}
        onChange={e => setSelectedStock(e.target.value)}
        className="border p-2 rounded"
      >
        <option value="">Select Stock</option>
        {allStocks.map(s => (
          <option key={s.symbol} value={s.symbol}>{s.name} ({s.symbol})</option>
        ))}
      </select>
      <input
        type="number"
        placeholder="Purchase Price"
        value={price}
        onChange={e => setPrice(e.target.value)}
        className="border p-2 rounded"
      />
      <input
        type="number"
        placeholder="Quantity"
        value={qty}
        onChange={e => setQty(e.target.value)}
        className="border p-2 rounded"
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Add</button>
    </form>
  );
}
