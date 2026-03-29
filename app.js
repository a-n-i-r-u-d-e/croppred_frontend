// app.js
document.addEventListener("DOMContentLoaded", () => {
  const API_BASE = "http://127.0.0.1:5000"; // Flask backend
  const autoBtn = document.getElementById("auto-btn");
  const autoResult = document.getElementById("auto-result");
  const manualForm = document.getElementById("manual-form");
  const manualResult = document.getElementById("manual-result");

  // ---------- Auto Detect ----------
  async function autoDetect() {
    autoResult.innerHTML = "<p>🔄 Fetching data...</p>";

    try {
      const res = await fetch(`${API_BASE}/predict/auto`);
      if (!res.ok) throw new Error("Backend error: " + res.status);
      const data = await res.json();

      autoResult.innerHTML = `
        📍 Location: ${data.city} <br>
        🌡 Temp: ${data.temperature}°C | 💧 Humidity: ${data.humidity}% | 🌧 Rainfall: ${data.rainfall}mm <br>
        🌱 Soil (N:${data.N}, P:${data.P}, K:${data.K}, pH:${data.ph}) <br><br>
        ✅ Recommended Crops: <b>${data.crops.join(", ")}</b>
      `;
    } catch (err) {
      autoResult.innerHTML = `<p style="color:red;">❌ Error: ${err.message}</p>`;
    }
  }

  autoBtn.addEventListener("click", autoDetect);

  // ---------- Manual Entry ----------
  manualForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    manualResult.innerHTML = "<p>🔄 Predicting crops...</p>";

    const N = parseFloat(document.getElementById("N").value);
    const P = parseFloat(document.getElementById("P").value);
    const K = parseFloat(document.getElementById("K").value);
    const ph = parseFloat(document.getElementById("ph").value);

    try {
      const res = await fetch(`${API_BASE}/predict/manual`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ N, P, K, ph }),
      });

      if (!res.ok) throw new Error("Backend error: " + res.status);
      const data = await res.json();

      manualResult.innerHTML = `
        📍 Location: ${data.city} <br>
        🌡 Temp: ${data.temperature}°C | 💧 Humidity: ${data.humidity}% | 🌧 Rainfall: ${data.rainfall}mm <br>
        🌱 Soil (N:${data.N}, P:${data.P}, K:${data.K}, pH:${data.ph}) <br><br>
        ✅ Recommended Crops: <b>${data.crops.join(", ")}</b>
      `;
    } catch (err) {
      manualResult.innerHTML = `<p style="color:red;">❌ Error: ${err.message}</p>`;
    }
  });
});
