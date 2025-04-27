// app/api/suggested-orders/route.ts

import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { predictSales } from "lib/predictSales";

// Define InventoryItem type
interface InventoryItem {
  item_id: string;
  item_name: string;
  current_stock: number;
  reorder_point: number;
  supplier: string;
  lead_time_days: number;
  unit: string;
}

// Define SalesRecord type
interface SalesRecord {
  date: string;
  item_id: string;
  quantity_sold: number;
}

// Define SuggestedOrder type
interface SuggestedOrder {
  item_id: string;
  item_name: string;
  current_stock: number;
  predicted_sales_next_7_days: number;
  reorder_point: number;
  suggested_order_quantity: number;
  reason: string;
}

const inventoryPath = path.join(process.cwd(), "data", "inventory.json");
const salesHistoryPath = path.join(process.cwd(), "data", "sales_history.json");

export async function GET() {
  const inventory: InventoryItem[] = JSON.parse(
    fs.readFileSync(inventoryPath, "utf8")
  );
  const salesHistory: SalesRecord[] = JSON.parse(
    fs.readFileSync(salesHistoryPath, "utf8")
  );

  const suggestedOrders: SuggestedOrder[] = [];

  for (const item of inventory) {
    const itemSalesHistory = salesHistory
      .filter((sale) => sale.item_id === item.item_id)
      .map((sale) => sale.quantity_sold);

    // Not enough data to predict
    if (itemSalesHistory.length < 5) {
      continue;
    }

    const predictedNext7Days = await predictSales(itemSalesHistory);
    const totalPredictedSales = predictedNext7Days.reduce(
      (sum: number, value: number) => sum + value,
      0
    );

    const expectedStockAfter7Days = item.current_stock - totalPredictedSales;

    if (expectedStockAfter7Days < item.reorder_point) {
      suggestedOrders.push({
        item_id: item.item_id,
        item_name: item.item_name,
        current_stock: item.current_stock,
        predicted_sales_next_7_days: Math.round(totalPredictedSales),
        reorder_point: item.reorder_point,
        suggested_order_quantity: Math.max(
          0,
          Math.round(
            item.reorder_point + totalPredictedSales - item.current_stock
          )
        ),
        reason: "AI prediction shows stock will fall below safe levels.",
      });
    }
  }

  return NextResponse.json(suggestedOrders);
}
