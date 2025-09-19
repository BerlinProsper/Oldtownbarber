
import { getFirestore, collection, query, where, orderBy, getDocs, Timestamp } from "firebase/firestore";
import { db } from "../Firebase";
import React, { useEffect, useState } from "react";
import {
  Box,

} from '@mui/material';
const MonthlyHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [Total, setTotal] = useState(0);

  useEffect(() => {
    async function loadHistory() {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);

      const q = query(
        collection(db, "services"),
        where("timestamp", ">=", Timestamp.fromDate(startOfMonth)),
        where("timestamp", "<", Timestamp.fromDate(endOfMonth)),
        orderBy("timestamp", "desc")
      );

      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      setHistory(data);
      const totalPrice = data.reduce((sum, item) => sum + (item.price || 0), 0);
      setTotal(totalPrice);

      setLoading(false);
    }
    loadHistory();
  }, []);

  if (loading) return<Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 200,
          }}
        >
          <svg width="48" height="48" viewBox="0 0 50 50">
            <circle
              cx="25"
              cy="25"
              r="20"
              fill="none"
              stroke="#8d6e63"
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

  return (
    <div
     
    >
      <h2 style={{ color: "#5c4033", marginBottom: "1.5rem" }}>Monthly History</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {history.map(item => (
          <li
            key={item.id}
            style={{
              background: "#f9f3e7",
              padding: "1rem",
              marginBottom: "1rem",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(166, 123, 91, 0.15)",
              border: "1px solid #d9c9aa",
              color: "#4b2e2e",
              lineHeight: "1.5"
            }}
          >
            <div style={{ marginBottom: "0.8rem", color: "#7b4f2c", fontWeight: "600" }}>
              Services: <span style={{ fontWeight: "400" }}>{item.services.map(s => s.service).join(", ")}</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <span style={{ fontWeight: "600" }}>Price: </span>
                <span>{`₹${item.price}`}</span>
              </div>
              <div>
                <span style={{ fontWeight: "600" }}>Date: </span>
                <span>{item.timestamp?.toDate().toLocaleString()}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <h3 style={{ marginTop: "2rem", color: "#5c4033" }}>
        Total Collection: ₹{Total}
      </h3>
    </div>
  );
};

export default MonthlyHistory;
