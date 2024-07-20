import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import "./App.css";
import ImageUpload from "./ImageUpload";
import ImageOptions from "./ImageOptions";
import Login from "./components/Login";
import Register from "./components/Register";

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [options, setOptions] = useState({
    grayscale: false,
    rotate: false,
    sepia: false,
    edgeDetection: false,
    gaussianBlur: false,
  });

  const handleImageSelect = (image) => {
    setSelectedImage(image);
    if (processedImage) {
      URL.revokeObjectURL(processedImage);
      setProcessedImage(null);
    }
  };

  const handleOptionsChange = (name, value) => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("image", selectedImage);
    Object.keys(options).forEach((key) => {
      formData.append(key, options[key]);
    });

    try {
      const response = await fetch("http://api.ashutosh.systems/process-image", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Failed to process image. Please try again later.");
      }
      const result = await response.blob();
      const imageObjectURL = URL.createObjectURL(result);
      if (processedImage) {
        URL.revokeObjectURL(processedImage);
      }
      setProcessedImage(imageObjectURL);
    } catch (error) {
      console.error("Failed to fetch:", error);
    }
  };

  const isAuthenticated = () => {
    // Logic to check if the user is authenticated
    // This can be from a global state or checking a token in localStorage
    return !!localStorage.getItem("authToken");
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/image-upload"
          element={
            isAuthenticated() ? (
              <div className="App">
                <header className="App-header">
                  <h1>Image Processing App</h1>
                  <ImageUpload onImageSelect={handleImageSelect} />
                  <ImageOptions onOptionsChange={handleOptionsChange} />
                  {selectedImage && (
                    <button onClick={handleSubmit}>Process Image</button>
                  )}
                  {processedImage && (
                    <div>
                      <h2>Processed Image:</h2>
                      <img
                        key={processedImage}
                        src={processedImage}
                        alt="Processed"
                      />
                    </div>
                  )}
                </header>
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
