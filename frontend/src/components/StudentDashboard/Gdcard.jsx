import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";

export default function Gdcard(props) {
  const {
    company_name,
    gd_date,
    gd_time,
    gd_info,
    gd_link,
    was_shortlisted,
    isLinkVisible,
  } = props;

  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="w-full max-w-lg mx-auto border border-custom-blue bg-white rounded-lg shadow-lg p-6 transition-all transform duration-300 hover:shadow-2xl hover:scale-105">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          {company_name}
        </h2>
        <div className="mt-4 space-y-4">
          <div className="text-sm text-gray-500 flex items-center">
            <span className="font-medium text-gray-800 mr-2">GD Date:</span>
            <span className="font-medium text-gray-500">
              {" "}
              {gd_date
                ? new Date(gd_date).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "Not Provided"}
            </span>
          </div>
          <div className="text-sm text-gray-500 flex items-center">
            <span className="font-medium text-gray-800 mr-2">GD Time:</span>
            <span className="font-medium text-gray-500">{gd_time}</span>
          </div>
          {isLinkVisible ? (
            gd_link ? (
              <div className="text-sm text-gray-500 flex items-center">
                <span className="font-medium text-gray-800 mr-2">GD Link:</span>
                <a
                  href={
                    typeof gd_link === "string" && gd_link.startsWith("http")
                      ? gd_link
                      : `https://${gd_link || ""}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-green-500 rounded-lg p-1 text-green-500 hover:bg-green-500 hover:text-white"
                >
                  Start
                </a>
              </div>
            ) : (
              <div className="text-sm text-gray-500 flex items-center">
                <span className="font-medium text-gray-800 mr-2">GD Link:</span>
                <button
                  onClick={() => alert("GD link will be available soon")}
                  className="border border-custom-blue rounded-lg p-1 text-custom-blue hover:bg-custom-blue hover:text-white"
                >
                  Soon
                </button>
              </div>
            )
          ) : (
            <div className="text-sm text-gray-500 flex items-center">
                <span className="font-medium text-gray-800 mr-2">GD Link:</span>
                <button
                  onClick={() => alert("Link Visibility is off")}
                  className="border border-custom-blue rounded-lg p-1 text-custom-blue hover:bg-custom-blue hover:text-white"
                >
                  Soon
                </button>
              </div>
          )}
            <div className="text-sm text-gray-500 flex items-center">
            <span className="font-medium text-gray-800 mr-2">
              Selection Status:
            </span>
            <span className={`inline-block px-2 py-1 rounded ${
  was_shortlisted === true 
    ? 'text-green-600 bg-green-50'
    : 'text-gray-600 bg-gray-50'
}`}>
  {was_shortlisted === true
    ? "Shortlisted"
    : was_shortlisted === false
      ? "Not selected"
      : "Result yet to be declared"
  }
</span>
          </div>
        </div>
        <button
          className="mt-6 w-full bg-custom-blue text-white py-2 px-4 rounded-md transition-colors duration-300 hover:bg-blue-600 hover:shadow-lg focus:outline-none"
          onClick={toggleModal}
        >
          Show GD Info
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 focus:outline-none"
              onClick={toggleModal}
            >
              &times;
            </button>
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              GD Guidelines & Info
            </h3>
            <p className="text-gray-600">{gd_info}</p>
          </div>
        </div>
      )}
    </div>
  );
}