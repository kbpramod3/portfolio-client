"use client"

import { useEffect, useState, useMemo, use } from "react";
import api from "@/lib/api";
import AddStockForm from "@/components/addStock";
import { PortfolioStock } from "@/types";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Table from "@/components/table";
import { Column } from "react-table";
import { Orders, Stock } from "@/types";

export default function ManageStocksPage() {
  const [portfolio, setPortfolio] = useState<PortfolioStock[]>([]);
  const [allStocks, setAllStocks] = useState<Stock[]>([]);

  useEffect(() => {
    api.portfolio.getAll().then(res => setPortfolio(res.data));
    fetch("/stocklist.json")
    .then(res => res.json())
    .then(data => setAllStocks(data))
    .catch(err => console.error("Error loading stocklist.json:", err));
  }, []);

  const handleAddStock = async (ticker: string, price: number, qty: number) => {
    const stock = allStocks.find(s => s.symbol === ticker);
    if (!stock) return;

    const newStock = {
      stock: stock.name,
      ticker: stock.symbol,
      qty,
      price
    };

    const res = await api.portfolio.add(newStock);
    setPortfolio([...portfolio, res.data.stock]);
  };


  const handleDeleteStock = async (id: string) => {
    await api.portfolio.delete(id);
    setPortfolio(prev => prev.filter(p => String(p.id) !== String(id)));
  };

  const columns: Column<Orders>[] = useMemo(() => [
    { Header: "Symbol", accessor: "ticker" },
    { Header: "Name", accessor: "stock" },
    { Header: "Qty", accessor: "qty" },
    { Header: "Price", accessor: (row) => Number(row.price).toFixed(2) },
    { Header: "Actions", accessor: "actions", Cell: ({ row }) => (
        <button
          onClick={() => handleDeleteStock(row.original.id)}
          className="text-red-500"
        >
          Delete
        </button>
      ) 
    }
  ], []);

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-start min-h-screen pb-5 gap-16">
      <Header />
      <main className="flex-1 p-6 w-full gap-6">
      <h1 className="text-2xl font-bold mb-4">Manage Stocks</h1>

      <AddStockForm allStocks={allStocks} onAdd={handleAddStock} />

      <Table columns={columns} data={portfolio.map(p => ({...p, actions: null}))} />
      </main>
      <Footer />
    </div>
  );
}
