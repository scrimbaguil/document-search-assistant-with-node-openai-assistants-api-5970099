const dayjs = require("dayjs");

async function getWeatherForecast(args) {
  const { city } = args || {};
  if (!city) return "Please specify a city name.";

  const url = `https://explorecalifornia.org/api/weather/city/${encodeURIComponent(
    city
  )}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Weather API request failed: ${response.status}`);
    }

    // Grab the array of city results
    const data = await response.json();
    // Find the first match
    const cityData = data.find(
      c => c.name.toLowerCase() === city.toLowerCase()
    );
    if (!cityData || !cityData.forecast?.length) {
      throw new Error("No valid weather data available.");
    }

    // Build the forecast text for the first 5 days
    let forecastText = `5-Day Forecast for ${cityData.name}:\n`;
    cityData.forecast.slice(0, 5).forEach((day, i) => {
      const dateFormatted = dayjs(day.date, "MM/DD/YYYY").isValid()
        ? dayjs(day.date, "MM/DD/YYYY").format("MMM D, YYYY")
        : "Unknown date";

      const desc = day.condition_desc || "No description";
      const high = day.temp_max?.toFixed(1) ?? "N/A";
      const low = day.temp_min?.toFixed(1) ?? "N/A";

      forecastText += `${dateFormatted}: ${desc}, High: ${high}°, Low: ${low}°\n`;
    });

    return forecastText.trim();
  } catch (err) {
    console.error("Error fetching weather:", err.message);
    return "Sorry, I couldn't fetch the weather at the moment.";
  }
}

module.exports = { getWeatherForecast };
