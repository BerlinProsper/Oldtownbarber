import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useServiceContext } from "../Context/MyContext";
const PasswordProtectedPage = ({ children }) => {

  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { handleDrawerOpen} = useServiceContext();
  const correctPassword = "jiomklotbs"; // 🔒 Replace with your actual password

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
          flexDirection: "column",
        }}
      >
        <div
          style={{
            background: "#ffffff",
            padding: "2rem",
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            width: "90%",
            maxWidth: "400px",
            textAlign: "center",
          }}
        >
          <h3 style={{ color: "#2f6b5f", marginBottom: "1rem" }}>
            Enter Password to View Content
          </h3>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "0.75rem",
              marginBottom: "1rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "16px",
            }}
          />
          <button
            onClick={() => {
              if (password === correctPassword) {
                setAuthenticated(true);
              } else {
                alert("Incorrect password");
              }
            }}
            style={{
              width: "100%",
              padding: "0.75rem",
              backgroundColor: "#2f6b5f",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontWeight: "bold",
              fontSize: "16px",
              cursor: "pointer",
              marginBottom: "1rem",
            }}
          >
            Submit
          </button>
          <button
            onClick={() => navigate("/")}
            style={{
              width: "100%",
              padding: "0.75rem",
              background: "#e0e0e0",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }


  return <>{handleDrawerOpen()}</>;
};

export default PasswordProtectedPage;
