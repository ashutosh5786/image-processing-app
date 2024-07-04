import React, { useState } from "react";

function ImageUpload({ onImageSelect }) {
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      let img = e.target.files[0];
      setImage(img);
      onImageSelect(img);
    }
  };

  return (
    <div className="image-upload">
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {image && (
        <img
          src={URL.createObjectURL(image)}
          alt="preview"
          style={{ width: "100px", height: "auto" }}
        />
      )}
    </div>
  );
}

export default ImageUpload;
