import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ShopContext } from "../../context/ShopContext";

const Orders = () => {
  const { currency, axios } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reportLoading, setReportLoading] = useState(false);

  const fetchAllOrders = async () => {
    try {
      const { data } = await axios.post("/api/order/list")
      if (data.success) {
        if (Array.isArray(data.orders)) {
          setOrders(data.orders)
        } else {
          setOrders([])
        }
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
    }
  };

  const handleGenerateReport = async () => {
    try {
      setReportLoading(true)
      const response = await axios.get("/api/report/generate-report", {
        params: { status: statusFilter, startDate, endDate },
        responseType: "blob",
      })

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "BookHeaven_Report.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Report downloaded")
    } catch (error) {
      console.error(error)
      toast.error("Unable to generate report")
    } finally {
      setReportLoading(false)
    }
  }

  const statusHandler = async (event, orderId) => {
     try {
      const { data } = await axios.post("/api/order/status",{orderId,status:event.target.value})
      if (data.success) {
        await fetchAllOrders()
        toast.success(data.message)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchAllOrders();
    console.log(orders);
  }, []);

  return (
    <div className="px-2 sm:px-6 py-12 m-2 h-[97vh] bg-primary overflow-y-scroll lg:w-4/5 rounded-xl">
      <div className="bg-white p-4 rounded-lg shadow-sm mb-5">
        <h3 className="h5 mb-4">Generate Report</h3>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-end">
          <div>
            <label className="medium-14 block mb-2">Order Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg bg-primary"
            >
              <option value="All">All</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="medium-14 block mb-2">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg bg-primary"
            />
          </div>

          <div>
            <label className="medium-14 block mb-2">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg bg-primary"
            />
          </div>

          <div className="flex items-center">
            <button
              type="button"
              onClick={handleGenerateReport}
              disabled={reportLoading}
              className="w-full py-3 px-4 rounded-lg bg-slate-900 text-white disabled:bg-slate-500"
            >
              {reportLoading ? "Generating..." : "Generate Report"}
            </button>
          </div>
        </div>
      </div>
      {orders.map((order) => (
        <div key={order._id} className="bg-white p-2 mt-3 rounded-lg">
          {/* BOOK LIST */}
          <div className="flex flex-col lg:flex-row gap-4 mb-3">
            {order.items.map((item, index) => (
              <div key={index} className="flex gap-x-3">
                <div className="flexCenter rounded-lg overflow-hidden">
                  <img
                    src={item.product.image[0]}
                    alt="orderImg"
                    className="max-h-20 max-w-32 aspect-square object-contain"
                  />
                </div>
                <div className="w-full block">
                  <h5 className="h5 capitalize line-clamp-1">
                    {item.product.name}
                  </h5>
                  <div className="flex flex-wrap gap-3 max-sm:gap-y-1 mt-1">
                    <div className="flex items-center gap-x-2">
                      <h5 className="medium-14">Price:</h5>
                      <p>
                        {currency}
                        {item.product.offerPrice}
                      </p>
                    </div>
                    <div className="flex items-center gap-x-2">
                      <h5 className="medium-14">Quantity:</h5>
                      <p>{item.quantity}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ORDER SUMMERY */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-t border-gray-300 pt-3">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-x-2">
                <h5 className="medium-14">OrderId:</h5>
                <p className="text-gray-400 text-xs break-all">{order._id}</p>
              </div>

              <div className="flex gap-4">
                <div className="flex items-center gap-x-2">
                  <h5 className="medium-14">Customer:</h5>
                  <p className="text-xs">
                    {order.address.firstName} {order.address.lastName}
                  </p>
                </div>    

                <div className="flex items-center gap-x-2">
                  <h5 className="medium-14">Phone:</h5>
                  <p className="text-xs">{order.address.phone}</p>
                </div>
              </div>

                <div className="flex items-center gap-x-2">
                  <h5 className="medium-14">Address:</h5>
                  <p className="text-xs">
                    {" "}
                    {order.address.street},{order.address.city},
                    {order.address.state},{order.address.country},
                    {order.address.zipcode}
                  </p>
                </div>

              <div className="flex gap-4">
                <div className="flex items-center gap-x-2">
                  <h5 className="medium-14">Payment Status:</h5>
                  <p>{order.isPaid ? "Done" : "Pending"}</p>
                  <div className="flex items-center gap-x-2">
                    <h5 className="medium-14">Method:</h5>
                    <p className="text-gray-400 text-sm">
                      {order.paymentMethod}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-x-2">
                  <h5 className="medium-14">Date:</h5>
                  <p className="text-gray-400 text-sm">
                    {new Date(order.createdAt).toDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-x-2">
                  <h5 className="medium-14">Amount:</h5>
                  <p className="text-gray-400 text-sm">
                    {currency}
                    {order.amount}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <h5 className="medium-14">Status:</h5>
              <select
                onChange={(event)=>statusHandler(event,order._id)}
                value={order.status}
                className="text-xs font-semibold p-1 ring-1 ring-slate-900/5 rounded max-w-36 bg-primary"
              >
                <option value="Order Placed">Order Placed</option>
                <option value="Packing">Packing</option>
                <option value="Shipped">Shipped</option>
                <option value="Out of delivery">Out of delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Orders;
