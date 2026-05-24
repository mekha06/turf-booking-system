import { useEffect, useState } from "react";
import API from "../api/axiosInstance";
import { Link } from "react-router-dom";

function Home() {
  const [turfs, setTurfs] = useState([]);

  useEffect(() => {
    const fetchTurfs = async () => {
      try {
        const turfRes = await API.get("/turfs");
        setTurfs(turfRes.data.data);
      } catch (error) {
        console.log("Failed to load turfs", error);
      }
    };

    fetchTurfs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">
        Available Turfs
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {turfs.map((turf) => (
          <div
            key={turf._id}
            className="bg-white rounded-xl shadow-md p-5"
          >
            <h2 className="text-xl font-bold">{turf.name}</h2>

            <p className="text-gray-600">{turf.location}</p>

            <p className="mt-2">Sport: {turf.sportType}</p>

            <p className="mt-2 font-semibold">
              ₹{turf.pricePerHour}/hour
            </p>

            <p className="mt-2 text-sm text-gray-500">
              {turf.description}
            </p>

            <Link
              to={`/turfs/${turf._id}`}
              className="block mt-4 text-center bg-blue-600 text-white p-2 rounded-lg"
            >
              View Slots
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;