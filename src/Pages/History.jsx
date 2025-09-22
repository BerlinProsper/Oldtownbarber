import React, { useEffect, useState, useRef } from "react";
import {
  collection,
  getDocs,
  orderBy,
  query,
  Timestamp,
  where,
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
  const pdfRef = useRef();

  // Inject responsive and PDF styles
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

  // Fetch today's data
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

  if (loading) {
    return <div style={{ textAlign: "center", padding: "2rem" }}>Loading...</div>;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#bce6ddff",
        padding: "2rem",
        borderRadius: "10px",
        boxShadow: "0 3px 12px rgba(102, 73, 49, 0.15)",
        color: "#2f6b5f",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <h2 style={{ textAlign: "center" }}>Recent Records</h2>

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
        <button
          onClick={() => setTab("today")}
          style={{
            padding: "0.6rem 1.2rem",
            backgroundColor: tab === "today" ? "#2f6b5f" : "#e7f1efff",
            color: tab === "today" ? "#baddd6ff" : "#1f5b4fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Today's Records
        </button>
        <button
          onClick={() => setTab("week")}
          style={{
            padding: "0.6rem 1.2rem",
            backgroundColor: tab === "week" ? "#2f6b5f" : "#e4f8f4ff",
            color: tab === "week" ? "#d3efe9ff" : "#2f6b5f",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Weekly Records
        </button>
        <button
          onClick={() => setTab("month")}
          style={{
            padding: "0.6rem 1.2rem",
            backgroundColor: tab === "month" ? "#2f6b5f" : "#e4f8f4ff",
            color: tab === "month" ? "#d3efe9ff" : "#2f6b5f",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Monthly History
        </button>
      </div>

      <div ref={pdfRef}>
        {tab === "today" ? (
          <div>
            <h2>Today's Records</h2>
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

            <h3 style={{ marginTop: "2rem" }}>
              Total Collection: ₹
              {history.reduce((sum, item) => sum + (item.price || 0), 0)}
            </h3>
            <h4>
              <br />
              <span style={{ fontWeight: 600, color: "#4a7c6b" }}>
                Total payment in cash: ₹
                {history
                  .filter((item) => item.payment === "Cash")
                  .reduce((sum, item) => sum + (item.price || 0), 0)}
              </span>
              <br />
              <span style={{ fontWeight: 600, color: "#4a7c6b" }}>
                Total payment via UPI: ₹
                {history
                  .filter((item) => item.payment === "UPI")
                  .reduce((sum, item) => sum + (item.price || 0), 0)}
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
            padding: "0.6rem 1.2rem",
            background: "#2f6b5f",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default TodayHistory;
