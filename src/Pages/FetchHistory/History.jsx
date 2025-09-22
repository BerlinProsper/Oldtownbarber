import React, { useEffect, useState, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Monthlyhistory from "./Monthlyhistory";
import WeeklyHistory from "./weeklyHistory";

const Records = () => {
  const [tab, setTab] = useState("week");
  const pdfRef = useRef();

  // Inject styles for mobile + PDF export
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @media (max-width: 600px) {
        body {
          font-size: 8px;
        }
        h2, h3 {
          font-size: 13px !important;
          text-align: center;
        }
        li {
          padding: 0.75rem !important;
        }
        li > div {
          flex-direction: column !important;
          gap: 8px;
        }
        li span {
          font-size: 10px !important;
        }
        input, button {
          font-size: 10px !important;
        }
        .tab-buttons {
          flex-direction: column;
          gap: 8px;
        }
      }

      /* PDF export styles */
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

      .pdf-mode h2,
      .pdf-mode h3,
      .pdf-mode h4 {
        font-size: 10px !important;
        font-weight: bold;
        margin: 6px 0;
        text-align: left;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const handleDownloadPDF = async () => {
    const input = pdfRef.current;
    input.classList.add("pdf-mode");
    await new Promise((res) => setTimeout(res, 100)); // Allow styles to apply

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

    pdf.save("records.pdf");
    input.classList.remove("pdf-mode");
  };

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
      <h2 style={{ textAlign: "center" }}>History</h2>

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
          Last Week
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
          Last Month
        </button>
      </div>

      <div ref={pdfRef}>
        {tab === "week" ? <WeeklyHistory /> : <Monthlyhistory />}
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

export default Records;
