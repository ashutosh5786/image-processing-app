import React, { useState } from "react";
import "./App.css";
import ImageUpload from "./ImageUpload";

function App() {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageSelect = (image) => {
    setSelectedImage(image);
    console.log("Selected Image:", image);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Image Processing Application</h1>
        <ImageUpload onImageSelect={handleImageSelect} />
      </header>
    </div>
  );
}

export default App;
