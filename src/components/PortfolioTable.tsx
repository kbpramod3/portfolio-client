"use client";

import { useMemo, useState, useEffect } from "react";
import { Column } from "react-table";
import stockList from "../../public/stocklist.json";
import Table from "./table";
import api from "@/lib/api";
import { PortfolioRow } from "@/types";

function SectorTable({
  sector,
  rows,
  summary,
  columns,
}: {
  sector: string;
  rows: PortfolioRow[];
  summary: { investment: number; presentValue: number; gainLoss: number };
  columns: Column<PortfolioRow>[];
}) {
  return (
    <div className="border rounded-lg shadow-md p-4 mb-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold">{sector}</h2>
        <div className="text-sm space-x-6">
          <span>Investment: {summary.investment.toFixed(2)}</span>
          <span>Present Value: {summary.presentValue.toFixed(2)}</span>
          <span
            className={summary.gainLoss >= 0 ? "text-green-600" : "text-red-600"}
          >
            {summary.gainLoss >= 0 ? "▲" : "▼"} Gain/Loss:{" "}
            {summary.gainLoss.toFixed(2)}
          </span>
        </div>
      </div>
      {rows.length > 0 && (
      <Table columns={columns || []} data={rows || []} />
      )}
    </div>
  );
}

export default function PortfolioTable() {
  const [data, setData] = useState<PortfolioRow[]>([]);
  const [message, setMessage] = useState("Loading portfolio...");

  useEffect(() => {
    const cached = localStorage.getItem("stocks-cache");
    if (cached) {
      const cachedData = JSON.parse(cached);
      setData(cachedData.data);
    }

    const fetchData = async () => {
      try {
        const json = await api.stocks.getAll().then(res => res.data);
        const stocks = Array.isArray(json) ? json : json.data || [];
        const timestamp = new Date().toLocaleTimeString();
        setData(stocks);
        localStorage.setItem("stocks-cache", JSON.stringify({ data: stocks, timestamp }));
        setMessage(`Live data as of ${new Date().toLocaleTimeString()}`);
      } catch (err) {
        console.error("❌ Failed to fetch stocks:", err);
        if (cached) {
          const cachedData = JSON.parse(cached);
          setMessage(`Showing cached data (live fetch failed) as of ${cachedData.timestamp}`);
          setData(cachedData.data);
        } else {
        setData([]);
        }
      }
    };
    fetchData();

    const isMarketHours = () => {
      const now = new Date();
      const day = now.getDay();
      const h = now.getHours();
      const m = now.getMinutes();

      const afterStart = h > 9 || (h === 9 && m >= 14);
      const beforeClose = h < 15 || (h === 15 && m <= 31);
      const isWeekday = day >= 1 && day <= 5;

      return isWeekday && afterStart && beforeClose;
    };

    const run = () => {
      if (isMarketHours()) {
        fetchData();
      } else {
        if (cached) {
          const cachedData = JSON.parse(cached);
          setData(cachedData.data);
          setMessage(`Outside market hours - Showing cached data as of ${cachedData.timestamp}`);
        }
      }
    };

    run();

    const interval = setInterval(run, 15000);
    return () => clearInterval(interval);
  }, []);

  const columns: Column<PortfolioRow>[] = useMemo(
    () => [
      { Header: "Stock", accessor: "stock" },
      { Header: "Ticker", accessor: "ticker" },
      { Header: "Purchase Price", accessor: "price" },
      { Header: "Qty", accessor: "qty" },
      { Header: "Investment", accessor: "investment" },
      { Header: "Live Price", accessor: "livePrice" },
      {
        Header: "Present Value",
        accessor: "presentValue",
        Cell: ({ value }) => value.toFixed(2),
      },
      {
        Header: "Gain/Loss",
        accessor: "gainLoss",
        Cell: ({ value }) => (
          <span className={value >= 0 ? "text-green-600" : "text-red-600"}>
            {value >= 0 ? "▲" : "▼"}
            {value.toFixed(2)}
          </span>
        ),
      },
      { Header: "Portfolio %", accessor: "portfolioPercent" },
      { Header: "P/E Ratio", accessor: "peRatio" },
      { Header: "EPS", accessor: "eps" },
    ],
    []
  );

  const groupedData = useMemo(() => {
    const sectorMap: Record<
      string,
      { rows: PortfolioRow[]; summary: { investment: number; presentValue: number; gainLoss: number } }
    > = {};

    if (!Array.isArray(data)) return sectorMap;

    sectorMap["Total"] = {
      rows: [],
          summary: { investment: 0, presentValue: 0, gainLoss: 0 },
        };

    data.forEach((row) => {
      const stockMeta = stockList.find((s) => s.symbol === row.ticker);
      const sector = stockMeta?.sector || "Unknown";

      if (!sectorMap[sector]) {
        sectorMap[sector] = {
          rows: [],
          summary: { investment: 0, presentValue: 0, gainLoss: 0 },
        };
      }

      sectorMap[sector].rows.push(row);
      sectorMap[sector].summary.investment += row.investment;
      sectorMap[sector].summary.presentValue += row.presentValue;
      sectorMap[sector].summary.gainLoss += row.gainLoss;
      sectorMap["Total"].summary.investment += row.investment;
      sectorMap["Total"].summary.presentValue += row.presentValue;
      sectorMap["Total"].summary.gainLoss += row.gainLoss;
    });

    return sectorMap;
  }, [data]);

  return (
    <div className="space-y-8">
      <p className="text-sm text-gray-600 mb-2">{message}</p>
      {Object.entries(groupedData).map(([sector, { rows, summary }]) => (
        <SectorTable
          key={sector}
          sector={sector}
          rows={rows}
          summary={summary}
          columns={columns}
        />
      ))}
    </div>
  );
};
