// app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import classes from "./orders.module.css";
import Layout from "components/common/Layout";
interface SuggestedOrder {
  item_id: string;
  item_name: string;
  current_stock: number;
  predicted_sales_next_7_days: number;
  reorder_point: number;
  suggested_order_quantity: number;
  reason: string;
}

export default function Orders() {
  const [orders, setOrders] = useState<SuggestedOrder[]>([]);

  useEffect(() => {
    async function fetchOrders() {
      const res = await fetch("/api/suggested-orders");
      console.log({ res });
      const data = await res.json();
      setOrders(data);
    }
    fetchOrders();
  }, []);

  return (
    <Layout>
      <div>
        <h1>Suggested Orders</h1>
        <div className={classes.tableContainer}>
          <div className={classes.header}>
            <span>Item</span>
            <span>Stock</span>
            <span>Predicted Sales (7d)</span>
            <span>Suggested Order</span>
            <span>Stock</span>
            <span>Action</span>
          </div>
          <table className={classes.table}>
            <tbody>
              {orders.map((order) => (
                <tr key={order.item_id}>
                  <td>{order.item_name}</td>
                  <td>{order.current_stock}</td>
                  <td>{Math.round(order.predicted_sales_next_7_days)}</td>
                  <td>{order.suggested_order_quantity}</td>
                  <td>{order.reason}</td>
                  <td>
                    <button>Approve</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
