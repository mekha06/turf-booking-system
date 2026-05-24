import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axiosInstance";

function Recommendations() {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const recRes = await API.get("/ai/recommendations");
        setRecommendations(recRes.data.recommendations);
      } catch (error) {
        console.log("Failed to load recommendations", error);
      }
    };

    fetchRecommendations();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">
        Recommended Slots for You
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((rec) => (
          <div
            key={rec.slotId}
            className="bg-white rounded-xl shadow-md p-5 border-l-4 border-emerald-600"
          >
            <h2 className="text-xl font-bold">{rec.turfName}</h2>

            <p className="text-gray-600">{rec.location}</p>
            <p>Sport: {rec.sportType}</p>
            <p>Date: {rec.date}</p>
            <p>Time: {rec.time}</p>

            <p className="font-semibold">
              ₹{rec.pricePerHour}/hour
            </p>

            <p className="mt-3 text-sm text-emerald-700">
              {rec.reason}
            </p>

            <Link
              to={`/turfs/${rec.turfId}`}
              className="block mt-4 text-center bg-emerald-600 text-white p-2 rounded-lg"
            >
              View Recommended Slot
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Recommendations;