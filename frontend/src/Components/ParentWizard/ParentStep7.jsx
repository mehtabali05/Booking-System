import React, { useState, useEffect } from "react";
import Header from "../Header";
import { useNavigate } from "react-router-dom";
import { FaCamera } from "react-icons/fa";
import "./parentWizard.css";

const ParentStep7 = () => {
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  // This will hold the consolidated data from all steps
  const [parentProfile, setParentProfile] = useState({});

  // Fetch all step data from localStorage on component mount
  useEffect(() => {
    const consolidatedProfile = {};

    for (let i = 1; i <= 7; i++) {
      const stepData = JSON.parse(localStorage.getItem(`ParentStep${i}`) || "{}");
      Object.assign(consolidatedProfile, stepData);
    }

    // Store in state for easy use
    setParentProfile(consolidatedProfile);
    console.log("Fetched parentProfile from localStorage:", consolidatedProfile);
  }, []);

  // Handle file upload and preview
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setImageFile(file);
      console.log("Selected image file:", file);
    }
  };

  // Submit parent profile with photo
  // const handleSubmit = async () => {
  //   const token = localStorage.getItem("token"); 
  //   if (!imageFile) {
  //     alert("Please upload a photo before submitting.");
  //     return;
  //   }

  //   const user = JSON.parse(localStorage.getItem("user"));
  //   const userId = user?.id;

  //   if (!userId) {
  //     alert("User not found. Please login again.");
  //     return;
  //   }

  //   // Merge userId and image data
  //   const fullProfile = {
  //     ...parentProfile,
  //     userId,
  //   };

  //   console.log("Parent Profile object being sent to backend:", fullProfile);

  //   // Build FormData for multipart/form-data
  //   const formData = new FormData();
  //   formData.append("parent_profile", JSON.stringify(fullProfile));
  //   formData.append("userId", userId);
  //   formData.append("photo", imageFile);

  //   // Log all FormData entries
  //   console.log("FormData being sent to backend:");
  //   for (let pair of formData.entries()) {
  //     console.log(pair[0], ":", pair[1]);
  //   }


  //   try {
  //     const response = await fetch("http://localhost:5000/api/parents/profile",
  //      {
  //       "Content-Type": "application/json",
  //       // 2. Attach the token here
  //       "Authorization": `Bearer ${token}` 
  //     } ,{
  //       method: "POST",
  //       body: formData,
  //     });

  //     const data = await response.json();
  //     console.log("Response from backend:", data);

  //     if (!response.ok || !data.success) {
  //       alert(data.message || "Error creating profile");
  //       return;
  //     } 

  //     // Clear all step data
  //     for (let i = 1; i <= 7; i++) {
  //       localStorage.removeItem(`ParentStep${i}`);
  //     }

  //     alert("Profile created successfully!");
  //     navigate("/parent-dashboard");
  //   } catch (error) {
  //     console.error("Error submitting parent data:", error);
  //     alert("Something went wrong. Please try again.");
  //   }
  // }; 

  // Submit parent profile with photo
  const handleSubmit = async () => {
    const token = localStorage.getItem("token"); 
    if (!imageFile) {
      alert("Please upload a photo before submitting.");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?._id || user?.id; // Standardize ID

    if (!userId) {
      alert("User not found. Please login again.");
      return;
    }

    const fullProfile = {
      ...parentProfile,
      userId,
    };

    // Build FormData for multipart/form-data
    const formData = new FormData();
    // Ensure the key 'parent_profile' matches what your controller expects
    formData.append("parent_profile", JSON.stringify(fullProfile));
    formData.append("userId", userId);
    formData.append("photo", imageFile); // 'photo' must match uploadParent.single("photo")

    try {
      // --- CHANGE 1: Corrected fetch structure (URL, then ONE options object) ---
      const response = await fetch("http://localhost:5000/api/parents/profile", {
        method: "POST",
        headers: {
          // --- CHANGE 2: Removed Content-Type (Browser sets it for FormData) ---
          // --- CHANGE 3: Authorization attached correctly ---
          "Authorization": `Bearer ${token}` 
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        // --- CHANGE 4: Added specific check for 404/401 ---
        if(response.status === 404) {
             alert("Endpoint not found. Check your server routes.");
        } else {
             alert(data.message || "Error creating profile");
        }
        return;
      } 

      // Clear all step data
      for (let i = 1; i <= 7; i++) {
        localStorage.removeItem(`ParentStep${i}`);
      }

      alert("Profile created successfully!");
      navigate("/parent-dashboard");
    } catch (error) {
      console.error("Error submitting parent data:", error);
      alert("Something went wrong. Please try again.");
    }
  };  

  return (
    <div className="parent-step7-container">
      <Header />

      <div className="photo-content">
        <p className="step-title">Time for the photo!</p>

        <div className="photo-preview">
          {imagePreview ? (
            <img src={imagePreview} alt="Preview" />
          ) : (
            <div className="empty-photo-circle" />
          )}
        </div>

        <label htmlFor="file-upload" className="upload-btn">
          <FaCamera className="camera-icon" />
          Upload Photo
        </label>

        <input
          type="file"
          id="file-upload"
          accept="image/*"
          onChange={handleImageUpload}
        />

        <div className="nav-buttons">
          <button
            className="back-btn"
            onClick={() => navigate("/ParentStep6")}
          >
            Back
          </button>
          <button
            className="next-btn"
            onClick={handleSubmit}
            disabled={!imageFile}
          >
            Finish
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParentStep7;
