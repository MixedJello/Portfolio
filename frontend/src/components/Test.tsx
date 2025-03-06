import { useEffect, useState } from "react";

export default function Test() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:8080/health");
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const data = await res.json();
        setMessage(data.message);
      } catch (err) {
        console.error("Error fetching data:", err)
        setError("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
    <h1>Next.js + Go Full-Stack App</h1>
    {loading ? <p>Loading...</p> : error ? <p>{error}</p> : <p>Backend Response: {message}</p>}
  </div>
  );
}

