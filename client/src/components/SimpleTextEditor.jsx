import React, { useState } from "react";
import ImageUpload from "./ImageUpload";

const SimpleTextEditor = ({ value, onChange, placeholder = "Write something amazing..." }) => {
  const [showImageUpload, setShowImageUpload] = useState(false);

  const handleImageUpload = (imageUrl) => {
    // Insert image markdown at cursor position or at the end
    const imageMarkdown = `\n![Image](${imageUrl})\n`;
    const newValue = value + imageMarkdown;
    onChange(newValue);
    setShowImageUpload(false);
  };

  return (
    <div className="simple-text-editor">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={15}
        style={{
          width: '100%',
          padding: '1rem',
          border: '2px solid #e1e5e9',
          borderRadius: '10px',
          fontSize: '1rem',
          fontFamily: 'inherit',
          resize: 'vertical'
        }}
      />
      
      <div style={{ marginTop: '1rem', textAlign: 'center' }}>
        <button 
          type="button"
          onClick={() => setShowImageUpload(true)}
          className="btn btn-primary"
        >
          📷 Upload Image
        </button>
        <p><small>Add images to your post. They will appear as markdown links.</small></p>
      </div>

      {showImageUpload && (
        <div className="image-upload-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Upload Image</h3>
              <button 
                onClick={() => setShowImageUpload(false)}
                className="close-button"
              >
                ×
              </button>
            </div>
            <ImageUpload 
              onImageUpload={handleImageUpload}
              multiple={false}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleTextEditor;
