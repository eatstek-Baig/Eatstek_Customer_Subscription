import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../lib/services/apis";
import { toast } from "react-toastify";

const UpdateSubscription = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clients, setClients] = useState([]);
  
  const [formData, setFormData] = useState({
    client_id: "",
    amount_paid: "",
    valid_days: "",
    description: ""
  });

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await ApiService.index();
        if (response.data.success) {
            console.log(response.data.data)
          setClients(response.data.data);
        }else {
          toast.error("Failed to load clients");
        }
      } catch (error) {
        toast.error("Something went wrong");
      }
    };

    fetchClients();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simple validation
    if (!formData.client_id) {
      toast.error("Please select a client");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await ApiService.update(formData);
      if (response.data.success) {
        toast.success("Subscription Renewed successfully!");
        navigate("/");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="md:w-1/2 sm:w-full max-w-md bg-white rounded-lg shadow-md p-6">
       <img
                        src="/images/EatsTek_logo.png"
                        alt="logo"
                        className="w-36 h-14 mx-auto mb-4"
                    />
        <h1 className="text-xl font-bold text-red-500 mb-6 text-center">
          Renew Subscription
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client
            </label>
            <select
              name="client_id"
              value={formData.client_id}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select a client</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount
            </label>
            <input
              type="number"
              id="amount_paid"
              name="amount_paid"
              min= "0"
              step="0.01"
              value={formData.amount_paid}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Days
            </label>
            <input
              type="number"
              id="valid_days"
              name="valid_days"
              value={formData.valid_days}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="30"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Additional details"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateSubscription;