import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../Firebase";
import React, { useState } from "react";
import { Box } from "@mui/material";

const ByDate = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleDateChange = async (e) => {
    const pickedDate = e.target.value;
    setSelectedDate(pickedDate);
    setLoading(true);
    setHistory([]);

    const date = new Date(pickedDate);
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));

    const q = query(
      collection(db, "historyservices"),
      where("timestamp", ">=", Timestamp.fromDate(startOfDay)),
      where("timestamp", "<=", Timestamp.fromDate(endOfDay)),
      orderBy("timestamp", "desc")
    );

    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setHistory(data);
    setLoading(false);
  };

  const formatServiceNames = (services) => {
    const nameCount = {};
    services.forEach((s) => {
      nameCount[s.name] = (nameCount[s.name] || 0) + 1;
    });

    return Object.entries(nameCount)
      .map(([name, count]) => (count > 1 ? `${name} ×${count}` : name))
      .join(", ");
  };

  const getCashTotal = () =>
    history
      .filter((item) => item.payment === "Cash" || item.payment === "CashUPI")
      .reduce((sum, item) => {
        if (item.payment === "CashUPI") {
          return sum + ((item.price || 0) - (item.cash_plus_upi || 0));
        }
        return sum + (item.price || 0);
      }, 0);

  const getUpiTotal = () =>
    history
      .filter((item) => item.payment === "UPI" || item.payment === "CashUPI")
      .reduce((sum, item) => {
        if (item.payment === "CashUPI") {
          return sum + Number(item.cash_plus_upi || 0);
        }
        return sum + Number(item.price || 0);
      }, 0);

  const getTotal = () =>
    history.reduce((sum, item) => sum + (item.price || 0), 0);

  return (
    <div style={{ fontSize: "0.85rem", color: "#2f6b5f" }}>
      <h2 style={{ marginBottom: "1rem", fontSize: "1.2rem" }}>Records by Date</h2>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
        }}
      >
        <label
          htmlFor="date-picker"
          style={{
            fontSize: "0.9rem",
            fontWeight: "300",
            color: "#2f6b5f",
          }}
        >
          Pick a Date:
        </label>

        <input
          id="date-picker"
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          style={{
            padding: "0.6rem 1rem",
            fontSize: "1rem",
            border: "1px solid #639d92ff",
            borderRadius: "6px",
            backgroundColor: "#ffffff",
            color: "#2f6b5f",
            outline: "none",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.05)",
            transition: "all 0.2s ease-in-out",
            cursor: "pointer",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#2f6b5f")}
          onBlur={(e) => (e.target.style.borderColor = "#639d92ff")}
        />
      </div>

      {loading && (
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
      )}

      {!loading && selectedDate && (
        <>
          <p
            style={{
              color: "#4a7c6b",
              fontWeight: 500,
              marginBottom: "1.5rem",
            }}
          >
            Showing records for{" "}
            <strong>
              {new Date(selectedDate).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </strong>
          </p>

         <ul style={{ listStyle: "none", padding: 0 }}>
  {history.map((item) => (
    <li
      key={item.id}
      style={{
        background: "#ffffff",
        padding: "1rem",
        marginBottom: "1rem",
        borderRadius: "10px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
        border: "1px solid #e0e0e0",
        fontSize: "0.9rem",
        lineHeight: "1.4",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {/* Service Name */}
        <div>
          <strong style={{ color: "#333" }}>Services:</strong>{" "}
          <span style={{ color: "#555" }}>
            {formatServiceNames(item.services || [])}
          </span>
        </div>

        {/* Date */}
        <div>
          <strong style={{ color: "#333" }}>Date:</strong>{" "}
          <span style={{ color: "#555" }}>
            {item.timestamp?.toDate().toLocaleString()}
          </span>
        </div>

        {/* Price Details */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            rowGap: "6px",
            columnGap: "10px",
            padding: "0.5rem",
            backgroundColor: "#f9f9f9",
            borderRadius: "6px",
          }}
        ><div style={{
  width: '100%',
  border: '1px solid #e0e0e0',
  borderRadius: '6px',
  padding: '6px 10px',
  fontSize: '12.5px',
  fontFamily: 'system-ui, sans-serif',
  backgroundColor: '#fcfcfc',
  color: '#333',
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
}}>
  {/* Row 1: Prices + Discount */}
  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
    <span>
      <strong style={{ color: '#999', textDecoration: 'line-through' }}>
        ₹{item.originalPrice ?? item.orginalPrice}
      </strong>
      &nbsp;→&nbsp;
      <strong style={{ color: '#2e7d32' }}>
        ₹{item.price}
      </strong>
    </span>
    <span style={{ color: '#d32f2f' }}>
      -₹{item.discount === "" ? 0 : item.discount}
    </span>
  </div>

  {/* Row 2: Tip + Payment */}
  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
    <span>Tip: ₹{item.tip === "" ? 0 : item.tip}</span>
    <span>
      {item.payment === "CashUPI" && item.cash_plus_upi ? (
        <>₹{item.cash_plus_upi} UPI + ₹{item.price - item.cash_plus_upi} Cash</>
      ) : (
        item.payment
      )}
    </span>
  </div>
</div>

        </div>
      </div>
    </li>
  ))}
</ul>


          <h3 style={{ marginTop: "2rem", fontSize: "1rem" }}>
            Total Collection: ₹{getTotal()}
          </h3>

          <h4 style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>
            <span style={{ fontWeight: 600, color: "#4a7c6b" }}>
              Total payment in cash: ₹{getCashTotal()}
            </span>
            <br />
            <span style={{ fontWeight: 600, color: "#4a7c6b" }}>
              Total payment via UPI: ₹{getUpiTotal()}
            </span>
          </h4>
        </>
      )}
    </div>
  );
};

export default ByDate;
