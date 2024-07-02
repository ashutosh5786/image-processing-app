import React, { useState } from 'react';
import './App.css';
import ImageUpload from './ImageUpload';
import ImageOptions from './ImageOptions';

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [options, setOptions] = useState({
    grayscale: false,
    resize: '',
    sharpen: false,
    sepia: false
  });
  const [processedImage, setProcessedImage] = useState(null);

  const handleImageSelect = (image) => {
    setSelectedImage(image);
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
      if (options[key]) {
        formData.append(key, options[key]);
      }
    });

    try {
      const response = await fetch('http://localhost:8080/process-image', {
        method: 'POST',
        body: formData,
      });
      const result = await response.blob(); // Assuming the server sends back a processed image blob
      setProcessedImage(URL.createObjectURL(result));
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = 'processed-image.png'; // You might want to dynamically generate a name based on processing options
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          <img src={processedImage} alt="Processed" />
          <button onClick={handleDownload}>Download Image</button>
        </div>}
      </header>
    </div>
  );
}

export default App;
