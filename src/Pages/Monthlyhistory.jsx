import {
  collection,
  getDocs,
  orderBy,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { db } from "../Firebase";
import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";

const MonthlyHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      let startDate;
      if (today.getDate() === 1) {
        startDate = today;
      } else {
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      }

      const q = query(
        collection(db, "historyservices"),
        where("timestamp", ">=", Timestamp.fromDate(startDate)),
        where("timestamp", "<", Timestamp.fromDate(new Date(today.getTime() + 24 * 60 * 60 * 1000))),
        orderBy("timestamp", "desc")
      );

      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setHistory(data);
      setLoading(false);
    }

    loadHistory();
  }, []);

  const today = new Date();
  const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  firstOfMonth.setHours(0, 0, 0, 0);
  const options = { year: "numeric", month: "long", day: "numeric" };

  const formatServiceNames = (services) => {
    const nameCount = {};
    services.forEach((s) => {
      nameCount[s.name] = (nameCount[s.name] || 0) + 1;
    });

    return Object.entries(nameCount)
      .map(([name, count]) => (count > 1 ? `${name} ×${count}` : name))
      .join(", ");
  };

  if (loading)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 200,
        }}
      >
        <svg width="48" height="48" viewBox="0 0 50 50">
          <circle
            cx="25"
            cy="25"
            r="20"
            fill="none"
            stroke="#6dada0ff"
            strokeWidth="5"
            strokeDasharray="31.415, 31.415"
            transform="rotate(72.0001 25 25)"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 25 25"
              to="360 25 25"
              dur="1s"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
      </Box>
    );

  return (
    <div style={{ fontSize: "0.85rem", color: "#2f6b5f" }}>
      <h2 style={{ marginBottom: "1rem", fontSize: "1.2rem" }}>Monthly Records</h2>
      <p
        style={{
          color: "#4a7c6b",
          fontWeight: 500,
          marginBottom: "1.5rem",
        }}
      >
        Records from start of this month:{" "}
        <strong>{firstOfMonth.toLocaleDateString(undefined, options)}</strong>
      </p>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {history.map((item) => (
          <li
            key={item.id}
            style={{
              background: "#e4f4f1",
              padding: "0.75rem",
              marginBottom: "0.75rem",
              borderRadius: "8px",
              boxShadow: "0 2px 6px rgba(166, 123, 91, 0.1)",
              border: "1px solid #639d92ff",
              fontSize: "0.85rem",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <div>
                <strong>Services: </strong>
                {formatServiceNames(item.services || [])}
              </div>
              <div>
                <strong>Date: </strong>
                {item.timestamp?.toDate().toLocaleString()}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>
                  <strong>Price: </strong>₹{item.price}
                </span>
                <span>
                  <strong>Payment: </strong>
                  {item.payment === "CashUPI" && item.cash_plus_upi ? (
                    <>
                      ₹{item.cash_plus_upi} UPI + ₹
                      {item.price - item.cash_plus_upi} Cash
                    </>
                  ) : (
                    item.payment
                  )}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <h3 style={{ marginTop: "2rem", fontSize: "1rem" }}>
        Total Collection: ₹
        {history.reduce((sum, item) => sum + (item.price || 0), 0)}
      </h3>

      <h4 style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>
        <span style={{ fontWeight: 600, color: "#4a7c6b" }}>
          Total payment in cash: ₹
          {history
            .filter((item) => item.payment === "Cash" || item.payment === "CashUPI")
            .reduce((sum, item) => {
              if (item.payment === "CashUPI") {
                return sum + ((item.price || 0) - (item.cash_plus_upi || 0));
              } else {
                return sum + (item.price || 0);
              }
            }, 0)}
        </span>
        <br />
        <span style={{ fontWeight: 600, color: "#4a7c6b" }}>
          Total payment via UPI: ₹
          {history
            .filter((item) => item.payment === "UPI" || item.payment === "CashUPI")
            .reduce((sum, item) => {
              if (item.payment === "CashUPI") {
                return sum + Number(item.cash_plus_upi || 0);
              } else {
                return sum + Number(item.price || 0);
              }
            }, 0)}
        </span>
      </h4>
    </div>
  );
};

export default MonthlyHistory;
