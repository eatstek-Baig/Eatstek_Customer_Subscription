import { useNavigate } from "react-router-dom";

const NoDataToShow = ({heading, description}) => {

    const navigate = useNavigate();
    
    return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center px-4">
      <div className="md:w-1/2 sm:w-full max-w-md bg-white rounded-lg shadow-md p-6 text-center">
        <img 
          src="/images/EatsTek_logo.png" 
          alt="logo" 
          className="w-36 h-14 mx-auto mb-4" 
        />
        <h1 className="text-xl font-bold text-gray-700 mb-6">
          {heading}
        </h1>
        <p className="text-gray-600 mb-6">
          {description}
        </p>
        <button
            onClick={() => navigate(-1)}
          className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default NoDataToShow