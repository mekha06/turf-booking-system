import { useEffect, useState } from "react";
import API from "../api/axiosInstance";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState("");

  const fetchBookings = async () => {
    try {
      const res = await API.get("/bookings/my");
      setBookings(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    try {
      const res = await API.put(`/bookings/${bookingId}/cancel`);

      setMessage(res.data.message);
      fetchBookings();
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Cancellation failed"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">
        My Bookings
      </h1>

      {message && (
        <p className="mb-4 text-center font-semibold text-green-600">
          {message}
        </p>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookings.map((booking) => (
          <div
            key={booking._id}
            className="bg-white rounded-xl shadow-md p-5"
          >
            <h2 className="text-xl font-bold">
              {booking.turf?.name}
            </h2>

            <p>{booking.turf?.location}</p>
            <p>Date: {booking.slot?.date}</p>
            <p>
              Time: {booking.slot?.startTime} -{" "}
              {booking.slot?.endTime}
            </p>

            <p className="font-semibold mt-2">
              Status: {booking.status}
            </p>

            <p className="text-sm text-gray-500 mt-2">
              Payment: {booking.paymentStatus || "Pending"}
            </p>

            {booking.status === "Booked" && (
              <button
                onClick={() => handleCancel(booking._id)}
                className="mt-4 w-full bg-red-600 text-white p-2 rounded-lg"
              >
                Cancel Booking
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyBookings;