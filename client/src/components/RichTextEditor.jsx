import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import ImageUpload from "./ImageUpload";

const RichTextEditor = ({ value, onChange, placeholder = "Write something amazing..." }) => {
  const [showImageUpload, setShowImageUpload] = useState(false);

  // Debug: Show what modules are available
  console.log('ReactQuill modules:', ReactQuill.Quill.imports['modules/toolbar']);

  const modules = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ 'header': 1 }, { 'header': 2 }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'font': [] }],
        [{ 'align': [] }],
        ['clean'],
        ['link', 'image', 'video']
      ],
      handlers: {
        image: () => {
          console.log('Image button clicked!');
          setShowImageUpload(true);
        }
      }
    }
  };

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video'
  ];

  const handleImageUpload = (imageUrl) => {
    // For now, just insert the image URL as text to test
    const newValue = value + `<img src="${imageUrl}" alt="Uploaded Image" style="max-width: 100%;" /><br/>`;
    onChange(newValue);
    setShowImageUpload(false);
  };

  return (
    <div className="rich-text-editor">
      <div style={{ marginBottom: '10px', padding: '10px', background: '#f0f0f0', borderRadius: '5px' }}>
        <strong>Toolbar should appear below. Look for the image icon (mountain shape) in the toolbar.</strong>
      </div>
      
      <ReactQuill
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        theme="snow"
      />
      
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

      {/* Manual Image Upload Button */}
      <div style={{ marginTop: '10px', textAlign: 'center' }}>
        <button 
          type="button"
          onClick={() => setShowImageUpload(true)}
          className="btn btn-primary"
          style={{ margin: '10px 0' }}
        >
          📷 Upload Image (Manual Button)
        </button>
        <p><small>If you don't see the image icon in the toolbar above, use this button instead.</small></p>
      </div>
    </div>
  );
};

export default RichTextEditor;
