import React from "react";

function ImageOptions({ onOptionsChange }) {
  const handleChange = (event) => {
    const { name, checked } = event.target;
    onOptionsChange(name, checked);
  };

  return (
    <div className="image-options">
      <h3>Image Processing Options</h3>
      <div>
        <label>
          <input type="checkbox" name="grayscale" onChange={handleChange} />
          Convert to Grayscale
        </label>
      </div>
      <div>
        <label>
          <input type="checkbox" name="rotate" onChange={handleChange} />
          Rotate 90°
        </label>
      </div>
      <div>
        <label>
          <input type="checkbox" name="sepia" onChange={handleChange} />
          Apply Sepia Filter
        </label>
      </div>
      <div>
        <label>
          <input type="checkbox" name="edgeDetection" onChange={handleChange} />
          Edge Detection
        </label>
      </div>
      <div>
        <label>
          <input type="checkbox" name="gaussianBlur" onChange={handleChange} />
          Gaussian Blur
        </label>
      </div>
    </div>
  );
}

export default ImageOptions;
