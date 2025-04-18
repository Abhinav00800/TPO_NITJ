import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaStar, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import axios from "axios";
import Editor from "../StudentDashboard/ckeditor";
import parse from "html-react-parser";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import BouncingLoader from "../BouncingLoader";
import Notification from "./Notification";

// Star Rating Component
const StarRating = ({ rating }) => {
  const stars = Array.from({ length: 5 }, (_, index) => (
    <FaStar
      key={index}
      className={index < rating ? "text-yellow-400" : "text-gray-300"}
    />
  ));
  return <div className="flex space-x-1">{stars}</div>;
};

// Truncate Text Component
const TruncatedText = ({ text, maxLength }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (text.length <= maxLength || isExpanded) {
    return <p>{text}</p>;
  }

  return (
    <p>
      {text.slice(0, maxLength)}...
      <button
        onClick={() => setIsExpanded(true)}
        className="text-blue-500 hover:underline ml-1"
      >
        Read More
      </button>
    </p>
  );
};

const ProfessorExperienceManagement = () => {
  const [showEditor, setShowEditor] = useState(false);
  const [recruiterFeedback, setRecruiterFeedback] = useState([]);
  const [otherExperiences, setOtherExperiences] = useState([]);
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("myExperiences");

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.REACT_APP_BASE_URL}/sharedexperience`,
          { withCredentials: true }
        );
        setOtherExperiences(response.data.otherExperiences || []);
      } catch (err) {
        setError(err.message || "Failed to load experiences.");
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.REACT_APP_BASE_URL}/feedback`,
          { withCredentials: true }
        );
        setRecruiterFeedback(response.data.data || []);
      } catch (err) {
        setError(err.message || "Failed to load feedback.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  const handleDelete = async (experience) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(
            `${import.meta.env.REACT_APP_BASE_URL}/sharedexperience/${
              experience._id
            }`,
            { withCredentials: true }
          );
          setRecruiterFeedback((prev) =>
            prev.filter((exp) => exp._id !== experience._id)
          );
          toast.success("Experience deleted successfully!");
        } catch (err) {
          toast.error(err.message || "Failed to delete experience.");
        }
      }
    });
  };

  const handleFeedbackDelete = async (experience) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(
            `${import.meta.env.REACT_APP_BASE_URL}/feedback/${
              experience._id
            }`,
            { withCredentials: true }
          );
          setRecruiterFeedback((prev) =>
            prev.filter((exp) => exp._id !== experience._id)
          );
          toast.success("Feedback deleted successfully!");
        } catch (err) {
          toast.error(err.message || "Failed to delete feedback.");
        }
      }
    });
  };

  const handleViewDetails = (experience) => {
    setSelectedExperience(experience);
  };

  const handleBack = () => {
    setSelectedExperience(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-custom-blue"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (isEditing) {
    return (
      <Editor
        experience={selectedExperience}
        editing={true}
        onClose={() => {
          setIsEditing(false);
          setSelectedExperience(null);
        }}
      />
    );
  }

  if (showEditor) {
    return (
      <Editor
        experience={selectedExperience}
        onClose={() => {
          setShowEditor(false);
          setSelectedExperience(null);
        }}
      />
    );
  }

  if (selectedExperience) {
    return (
      <div className="p-6 bg-white min-h-screen">
        <button
          onClick={handleBack}
          className="flex items-center space-x-2 text-blue-500 hover:text-blue-700 mb-4"
        >
          <FaArrowLeft />
        </button>
        <h1 className="text-4xl font-bold mb-4">
          {selectedExperience.title || "Untitled Experience"}
        </h1>
        <p className="text-black mb-1 mt-4">
          By: {selectedExperience.author?.name || "Anonymous"}
        </p>
        <p className="text-gray-600 mb-6">
          {new Date(selectedExperience.createdAt).toLocaleDateString(
            undefined,
            {
              year: "numeric",
              month: "short",
              day: "numeric",
            }
          )}
        </p>
        <div className="prose max-w-none">
          {parse(selectedExperience.content)}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Tabs */}
      <div className="flex justify-between items-center flex-col lg:flex-row p-4 rounded-t-lg ">
        <h2 className="text-3xl font-bold text-custom-blue capitalize">
          <span className="text-black">
            {activeTab === "myExperiences" ? "Recruiter" : "Students"}
          </span>{" "}
          {activeTab === "myExperiences" ? "Feedbacks" : "Experiences"}
        </h2>

        <div className="flex border border-gray-300 rounded-3xl lg:mt-0 bg-white mt-10">
          <button
            className={`px-4 py-2 rounded-3xl ${
              activeTab === "myExperiences"
                ? "bg-custom-blue text-white"
                : "bg-white"
            }`}
            onClick={() => setActiveTab("myExperiences")}
          >
            Recruiter Feedbacks
          </button>
          <button
            className={`px-4 py-2 rounded-3xl ${
              activeTab === "otherExperiences"
                ? "bg-custom-blue text-white"
                : "bg-white"
            }`}
            onClick={() => setActiveTab("otherExperiences")}
          >
            Students Experiences
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="container mx-auto px-4 py-6">
      {activeTab === "myExperiences" && (
  <section>
    <div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {recruiterFeedback.map((feedback) => (
        <div
          key={feedback._id}
          className="border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white to-gray-50 p-6 flex flex-col items-start justify-between text-left h-auto w-auto"
        >
          <div className="w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">{feedback.company}</h3>
            <div className="space-y-4">
              {/* Technical Skill */}
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-600">Technical Skill</p>
                <StarRating rating={feedback.technicalSkill} />
              </div>

              {/* Communication Skill */}
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-600">Communication Skill</p>
                <StarRating rating={feedback.communicationSkill} />
              </div>

              {/* Overall Experience */}
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-600">Overall Experience</p>
                <StarRating rating={feedback.overallExperience} />
              </div>

              {/* Comments */}
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-600 mb-2">Comments</p>
                <TruncatedText text={feedback.comment} maxLength={100} className="text-gray-800" />
              </div>
            </div>

            {/* Delete Button */}
            <button
              className="mt-6 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition duration-300 shadow-md w-full flex items-center justify-center space-x-2"
              onClick={(e) => {
                e.stopPropagation();
                handleFeedbackDelete(feedback);
              }}
            >
              <FaTrash /> <span>Delete</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  </section>
)}
        {activeTab === "otherExperiences" && (
          <section>
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {otherExperiences.map((experience) => (
                <div
                  key={experience._id}
                  className="border border-gray-200 rounded-xl shadow-md hover:shadow-2xl transition-transform hover:scale-105 hover:border-blue-500 duration-300 cursor-pointer overflow-hidden p-4 flex flex-col items-center justify-between text-center h-auto w-auto"
                  onClick={() => handleViewDetails(experience)}
                >
                  <h4 className="text-lg font-semibold text-gray-800 break-words w-full px-2">
                    {experience.title || "Untitled Experience"}
                  </h4>
                  <p className="text-sm text-gray-600 break-words px-2">
                    {new Date(experience.createdAt).toLocaleDateString(
                      undefined,
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }
                    )}
                  </p>
                  <div className="flex justify-center space-x-3 mt-2 w-full">
                    <button
                      className="bg-custom-blue text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition duration-300 shadow-md w-24 flex items-center justify-center space-x-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedExperience(experience);
                        setIsEditing(true);
                      }}
                    >
                      <FaEdit /> <span>Edit</span>
                    </button>
                    <button
                      className="bg-red-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition duration-300 shadow-md w-24 flex items-center justify-center space-x-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(experience);
                      }}
                    >
                      <FaTrash /> <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
      <Notification />
    </>
  );
};

export default ProfessorExperienceManagement;