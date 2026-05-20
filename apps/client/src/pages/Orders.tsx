import { useState, useEffect } from "react";
import { Skeleton, Alert, Badge, Divider } from "@mantine/core";
import { Link } from "react-router-dom";
import { getMyOrders } from "../services/orderService";
import type { Order } from "../services/orderService";

function statusColor(status: string) {
  if (status === "Delivered") return "green";
  if (status === "Cancelled") return "red";
  return "yellow";
}

function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getMyOrders();
        setOrders(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load orders.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div style={{ maxWidth: 720, margin: "2rem auto", padding: "0 1rem" }}>
        <h1>My Orders</h1>
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} height={160} mb="md" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: 720, margin: "2rem auto", padding: "0 1rem" }}>
        <h1>My Orders</h1>
        <Alert color="red" title="Could not load orders">
          {error}
        </Alert>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div style={{ maxWidth: 720, margin: "2rem auto", padding: "0 1rem" }}>
        <h1>My Orders</h1>
        <Alert color="blue" title="No orders yet">
          You haven't placed any orders yet.{" "}
          <Link to="/books">Browse Books</Link>
        </Alert>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 720, margin: "2rem auto", padding: "0 1rem" }}>
      <h1>My Orders</h1>

      {orders.map((order) => (
        <div
          key={order._id}
          style={{
            border: "1px solid #e0e0e0",
            borderRadius: 8,
            padding: "1rem",
            marginBottom: "1rem",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontWeight: 600 }}>#{order._id.slice(-8)}</span>
            <span style={{ color: "#888", fontSize: 14 }}>
              {new Date(order.createdAt).toLocaleDateString()}
            </span>
          </div>

          <div style={{ margin: "0.5rem 0" }}>
            <Badge color={statusColor(order.status)}>{order.status}</Badge>
          </div>

          <Divider my="sm" />

          {order.orderItems.map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 14,
                marginBottom: 4,
              }}
            >
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}

          <Divider my="sm" />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontWeight: 600,
            }}
          >
            <span>Total</span>
            <span>${order.totalPrice.toFixed(2)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Orders;
