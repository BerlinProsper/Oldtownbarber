import {
  collection,
  getDocs,
  orderBy,
  query,
  Timestamp,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../Firebase";
import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";

const LastWeek = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [weekRange, setWeekRange] = useState({ from: null, to: null });
 const [menuOpenId, setMenuOpenId] = useState(null); // for tracking which menu is open
  const [confirmDeleteId, setConfirmDeleteId] = useState(null); // id for confirmation popup

  useEffect(() => {
    async function loadLastWeekHistory() {
      const today = new Date();
      const dayOfWeek = today.getDay(); // 0 (Sun) to 6 (Sat)

      const lastWeekSunday = new Date(today);
      lastWeekSunday.setDate(today.getDate() - dayOfWeek - 7);
      lastWeekSunday.setHours(0, 0, 0, 0);

      const lastWeekSaturday = new Date(lastWeekSunday);
      lastWeekSaturday.setDate(lastWeekSunday.getDate() + 6);
      lastWeekSaturday.setHours(23, 59, 59, 999);

      setWeekRange({
        from: lastWeekSunday.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        to: lastWeekSaturday.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
      });

      const q = query(
        collection(db, "historyservices"),
        where("timestamp", ">=", Timestamp.fromDate(lastWeekSunday)),
        where("timestamp", "<=", Timestamp.fromDate(lastWeekSaturday)),
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

    loadLastWeekHistory();
  }, []);

  const formatServiceNames = (services) => {
    const nameCount = {};
    services.forEach((s) => {
      nameCount[s.name] = (nameCount[s.name] || 0) + 1;
    });

    return Object.entries(nameCount)
      .map(([name, count]) => (count > 1 ? `${name} ×${count}` : name))
      .join(", ");
  };

  const getTotal = () =>
    history.reduce((sum, item) => sum + (item.price || 0), 0);

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
const handleDelete = async (customId) => {
  if (!customId) {
    alert("Error: No valid ID!");
    return;
  }

  try {
    const q = query(collection(db, "historyservices"), where("id", "==", customId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      alert("No document found with this ID");
      return;
    }

    // Delete all matching documents (usually should be one)
    const deletePromises = querySnapshot.docs.map((docSnap) =>
      deleteDoc(doc(db, "historyservices", docSnap.id))
    );
    await Promise.all(deletePromises);

    // Update local state
    setHistory((prev) => prev.filter((item) => item.id !== customId));
    setConfirmDeleteId(null);
    setMenuOpenId(null);
  } catch (error) {
    alert("Error deleting document: " + error.message);
  }
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
      <h2 style={{ marginBottom: "1rem", fontSize: "1.2rem" }}>
        Last Week's Records
      </h2>

      {weekRange.from && weekRange.to && (
        <p
          style={{
            color: "#4a7c6b",
            fontWeight: 500,
            marginBottom: "1.5rem",
          }}
        >
          Showing records from <strong>{weekRange.from}</strong> to{" "}
          <strong>{weekRange.to}</strong>
        </p>
      )}

      <ul style={{ listStyle: "none", padding: 0 }}>
  {history.map((item) => (
   <li
            key={item.id}
            style={{
              position: "relative",
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
            {/* Three dots menu button */}
            <div
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "1.4rem",
                userSelect: "none",
                padding: "0 5px",
                borderRadius: "4px",
                color: "#4a7c6b",
              }}
              onClick={() =>
                setMenuOpenId(menuOpenId === item.id ? null : item.id)
              }
            >
              &#8942;
            </div>

            {/* Menu */}
            {menuOpenId === item.id && (
              <div
                style={{
                  position: "absolute",
                  top: 35,
                  right: 10,
                  background: "white",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
                  zIndex: 100,
                  cursor: "pointer",
                  width: 80,
                  textAlign: "center",
                  color: "#2f6b5f",
                  fontWeight: "600",
                }}
                onClick={() => setConfirmDeleteId(item.id)}
              >
                Delete
              </div>)}
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


     <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                    }}
                  >
                    <span>
                      <strong style={{ color: "#999", textDecoration: "line-through" }}>
                        ₹{item.originalPrice ?? item.orginalPrice}
                      </strong>
                      &nbsp;→&nbsp;
                      <strong style={{ color: "#2e7d32" }}>₹{item.price}</strong>
                    </span>
                    <span style={{ color: "#2e7d32" }}>
                      Discount: ₹{item.discount === "" ? 0 : item.discount}
                    </span>
                  </div>

                  {/* Row 2: Tip + Payment */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                    }}
                  >
                    <span>Tip: ₹{item.tip === "" ? 0 : item.tip}</span>
                    <span>
                      {item.payment === "CashUPI" && item.cash_plus_upi ? (
                        <>
                          ₹{item.cash_plus_upi} UPI + ₹
                          {item.price - item.cash_plus_upi} Cash
                        </>
                      ) : (
                        item.payment
                      )}
                    </span>
                    </div>      </div>
    </li>
  ))}
</ul>
     {confirmDeleteId && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 200,
          }}
          onClick={() => setConfirmDeleteId(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "white",
              padding: "1.5rem",
              borderRadius: "10px",
              maxWidth: 320,
              width: "90%",
              boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
              color: "#2f6b5f",
            }}
          >
            <h3>Do you want to delete this order?</h3>
            <p>
              <strong>Services: </strong>
              {formatServiceNames(
                history.find((item) => item.id === confirmDeleteId)?.services || []
              )}
            </p>
            <p>
              <strong>Price: </strong>
              ₹{history.find((item) => item.id === confirmDeleteId)?.price}
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
              <button
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  background: "white",
                  cursor: "pointer",
                }}
onClick={() => setConfirmDeleteId(null)}
              >
                No
              </button>
            <button
  style={{
    padding: "0.5rem 1rem",
    borderRadius: "6px",
    border: "none",
    background: "#2e7d32",
    color: "white",
    cursor: "pointer",
  }}
  onClick={() => handleDelete(confirmDeleteId)}
 // Fix here
>
  Yes
</button>

            </div>
          </div>
        </div>
      )}

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
    </div>
  );
};

export default LastWeek;
