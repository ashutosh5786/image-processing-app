import React, { useState } from 'react';
import './App.css';
import ImageUpload from './ImageUpload'; // Ensure you have this component created
import ImageOptions from './ImageOptions'; // Ensure you have this component created

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [options, setOptions] = useState({
    grayscale: false,
    rotate: false,
    sepia: false,
    edgeDetection: false,
    gaussianBlur: false
  });

  const handleImageSelect = (image) => {
    setSelectedImage(image);
    if (processedImage) {
      URL.revokeObjectURL(processedImage);
      setProcessedImage(null);
    }
  };

  const handleOptionsChange = (name, value) => {
    setOptions(prevOptions => ({
      ...prevOptions,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('image', selectedImage);
    Object.keys(options).forEach(key => {
      formData.append(key, options[key]);
    });

    try {
      const response = await fetch('http://localhost:8080/process-image', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.blob();
      const imageObjectURL = URL.createObjectURL(result);
      if (processedImage) {
        URL.revokeObjectURL(processedImage);
      }
      setProcessedImage(imageObjectURL);
    } catch (error) {
      console.error('Failed to fetch:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Image Processing Application</h1>
        <ImageUpload onImageSelect={handleImageSelect} />
        <ImageOptions onOptionsChange={handleOptionsChange} />
        {selectedImage && <button onClick={handleSubmit}>Process Image</button>}
        {processedImage && <div>
          <h2>Processed Image:</h2>
          <img key={processedImage} src={processedImage} alt="Processed" />
        </div>}
      </header>
    </div>
  );
}

export default App;
