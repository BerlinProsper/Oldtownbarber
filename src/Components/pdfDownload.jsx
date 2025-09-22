import React, { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const DownloadPDF = () => {
  const pdfRef = useRef();

  const handleDownload = async () => {
    const input = pdfRef.current;

    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("history.pdf");
  };

  return (
    <div style={{ padding: "2rem" }}>
      {/* Content you want to export */}
      <div ref={pdfRef} style={{ backgroundColor: "#fff", padding: "1rem" }}>
        <h1>Weekly History</h1>
        <p>This is your weekly service data...</p>
        {/* Add your full screen content here */}
      </div>

      <button
        onClick={handleDownload}
        style={{
          marginTop: "1rem",
          padding: "0.5rem 1rem",
          backgroundColor: "#2f6b5f",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Download as PDF
      </button>
    </div>
  );
};

export default DownloadPDF;
