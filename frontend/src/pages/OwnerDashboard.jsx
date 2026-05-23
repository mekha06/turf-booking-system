import { useEffect, useState } from "react";
import API from "../api/axiosInstance";

function OwnerDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [turfs, setTurfs] = useState([]);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    sportType: "",
    location: "",
    pricePerHour: "",
    description: "",
    image: "",
  });

  const [slotForm, setSlotForm] = useState({
    turfId: "",
    date: "",
    startHour: "",
    endHour: "",
    slotDuration: "1",
  });

  const [loading, setLoading] = useState(false);

  const fetchOwnerData = async () => {
    try {
      const analyticsRes = await API.get("/bookings/owner/analytics");
      const turfsRes = await API.get("/turfs/my-turfs");

      setAnalytics(analyticsRes.data.analytics);
      setTurfs(turfsRes.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchOwnerData();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSlotChange = (e) => {
    setSlotForm({
      ...slotForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateTurf = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const payload = {
        ...formData,
        pricePerHour: Number(formData.pricePerHour),
        amenities: ["Parking", "Washroom"],
      };

      const res = await API.post("/turfs", payload);

      setMessage(res.data.message);

      setFormData({
        name: "",
        sportType: "",
        location: "",
        pricePerHour: "",
        description: "",
        image: "",
      });

      fetchOwnerData();
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to create turf"
      );
    }
    finally {
  setLoading(false);
    }
  };

  const handleGenerateSlots = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const payload = {
        turfId: slotForm.turfId,
        date: slotForm.date,
        startHour: Number(slotForm.startHour),
        endHour: Number(slotForm.endHour),
        slotDuration: Number(slotForm.slotDuration),
      };

      const res = await API.post("/slots/generate", payload);

      setMessage(res.data.message);

      setSlotForm({
        turfId: "",
        date: "",
        startHour: "",
        endHour: "",
        slotDuration: "1",
      });
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to generate slots"
      );
    }
      finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">
        Owner Dashboard
      </h1>

      {message && (
        <p className="mb-4 text-center font-semibold text-blue-600">
          {message}
        </p>
      )}

      {analytics && (
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold">Total Bookings</h2>
            <p className="text-3xl font-bold">{analytics.totalBookings}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold">Active Bookings</h2>
            <p className="text-3xl font-bold">{analytics.activeBookings}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold">Cancelled Bookings</h2>
            <p className="text-3xl font-bold">{analytics.cancelledBookings}</p>
          </div>
        </div>
      )}

      <form
        onSubmit={handleCreateTurf}
        className="bg-white p-6 rounded-xl shadow mb-8"
      >
        <h2 className="text-2xl font-bold mb-4">
          Create Turf
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Turf Name"
            className="p-3 border rounded-lg"
          />

          <select
            name="sportType"
            value={formData.sportType}
            onChange={handleChange}
            className="p-3 border rounded-lg"
          >
            <option value="">Select Sport</option>
            <option value="Football">Football</option>
            <option value="Cricket">Cricket</option>
            <option value="Badminton">Badminton</option>
            <option value="Tennis">Tennis</option>
          </select>

          <input
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Location"
            className="p-3 border rounded-lg"
          />

          <input
            name="pricePerHour"
            value={formData.pricePerHour}
            onChange={handleChange}
            placeholder="Price Per Hour"
            type="number"
            className="p-3 border rounded-lg"
          />

          <input
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="Image URL"
            className="p-3 border rounded-lg"
          />

          <input
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="p-3 border rounded-lg"
          />
        </div>

        <button
         disabled={loading}
         className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg disabled:bg-gray-400"
>
         {loading ? "Processing..." : "Create Turf"}
         </button>
      </form>

      <form
        onSubmit={handleGenerateSlots}
        className="bg-white p-6 rounded-xl shadow mb-8"
      >
        <h2 className="text-2xl font-bold mb-4">
          Generate Slots
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <select
            name="turfId"
            value={slotForm.turfId}
            onChange={handleSlotChange}
            className="p-3 border rounded-lg"
          >
            <option value="">Select Turf</option>
            {turfs.map((turf) => (
              <option key={turf._id} value={turf._id}>
                {turf.name} - {turf.location}
              </option>
            ))}
          </select>

          <input
            type="date"
            name="date"
            value={slotForm.date}
            onChange={handleSlotChange}
            className="p-3 border rounded-lg"
          />

          <input
            type="number"
            name="startHour"
            value={slotForm.startHour}
            onChange={handleSlotChange}
            placeholder="Start Hour e.g. 6"
            className="p-3 border rounded-lg"
          />

          <input
            type="number"
            name="endHour"
            value={slotForm.endHour}
            onChange={handleSlotChange}
            placeholder="End Hour e.g. 10"
            className="p-3 border rounded-lg"
          />

          <input
            type="number"
            name="slotDuration"
            value={slotForm.slotDuration}
            onChange={handleSlotChange}
            placeholder="Duration"
            className="p-3 border rounded-lg"
          />
        </div>

        <button
        disabled={loading}
        className="mt-4 bg-green-600 text-white px-6 py-3 rounded-lg disabled:bg-gray-400"
>
        {loading ? "Processing..." : "Generate Slots"}
        </button>
      </form>

      <h2 className="text-2xl font-bold mb-4">My Turfs</h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {turfs.map((turf) => (
          <div key={turf._id} className="bg-white p-5 rounded-xl shadow">
            <h3 className="text-xl font-bold">{turf.name}</h3>
            <p>{turf.location}</p>
            <p>{turf.sportType}</p>
            <p className="font-semibold">₹{turf.pricePerHour}/hour</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OwnerDashboard;