import { getFirestore, collection, query, where, orderBy, getDocs, Timestamp } from "firebase/firestore";
import { db } from "../../Firebase";
import React, { useEffect, useState } from "react";
import { Box } from '@mui/material';

const LastMonth = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [Total, setTotal] = useState(0);
  const [weekRange, setWeekRange] = useState({ from: null, to: null });

useEffect(() => {
  async function loadLastMonthHistory() {
    const today = new Date();

    // Set start to first day of last month
    const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    startOfLastMonth.setHours(0, 0, 0, 0);

    // Set end to last day of last month
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0); // day 0 of this month = last day of previous
    endOfLastMonth.setHours(23, 59, 59, 999);

    // Save range for UI
    setWeekRange({
      from: startOfLastMonth.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }),
      to: endOfLastMonth.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    });

    const q = query(
      collection(db, "historyservices"),
      where("timestamp", ">=", Timestamp.fromDate(startOfLastMonth)),
      where("timestamp", "<=", Timestamp.fromDate(endOfLastMonth)),
      orderBy("timestamp", "desc")
    );

    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    setHistory(data);

    const totalPrice = data.reduce((sum, item) => sum + (item.price || 0), 0);
    setTotal(totalPrice);

    setLoading(false);
  }

  loadLastMonthHistory();
}, []);

  if (loading) return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 200,
    }}>
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
    <div>
      <h2 style={{ color: "#2f6b5f", marginBottom: "0.5rem" }}>
last Month's Records      </h2>
      {weekRange.from && weekRange.to && (
        <p style={{ color: "#4a7c6b", fontWeight: 500, marginBottom: "1.5rem" }}>
          Showing records from <strong>{weekRange.from}</strong> to <strong>{weekRange.to}</strong>
        </p>
      )}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {history.map(item => (
          <li
            key={item.id}
            style={{
              background: "#e4f4f1ff",
              padding: "1rem",
              marginBottom: "1rem",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(166, 123, 91, 0.15)",
              border: "1px solid #639d92ff",
              color: "#2f6b5f",
              lineHeight: "1.5",
              fontSize: "1rem"
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
                rowGap: "0.5rem",
              }}
            >
              <div style={{ flex: "1 1 100%" }}>
                <span style={{ fontWeight: "600" }}>Services: </span>
                <span>{item.services.map(s => s.name).join(", ")}</span>
              </div>
              <div style={{ flex: "1 1 100%" }}>
                <span style={{ fontWeight: "600" }}>Date: </span>
                <span>{item.timestamp?.toDate().toLocaleString()}</span>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
                marginTop: "0.5rem"
              }}
            >
              <div>
                <span style={{ fontWeight: "600" }}>Price: </span>
                <span>{`₹${item.price}`}</span>
              </div>
              <div>
                <span style={{ fontWeight: "600" }}>{item.payment} Payment</span>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <h3 style={{ marginTop: "2rem", color: "#2f6b5f" }}>
        Total Collection: ₹{Total}
      </h3>
      <h4 style={{ marginTop: "1rem" }}>
        <span style={{ fontWeight: 600, color: "#4a7c6b" }}>
          Total payment in cash: ₹
          {history
            .filter(item => item.payment === "Cash")
            .reduce((sum, item) => sum + (item.price || 0), 0)}
        </span>
        <br />
        <span style={{ fontWeight: 600, color: "#4a7c6b" }}>
          Total payment via UPI: ₹
          {history
            .filter(item => item.payment === "UPI")
            .reduce((sum, item) => sum + (item.price || 0), 0)}
        </span>
      </h4>
    </div>
  );
};

export default LastMonth;
