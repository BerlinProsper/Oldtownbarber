
import { db } from "../Firebase";
import React, { useEffect, useState } from "react";

  const TodayHistory = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      async function loadHistory() {
        const data = {history:[]}
        setHistory(data);
        setLoading(false);
      }
      loadHistory();
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
      <div>
        <h2>Target</h2>
        <ul>
          
        </ul>
      </div>
    );
  };

  export default TodayHistory
