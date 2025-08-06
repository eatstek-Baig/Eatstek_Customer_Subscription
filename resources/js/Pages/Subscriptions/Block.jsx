import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../lib/services/apis";
import { toast } from "react-toastify";
import NoDataToShow from "../../Components/Empty";

const BlockSubscription = () => {

    const navigate = useNavigate();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [clients, setClients] = useState([]);
  
  const [formData, setFormData] = useState({
    client_id: "",
    description: ""
  });

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await ApiService.indexExpired();
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
      const response = await ApiService.block(formData);
      if (response.data.success) {
        toast.success(response.data?.message);
        navigate("/");
      }else {
        toast.error(response.data?.message || response.data?.error);
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  if(clients.length === 0){
    return <NoDataToShow
             heading="No Data to Display"
            description="There are currently no clients with expired subscription" />
  }

  return (
    <div className="bg-gray-100 min-h-screen items-center flex justify-center p-4">
      <div className="md:w-1/2 sm:w-full max-w-md h-auto bg-white rounded-lg shadow-md p-6">
       <img
                        src="/images/EatsTek_logo.png"
                        alt="logo"
                        className="w-36 h-14 mx-auto mb-4"
                    />
        <h1 className="text-xl font-bold text-red-500 mb-6 text-center">
          Block Subscription
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
              {isSubmitting ? "Blocking..." : "Block"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlockSubscription;