import { getFirestore, collection, query, where, orderBy, getDocs, Timestamp } from "firebase/firestore";
import {
  Box,
 
} from '@mui/material';
import { db } from "../Firebase";
import React, { useEffect, useState } from "react";
import Monthlyhistory from "./Monthlyhistory";
import { useNavigate } from "react-router-dom";
  const TodayHistory = () => {
    const [authenticated, setAuthenticated] = useState(false);
    const [password, setPassword] = useState("");

    const correctPassword = "jiomklotbs"; 

    const navigate = useNavigate();

    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState("today");
    const [totalCollection,setTotalCollection] = useState(0);

    useEffect(() => {
      if (!authenticated) return;
      async function loadHistory() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const startOfDay = Timestamp.fromDate(today);

        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        const endOfDay = Timestamp.fromDate(tomorrow);

        const q = query(
          collection(db, "services"),
          where("timestamp", ">=", startOfDay),
          where("timestamp", "<", endOfDay),
          orderBy("timestamp", "desc")
        );
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        setHistory(data);
        console.log(data);
        
        setLoading(false);
      }
      loadHistory();
    }, [authenticated]);
  
    if (!authenticated) {
      return (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backdropFilter: "blur(8px)",
            background: "rgba(255,255,255,0.6)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column"
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "2rem",
              borderRadius: "8px",
              boxShadow: "0 2px 16px rgba(0,0,0,0.1)",
              minWidth: "300px"
            }}
          >
            <h3>Enter Password to View History</h3>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
            />
            <button
              onClick={() => {
                if (password === correctPassword) {
                  setAuthenticated(true);
                } else {
                  alert("Incorrect password");
                }
              }}
              style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
            >
              Submit
            </button>
            <button
              onClick={() => navigate("/")}
              style={{ width: "100%", padding: "0.5rem", background: "#eee" }}
            >
              Go Back
            </button>
          </div>
        </div>
      );
    }

    if (loading) return <Box
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
  style={{
    background: "#fffaf3",
    padding: "2rem",
    borderRadius: "10px",
    boxShadow: "0 3px 12px rgba(102, 73, 49, 0.15)",
    color: "#4b2e2e",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  }}
>
  <h2 style={{ color: "#5c4033", marginBottom: "1rem" }}>History</h2>

  <div style={{ marginBottom: "1.5rem" }}>
    <button
      onClick={() => setTab("today")}
      style={{
        padding: "0.6rem 1.2rem",
        marginRight: "1rem",
        backgroundColor: tab === "today" ? "#a67b5b" : "#eee0c9",
        color: tab === "today" ? "#fffaf3" : "#5c4033",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "bold",
        transition: "background-color 0.3s ease"
      }}
    >
      Today's History
    </button>
    <button
      onClick={() => setTab("month")}
      style={{
        padding: "0.6rem 1.2rem",
        backgroundColor: tab === "month" ? "#a67b5b" : "#eee0c9",
        color: tab === "month" ? "#fffaf3" : "#5c4033",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "bold",
        transition: "background-color 0.3s ease"
      }}
    >
      Monthly History
    </button>
  </div>

  {tab === "today" ? (
    <div>
      <h2 style={{ color: "#5c4033", marginBottom: "1rem" }}>
        Today's History
      </h2>
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
    lineHeight: "1.5",
  }}
>
  <div style={{ marginBottom: "0.8rem" }}>
    <span style={{ fontWeight: "600", color: "#7b4f2c" }}>Services: </span>
    <span>{item.services.map(s => s.name).join(", ")}</span>
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
        Total Collection: ₹
        {history.reduce((sum, item) => sum + (item.price || 0), 0)}
      </h3>
    </div>
  ) : (
    <Monthlyhistory />
  )}
</div>

    );
  };

  
  export default TodayHistory


