import React, { useEffect, useState, useRef } from "react";
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
import { db } from "../Firebase";
import WeeklyHistory from "./weeklyHistory";
import Monthlyhistory from "./Monthlyhistory";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const TodayHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("today");
    const [menuOpenId, setMenuOpenId] = useState(null); // for tracking which menu is open
    const [confirmDeleteId, setConfirmDeleteId] = useState(null); // id for confirmation popup
  
  const pdfRef = useRef();

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @media (max-width: 600px) {
        body { font-size: 14px; }
        h2, h3 { font-size: 16px !important; text-align: center; }
        li { padding: 0.75rem !important; }
        li > div { flex-direction: column !important; gap: 8px; }
        li span { font-size: 14px !important; }
        input, button { font-size: 14px !important; }
        .tab-buttons { flex-direction: column; gap: 10px; }
      }
      .pdf-mode {
        background: #fff !important;
        color: #000 !important;
        font-size: 8px !important;
        font-family: sans-serif !important;
        padding: 0 !important;
        margin: 0 !important;
      }
      .pdf-mode * {
        background: none !important;
        color: #000 !important;
        font-size: 8px !important;
        padding: 0 !important;
        margin: 0 !important;
        border: none !important;
        box-shadow: none !important;
      }
      .pdf-mode li {
        display: flex !important;
        justify-content: space-between !important;
        align-items: center !important;
        gap: 5px !important;
        border-bottom: 1px solid #ccc !important;
        list-style: none !important;
        padding: 2px 0 !important;
        font-size: 8px !important;
      }
      .pdf-mode li > div {
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .pdf-mode .tab-buttons,
      .pdf-mode button {
        display: none !important;
      }
      .pdf-mode h2, .pdf-mode h3, .pdf-mode h4 {
        font-size: 10px !important;
        font-weight: bold;
        margin: 6px 0;
        text-align: left;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    async function loadHistory() {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const startOfDay = Timestamp.fromDate(today);

      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      const endOfDay = Timestamp.fromDate(tomorrow);

      const q = query(
        collection(db, "historyservices"),
        where("timestamp", ">=", startOfDay),
        where("timestamp", "<", endOfDay),
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



  const handleDownloadPDF = async () => {
    const input = pdfRef.current;
    input.classList.add("pdf-mode");
    await new Promise((res) => setTimeout(res, 100));

    const canvas = await html2canvas(input, {
      scale: 2,
      backgroundColor: "#ffffff",
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    pdf.save("today-history.pdf");
    input.classList.remove("pdf-mode");
  };

  const formatServiceNames = (services) => {
    const nameCount = {};
    services.forEach((s) => {
      nameCount[s.name] = (nameCount[s.name] || 0) + 1;
    });

    return Object.entries(nameCount)
      .map(([name, count]) => (count > 1 ? `${name} x${count}` : name))
      .join(", ");
  };

  if (loading) {
    return <div style={{ textAlign: "center", padding: "2rem" }}>Loading...</div>;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#bce6ddff",
        padding: "1.5rem",
        borderRadius: "10px",
        boxShadow: "0 3px 12px rgba(102, 73, 49, 0.15)",
        color: "#2f6b5f",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        fontSize: "0.85rem",
      }}
    >
      <h2 style={{ textAlign: "center", fontSize: "1.3rem" }}>Recent Records</h2>

      <div
        className="tab-buttons"
        style={{
          marginBottom: "1.5rem",
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
          justifyContent: "center",
        }}
      >
        {["today", "week", "month"].map((label) => (
          <button
            key={label}
            onClick={() => setTab(label)}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: tab === label ? "#2f6b5f" : "#e7f1ef",
              color: tab === label ? "#baddd6ff" : "#1f5b4fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "0.8rem",
            }}
          >
            {label.charAt(0).toUpperCase() + label.slice(1)} Records
          </button>
        ))}
      </div>

      <div ref={pdfRef}>
        {tab === "today" ? (
          <div>
            <h2 style={{ fontSize: "1.1rem" }}>Today's Records</h2>
            <strong style={{ fontSize: '0.85rem', color: '#2f5b6f', marginTop: '4px' }}>
              {new Date().toLocaleDateString('en-IN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </strong>
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
              </div>
            )}
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
        >
         <div style={{
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
                  </div>
</div>


        </div>
      </div>
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
                    }
                    return sum + (item.price || 0);
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
                    }
                    return sum + Number(item.price || 0);
                  }, 0)}
              </span>
            </h4>
          </div>
        ) : tab === "week" ? (
          <WeeklyHistory />
        ) : (
          <Monthlyhistory />
        )}
      </div>

      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <button
          onClick={handleDownloadPDF}
          style={{
            padding: "0.5rem 1rem",
            background: "#2f6b5f",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "0.85rem",
          }}
        >
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default TodayHistory;
