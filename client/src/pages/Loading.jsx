import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { useLocation } from "react-router-dom";

const Loading = () => {
  const { navigate } = useContext(ShopContext);

  let { search } = useLocation();
  const query = new URLSearchParams(search);
  const nextUrl = query.get("next");

  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (nextUrl === "my-orders") {
      setShowPopup(true);
    } else if (nextUrl) {
      navigate(`/${nextUrl}`);
    }
  }, [nextUrl]);

  const handleClose = () => {
    setShowPopup(false);
    navigate("/my-orders");
  };

  return (
    <div className="flexCenter h-screen">

      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/40">

          <div className="bg-white p-6 rounded-lg shadow-lg text-center w-80">

            <h2 className="text-xl font-bold text-green-600">
              Order Placed Successfully ✅
            </h2>

            <p className="mt-2 text-gray-600">
              Thank you for shopping with us
            </p>

            <button
              onClick={handleClose}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
            >
              OK
            </button>

          </div>

        </div>
      )}

      {!showPopup && (
        <div className="animate-spin h-12 w-12 border-4 border-gray-300 border-t-secondary rounded-full" />
      )}

    </div>
  );
};

export default Loading;
