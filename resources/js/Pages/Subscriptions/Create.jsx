import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../lib/services/apis";
import { toast } from "react-toastify";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

// Validation Schema
const validationSchema = Yup.object().shape({
    name: Yup.string().required("Client name is required").max(255),
    domain: Yup.string()
        .required("Domain is required")
        .matches(
            /^(?:[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+|(?:\d{1,3}\.){3}\d{1,3}(?::\d+)?)$/,
            "Enter a valid domain or IP with optional port"
        ),
    trial_days: Yup.number()
        .integer("Must be whole number")
        .min(1, "Minimum 1 day")
        .max(30, "Maximum 30 days")
        .nullable(),
});

const ClientRegistration = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (values, { resetForm }) => {
        
        const domainValue = values.domain.startsWith("http://")
        ? values.domain
        : `http://${values.domain}`;
        
        const formData = {
            ...values,
            domain: domainValue,
        };
        
        setIsSubmitting(true);
        try {
            const response = await ApiService.create(formData);

            if (response.data.success) {
                toast.success("Client registered successfully!", {
                    position: "top-right",
                    autoClose: 1000,
                });

                resetForm();
                navigate("/"); // Redirect to clients list after success
            }
        } catch (error) {
            toast.error(error.message || "Registration failed", {
                position: "top-right",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="md:w-1/2 sm:w-full mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
                <div className="p-4">
                    <img
                        src="/images/EatsTek_logo.png"
                        alt="logo"
                        className="w-36 h-14 mx-auto mb-4"
                    />
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-red-600">
                            Register New Client
                        </h1>
                        <p className="mt-2 text-gray-600">
                            Add a new client to the subscription system
                        </p>
                    </div>

                    <Formik
                        initialValues={{
                            name: "",
                            domain: "",
                            trial_days: 15, // Default trial period
                        }}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ errors, touched }) => (
                            <Form className="space-y-6">
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Client Name *
                                    </label>
                                    <Field
                                        name="name"
                                        type="text"
                                        className={`mt-1 block w-full p-1.5 rounded-md border-gray-300 shadow-sm focus:border-gray-50 focus:ring-gray-100 sm:text-sm ${
                                            errors.name && touched.name
                                                ? "border-red-500"
                                                : "border"
                                        }`}
                                        placeholder="Restaurant Name"
                                    />
                                    <ErrorMessage
                                        name="name"
                                        component="div"
                                        className="mt-1 text-sm text-red-600"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="domain"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Domain *
                                    </label>
                                    <div className="mt-1 flex rounded-md shadow-sm">
                                        <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                                            http://
                                        </span>
                                        <Field
                                            name="domain"
                                            type="text"
                                            className={`flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border-gray-300 focus:border-red-800 focus:ring-red-800 sm:text-sm ${
                                                errors.domain && touched.domain
                                                    ? "border-red-500"
                                                    : "border"
                                            }`}
                                            placeholder="yourdomain.com"
                                        />
                                    </div>
                                    <ErrorMessage
                                        name="domain"
                                        component="div"
                                        className="mt-1 text-sm text-red-600"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="trial_days"
                                        className="block text-sm font-medium text-gray-600"
                                    >
                                        Trial Period (Days)
                                    </label>
                                    <Field
                                        name="trial_days"
                                        type="number"
                                        min="1"
                                        max="30"
                                        className={`mt-1 block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-red-800 focus:ring-red-800 sm:text-sm ${
                                            errors.trial_days &&
                                            touched.trial_days
                                                ? "border-red-500"
                                                : "border"
                                        }`}
                                    />
                                    <ErrorMessage
                                        name="trial_days"
                                        component="div"
                                        className="mt-1 text-sm text-red-600"
                                    />
                                </div>

                                <div className="flex items-center justify-between space-x-4 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => navigate(-1)}
                                        className="w-1/2 items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`w-1/2 justify-between py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                                            isSubmitting
                                                ? "opacity-75 cursor-not-allowed"
                                                : ""
                                        }`}
                                    >
                                        {isSubmitting ? (
                                            <>Registering...</>
                                        ) : (
                                            "Register"
                                        )}
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
};

export default ClientRegistration;
