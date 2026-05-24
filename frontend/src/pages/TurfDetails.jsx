import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axiosInstance";
import toast from "react-hot-toast";

function TurfDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [slots, setSlots] = useState([]);

  const fetchSlots = async () => {
    try {
      const res = await API.get(`/slots/${id}`);
      setSlots(res.data.data);
    } catch (error) {
      console.log("Failed to load slots", error);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, [id]);

  const handleBooking = async (slot) => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login or register to book a slot");
      navigate("/login");
      return;
    }

    try {
      const amount = slot.turf?.pricePerHour || 500;

      const orderRes = await API.post("/payments/create-order", {
        amount,
      });

      const order = orderRes.data.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "EasyGo",
        description: "Turf Slot Booking",
        order_id: order.id,

        handler: async function (response) {
          try {
            const verifyRes = await API.post("/payments/verify", {
              turf: id,
              slot: slot._id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            toast.success(verifyRes.data.message);
            fetchSlots();
          } catch (error) {
            toast.error(
              error.response?.data?.message ||
                "Payment verification failed"
            );
          }
        },

        modal: {
          ondismiss: function () {
            toast.error("Payment cancelled");
          },
        },

        theme: {
          color: "#2563eb",
        },
      };

      const razorpayWindow = new window.Razorpay(options);
      razorpayWindow.open();
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Please login or register to book a slot");
        navigate("/login");
        return;
      }

      toast.error(
        error.response?.data?.message || "Payment failed"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">
        Available Slots
      </h1>

      {slots.length === 0 ? (
        <p className="text-gray-600">
          No slots available for this turf yet.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {slots.map((slot) => (
            <div
              key={slot._id}
              className="bg-white rounded-xl shadow-md p-5"
            >
              <p>Date: {slot.date}</p>

              <p>
                Time: {slot.startTime} - {slot.endTime}
              </p>

              <p>
                Status:{" "}
                {slot.isBooked ? "Booked" : "Available"}
              </p>

              <button
                disabled={slot.isBooked}
                onClick={() => handleBooking(slot)}
                className="mt-4 w-full bg-blue-600 text-white p-2 rounded-lg disabled:bg-gray-400"
              >
                {slot.isBooked ? "Booked" : "Pay & Book"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TurfDetails;