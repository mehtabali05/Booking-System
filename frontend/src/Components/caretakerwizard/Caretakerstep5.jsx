import React, { useState } from "react";
import Header from "../Header";
import { useNavigate } from "react-router-dom";
import { FaCamera } from "react-icons/fa";
import "./Caretaker.css";

const CaretakerStep5 = () => {
  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);

  function updateProfile(updates) {
    const existing = JSON.parse(localStorage.getItem("caretaker_profile")) || {};
    const updated = { ...existing, ...updates };
    localStorage.setItem("caretaker_profile", JSON.stringify(updated));
  }

  const handleImageUpload = (e) => {
    const f = e.target.files[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  // const handleNext = async () => {
  //   if (!file) return;

  //   // --- CHANGE 1: Get the token ---
  //   const token = localStorage.getItem("token"); 

  //   const formData = new FormData();
  //   formData.append("photo", file);

  //   try {
  //     const res = await fetch("http://localhost:5000/api/caretakers/upload-photo", {
  //       method: "POST",
  //       headers: {
  //         // --- CHANGE 2: Add Authorization Header ---
  //         // Note: Do NOT set 'Content-Type' for FormData, the browser does it automatically
  //         "Authorization": `Bearer ${token}` 
  //       },
  //       body: formData,
  //     });

  //     // const data = await res.json();
  //     const text = await res.text();
  //     let data;
  //     try {
  //       data = JSON.parse(text);
  //     } catch {
  //       console.error("Non-JSON response:", text);
  //       throw new Error("Server returned invalid response");
  //     }
      
  //     if (!res.ok) {
  //       throw new Error(data.message || "Upload failed");
  //     }
  //     // if (data.success) {
  //     //   updateProfile({
  //     //     photo: data.filePath,
  //     //   });
  //     //   navigate("/caretakerstep6");
  //     // } else {
  //     //   // --- CHANGE 3: Better error feedback ---
  //     //   alert(data.message || "Photo upload failed");
  //     // }
  //   } catch (err) {
  //     console.error("Upload error:", err);
  //     alert("Server error during upload");
  //   }
  // };
 
  const handleNext = async () => {
    if (!file) return;
  
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Authentication token missing. Please log in again.");
      return;
    }
  
    const formData = new FormData();
    formData.append("photo", file);
  
    try {
      const res = await fetch("http://localhost:5000/api/caretakers/upload-photo", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
  
      const text = await res.text();
      let data;
  
      try {
        data = JSON.parse(text);
      } catch {
        console.error("Non-JSON response:", text);
        throw new Error("Server returned invalid response");
      }
  
      if (!res.ok) {
        throw new Error(data.message || "Upload failed");
      }
  
      // ✅ THIS WAS MISSING
      if (data.success) {
        updateProfile({
          photo: data.filePath,
        });
        navigate("/caretakerstep6");
      } else {
        alert(data.message || "Photo upload failed");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert(err.message || "Server error during upload");
    }
  };
  
 
  return (
    <div className="caretaker-step5-container">
      <Header />

      <div className="photo-content">
        <div className="message-box">
          <p>Time for the photo!</p>
        </div>

        <div className="photo-upload-section">
          <div className="photo-preview">
            {preview ? (
              <img src={preview} alt="Uploaded" />
            ) : (
              <div className="empty-photo-circle"></div>
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
        </div>

        <div className="nav-buttons">
          <button className="back-btn" onClick={() => navigate("/caretakerstep4")}>
            Back
          </button>

          <button className="next-btn" onClick={handleNext} disabled={!file}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default CaretakerStep5;
