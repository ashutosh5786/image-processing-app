import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import "./App.css";
import ImageUpload from "./components/ImageUpload";
import ImageOptions from "./components/ImageOptions";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";

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
      const response = await fetch("http://localhost:8080/process-image", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
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
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route
          path="/dashboard"
          render={(props) =>
            isAuthenticated() ? (
              <Dashboard {...props} />
            ) : (
              <Redirect to="/login" />
            )
          }
        />
        <Route
          path="/image-upload"
          render={(props) =>
            isAuthenticated() ? (
              <div>
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
                      src={`${processedImage}?${new Date().getTime()}`}
                      alt="Processed"
                    />
                  </div>
                )}
              </div>
            ) : (
              <Redirect to="/login" />
            )
          }
        />
        <Route exact path="/" render={() => <Redirect to="/login" />} />
      </Switch>
    </Router>
  );
}

export default App;
