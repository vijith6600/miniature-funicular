import React, { useState } from "react";
import axios from "axios";
import "./App.css";


const baseurl = "https://pdf-merge-9l6l.onrender.com"


const App = () => {
  const [file, setFile] = useState(null);
  const [selectedPages, setSelectedPages] = useState([]);
  const [uploadedFilename, setUploadedFilename] = useState(null);
  const [extractedFilename, setExtractedFilename] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    console.log(selectedFile);
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        `${baseurl}/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setUploadedFilename(response.data.filename);
    } catch (error) {
      console.error("File upload error:", error.message);
    }
  };

  const handleExtract = async () => {
    try {
      const response = await axios.post(`${baseurl}/extract`, {
        filename: uploadedFilename,
        selectedPages,
      });

      setExtractedFilename(response.data.filename);
    } catch (error) {
      console.error("PDF extraction error:", error.message);
    }
  };

  return (
    <div className="homepage">
      <h1>PDF Extraction App</h1>

      <input type="file" accept=".pdf" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!file}>
        Upload PDF
      </button>

      {uploadedFilename && (
        <div>
          <h2>Uploaded PDF: {uploadedFilename}</h2>
          <p>Select pages to extract:</p>
          {[...Array(9).keys()].map((pageNum) => (
            <label key={pageNum}>
              <input
                type="checkbox"
                value={pageNum + 1}
                onChange={(e) => {
                  const page = parseInt(e.target.value, 10);
                  console.log(page);
                  setSelectedPages((prevSelected) =>
                    e.target.checked
                      ? [...prevSelected, page]
                      : prevSelected.filter((p) => p !== page)
                  );
                }}
              />
              Page {pageNum + 1}
            </label>
          ))}

          <button onClick={handleExtract} disabled={selectedPages.length === 0}>
            Extract Pages
          </button>

          {extractedFilename && (
            <div>
              <h3>Extracted PDF: {extractedFilename}</h3>
              <iframe
                title="Extracted PDF"
                src={`${baseurl}/pdf/${extractedFilename}`}
                width="50%"
                height="600px"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
