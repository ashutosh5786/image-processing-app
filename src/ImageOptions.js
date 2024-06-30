import React from "react";

function ImageOptions({ onOptionsChange }) {
  const handleChange = (event) => {
    const { name, value, checked, type } = event.target;
    onOptionsChange(name, type === "checkbox" ? checked : value);
  };

  return (
    <div>
      <h3>Image Processing Options</h3>
      <div>
        <label>
          <input type="checkbox" name="grayscale" onChange={handleChange} />
          Convert to Grayscale
        </label>
      </div>
      <div>
        <label>
          Resize:
          <select name="resize" onChange={handleChange}>
            <option value="">Select</option>
            <option value="640x480">640x480</option>
            <option value="800x600">800x600</option>
            <option value="1024x768">1024x768</option>
          </select>
        </label>
      </div>
      <div>
        <label>
          <input type="checkbox" name="sharpen" onChange={handleChange} />
          Sharpen
        </label>
      </div>
      <div>
        <label>
          <input type="checkbox" name="sepia" onChange={handleChange} />
          Apply Sepia Filter
        </label>
      </div>
    </div>
  );
}

export default ImageOptions;
