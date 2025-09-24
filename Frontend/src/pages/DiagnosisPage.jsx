import React, { useState } from "react";
import { motion } from "framer-motion";

const DiagnosisPage = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [environmentData, setEnvironmentData] = useState({
    location: "",
    temp: "",
    humidity: "",
    soil_status: "",
    weather: "",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Function to handle image upload
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const img = e.target.files[0];
      setUploadedImage({
        file: img,
        preview: URL.createObjectURL(img),
      });
    }
  };

  // Function to handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Function to handle drop event
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const img = e.dataTransfer.files[0];
      setUploadedImage({
        file: img,
        preview: URL.createObjectURL(img),
      });
    }
  };

  // Function to handle input change for environment data
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEnvironmentData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Function to parse Markdown content instead of LaTeX
  const parseMarkdown = (markdownContent) => {
    if (!markdownContent) return <p>No treatment information available.</p>;

    // Simple markdown parsing - convert headers, bold, lists, etc.
    const htmlContent = markdownContent
      // Headers
      .replace(
        /^### (.*$)/gim,
        '<h3 class="text-xl font-bold text-gray-800 mt-6 mb-3">$1</h3>'
      )
      .replace(
        /^## (.*$)/gim,
        '<h2 class="text-2xl font-bold text-gray-800 mt-8 mb-4">$1</h2>'
      )
      .replace(
        /^# (.*$)/gim,
        '<h1 class="text-3xl font-bold text-gray-900 mt-10 mb-5">$1</h1>'
      )
      // Bold
      .replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>")
      // Italic
      .replace(/\*(.*?)\*/gim, "<em>$1</em>")
      // Lists
      .replace(/^\- (.*$)/gim, '<li class="ml-6 mb-2">$1</li>')
      .replace(/^\* (.*$)/gim, '<li class="ml-6 mb-2">$1</li>')
      .replace(/^\d+\. (.*$)/gim, '<li class="ml-6 mb-2 list-decimal">$1</li>')
      // Paragraphs
      .replace(/^\s*$/gim, '</p><p class="my-4">');

    // Ensure all list items are properly wrapped in ul/ol
    let formattedHtml = htmlContent;

    // Wrap the content in a paragraph if it doesn't start with a header or list
    if (!formattedHtml.startsWith("<h") && !formattedHtml.startsWith("<li")) {
      formattedHtml = `<p class="my-4">${formattedHtml}</p>`;
    }

    return (
      <div
        className="prose prose-green max-w-none prose-headings:text-primary-700"
        dangerouslySetInnerHTML={{ __html: formattedHtml }}
      />
    );
  };

  // Function to handle base64 image data
  const getImageSource = (imageData) => {
    if (!imageData)
      return "https://placehold.co/600x400/green/white?text=No+Reference+Image";

    // Check if the string is already a data URL or a URL
    if (imageData.startsWith("data:") || imageData.startsWith("http")) {
      return imageData;
    }

    // Otherwise, assume it's a raw base64 string and add the prefix
    try {
      return `data:image/jpeg;base64,${imageData}`;
    } catch (e) {
      console.error("Error processing image data:", e);
      return "https://placehold.co/600x400/green/white?text=Invalid+Image+Data";
    }
  };

  // Function to submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!uploadedImage) {
      alert("Please upload an image");
      return;
    }

    setLoading(true);

    try {
      // Create form data
      const formData = new FormData();
      formData.append("image", uploadedImage.file);

      // Create a single env_data JSON object as expected by the backend
      const env_data = {
        location: environmentData.location || null,
        temp: environmentData.temp ? Number(environmentData.temp) : null,
        humidity: environmentData.humidity
          ? Number(environmentData.humidity)
          : null,
        soil_status: environmentData.soil_status || null,
        weather: environmentData.weather || null,
      };

      // Convert env_data to a JSON string and append it to formData
      formData.append("env_data", JSON.stringify(env_data));

      // Log what's being sent for debugging
      console.log("Sending form data:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      // Send request to backend API
      const response = await fetch("http://127.0.0.1:8000/diagnose", {
        method: "POST",
        body: formData,
      });

      // Get the detailed error response if available
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error ${response.status}: ${errorText}`);

        try {
          // Try to parse as JSON for more detailed error info
          const errorJson = JSON.parse(errorText);
          throw new Error(`Server error: ${JSON.stringify(errorJson)}`);
        } catch (e) {
          // If not JSON or other error
          throw new Error(
            `Network error: ${response.status} - ${
              errorText || response.statusText
            }`
          );
        }
      }
      console.log(response);

      const data = await response.json();
      console.log(data);

      // Adapt the response structure to match what our UI expects
      const adaptedResult = {
        prediction: data.prediction,
        remedies: data.remedy || "No treatment information available.",
        explanation_img: data.explanation_img,
      };

      setResult(adaptedResult);
    } catch (error) {
      console.error("Error:", error);
      alert(`Error processing request: ${error.message}`);

      // For testing: Mock response with markdown
      setResult({
        prediction: {
          disease: "Late Blight",
          severity: "High",
          confidence: 0.985,
        },
        remedies:
          "## Treatment for Late Blight\n\n* Apply fungicide with active ingredient copper sulfate.\n* Remove affected plant parts immediately.\n* Half cup of baking soda in 1 gallon of water can be used as a preventative spray.",
        explanation_img:
          "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/...",
      });
    } finally {
      setLoading(false);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // Weather options
  const weatherOptions = [
    { value: "sunny", label: "Sunny", icon: "☀️" },
    { value: "cloudy", label: "Cloudy", icon: "☁️" },
    { value: "rainy", label: "Rainy", icon: "🌧️" },
    { value: "stormy", label: "Stormy", icon: "⛈️" },
    { value: "foggy", label: "Foggy", icon: "🌫️" },
  ];

  // Soil status options
  const soilOptions = [
    { value: "dry", label: "Dry" },
    { value: "moist", label: "Moist" },
    { value: "wet", label: "Wet" },
    { value: "waterlogged", label: "Waterlogged" },
    { value: "cracked", label: "Cracked" },
  ];

  return (
    <motion.div
      className="min-h-screen bg-gray-50 py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="container-custom">
        <motion.h1
          className="text-4xl md:text-5xl font-bold mb-4 text-center text-gray-900"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Plant Disease Diagnosis
        </motion.h1>

        <motion.p
          className="text-lg text-center text-gray-600 mb-10 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Upload a photo of your plant and provide environmental details for an
          accurate diagnosis
        </motion.p>

        {!result ? (
          <motion.div
            className="max-w-4xl mx-auto"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
              {/* Progress Steps */}
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <div className="flex justify-between">
                  <div
                    className={`flex flex-col items-center ${
                      currentStep >= 1 ? "text-primary-600" : "text-gray-400"
                    }`}
                    onClick={() => uploadedImage && setCurrentStep(1)}
                  >
                    <div
                      className={`w-8 h-8 flex items-center justify-center rounded-full ${
                        currentStep >= 1
                          ? "bg-primary-600 text-white"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      1
                    </div>
                    <span className="text-sm mt-1">Upload Image</span>
                  </div>

                  <div
                    className={`flex-1 border-t-2 self-center mx-4 ${
                      currentStep >= 2
                        ? "border-primary-500"
                        : "border-gray-200"
                    }`}
                  ></div>

                  <div
                    className={`flex flex-col items-center ${
                      currentStep >= 2 ? "text-primary-600" : "text-gray-400"
                    }`}
                    onClick={() => uploadedImage && setCurrentStep(2)}
                  >
                    <div
                      className={`w-8 h-8 flex items-center justify-center rounded-full ${
                        currentStep >= 2
                          ? "bg-primary-600 text-white"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      2
                    </div>
                    <span className="text-sm mt-1">Environment Details</span>
                  </div>
                </div>
              </div>

              <form
                onSubmit={handleSubmit}
                onDragEnter={handleDrag}
                className="p-6"
              >
                {/* Step 1: Upload Image */}
                <motion.div
                  className={`${currentStep === 1 ? "block" : "hidden"}`}
                  variants={fadeIn}
                >
                  <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                    Upload Plant Image
                  </h2>

                  <motion.div
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                      dragActive
                        ? "border-primary-500 bg-primary-50"
                        : "border-gray-300 hover:border-primary-400 hover:bg-gray-50"
                    }`}
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    whileHover={{ scale: 1.01 }}
                    variants={fadeIn}
                  >
                    <input
                      type="file"
                      id="image-upload"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />

                    {!uploadedImage ? (
                      <label
                        htmlFor="image-upload"
                        className="cursor-pointer block py-8"
                      >
                        <motion.svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-16 w-16 mx-auto text-gray-400 mb-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          transition={{
                            duration: 0.5,
                            repeat: Infinity,
                            repeatType: "reverse",
                          }}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </motion.svg>
                        <p className="text-gray-600 text-lg mb-2">
                          Drag and drop your image here, or click to browse
                        </p>
                        <p className="text-sm text-gray-500">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </label>
                    ) : (
                      <div className="py-4">
                        <motion.div
                          className="relative w-full h-64 mb-6 rounded-lg overflow-hidden"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <img
                            src={uploadedImage.preview}
                            alt="Preview"
                            className="w-full h-full object-contain rounded"
                          />
                        </motion.div>
                        <div className="flex justify-center gap-4">
                          <label
                            htmlFor="image-upload"
                            className="btn px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                          >
                            Change Image
                          </label>
                          <button
                            type="button"
                            className="btn px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                            onClick={() => setUploadedImage(null)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>

                  <motion.div className="mt-8 text-right" variants={fadeIn}>
                    <motion.button
                      type="button"
                      className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => setCurrentStep(2)}
                      disabled={!uploadedImage}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Next: Environment Details
                    </motion.button>
                  </motion.div>
                </motion.div>

                {/* Step 2: Environmental Data */}
                <motion.div
                  className={`${currentStep === 2 ? "block" : "hidden"}`}
                  variants={fadeIn}
                >
                  <div className="flex items-center mb-6">
                    <button
                      type="button"
                      className="mr-4 text-primary-600 hover:text-primary-800"
                      onClick={() => setCurrentStep(1)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <h2 className="text-2xl font-semibold text-gray-800">
                      Environmental Details
                    </h2>
                  </div>

                  <p className="text-gray-600 mb-8">
                    Providing accurate environmental details helps our system
                    make a more precise diagnosis.
                  </p>

                  <motion.div
                    className="grid md:grid-cols-2 gap-6"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                  >
                    <motion.div variants={fadeIn}>
                      <label
                        htmlFor="location"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Location
                      </label>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={environmentData.location}
                        onChange={handleInputChange}
                        placeholder="e.g., Mumbai, Maharashtra"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </motion.div>

                    <motion.div variants={fadeIn}>
                      <label
                        htmlFor="temp"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Temperature (°C)
                      </label>
                      <input
                        type="number"
                        id="temp"
                        name="temp"
                        value={environmentData.temp}
                        onChange={handleInputChange}
                        placeholder="e.g., 25"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </motion.div>

                    <motion.div variants={fadeIn}>
                      <label
                        htmlFor="humidity"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Humidity (%)
                      </label>
                      <input
                        type="number"
                        id="humidity"
                        name="humidity"
                        value={environmentData.humidity}
                        onChange={handleInputChange}
                        placeholder="e.g., 60"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </motion.div>

                    <motion.div variants={fadeIn}>
                      <label
                        htmlFor="soil_status"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Soil Status
                      </label>
                      <div className="grid grid-cols-3 gap-2 mt-1">
                        {soilOptions.map((option) => (
                          <motion.div
                            key={option.value}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() =>
                              setEnvironmentData((prev) => ({
                                ...prev,
                                soil_status: option.value,
                              }))
                            }
                            className={`cursor-pointer border rounded-lg p-2 text-center transition-colors ${
                              environmentData.soil_status === option.value
                                ? "bg-primary-100 border-primary-500 text-primary-700"
                                : "border-gray-300 hover:border-gray-400"
                            }`}
                          >
                            {option.label}
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>

                    <motion.div variants={fadeIn} className="md:col-span-2">
                      <label
                        htmlFor="weather"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Weather Condition
                      </label>
                      <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mt-1">
                        {weatherOptions.map((option) => (
                          <motion.div
                            key={option.value}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() =>
                              setEnvironmentData((prev) => ({
                                ...prev,
                                weather: option.value,
                              }))
                            }
                            className={`cursor-pointer border rounded-lg p-3 text-center transition-colors ${
                              environmentData.weather === option.value
                                ? "bg-primary-100 border-primary-500 text-primary-700"
                                : "border-gray-300 hover:border-gray-400"
                            }`}
                          >
                            <div className="text-2xl mb-1">{option.icon}</div>
                            <div className="text-sm">{option.label}</div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </motion.div>

                  <motion.div
                    className="mt-10 flex justify-end"
                    variants={fadeIn}
                  >
                    <motion.button
                      type="submit"
                      className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center"
                      disabled={loading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {loading ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Analyzing Plant...
                        </>
                      ) : (
                        <>
                          Get Diagnosis
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 ml-2"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </>
                      )}
                    </motion.button>
                  </motion.div>
                </motion.div>
              </form>
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
              <div className="px-6 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white flex justify-between items-center">
                <motion.h2
                  className="text-2xl font-bold"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Diagnosis Results
                </motion.h2>
                <motion.button
                  onClick={() => setResult(null)}
                  className="bg-white text-primary-700 px-4 py-1 rounded-full text-sm hover:bg-gray-100 transition-colors"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  New Diagnosis
                </motion.button>
              </div>

              <div className="p-6">
                <motion.div
                  className="grid md:grid-cols-2 gap-6 mb-8"
                  initial="hidden"
                  animate="visible"
                  variants={staggerContainer}
                >
                  <motion.div
                    variants={fadeIn}
                    className="rounded-lg overflow-hidden shadow-md border border-gray-200"
                  >
                    <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                      <h3 className="font-medium text-gray-700">
                        Uploaded Image
                      </h3>
                    </div>
                    <div className="h-64 p-4">
                      <img
                        src={uploadedImage.preview}
                        alt="Uploaded plant"
                        className="w-full h-full object-contain rounded"
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    variants={fadeIn}
                    className="rounded-lg overflow-hidden shadow-md border border-gray-200"
                  >
                    <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                      <h3 className="font-medium text-gray-700">
                        Reference Image
                      </h3>
                    </div>
                    <div className="h-64 p-4">
                      {result.explanation_img ? (
                        <img
                          src={getImageSource(result.explanation_img)}
                          alt="Disease reference"
                          className="w-full h-full object-contain rounded"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://placehold.co/600x400/green/white?text=No+Reference+Image";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded">
                          <p className="text-gray-500 text-center">
                            No reference image available
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </motion.div>

                <motion.div
                  className="p-6 mb-8 bg-green-50 border border-green-100 rounded-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-green-800">
                      Diagnosis Result
                    </h3>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="text-sm text-green-600 font-medium mb-1">
                        Disease
                      </h4>
                      <motion.p
                        className="text-xl font-bold text-gray-900"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                      >
                        {result.prediction.disease}
                      </motion.p>
                    </div>

                    <div>
                      <h4 className="text-sm text-green-600 font-medium mb-1">
                        Severity
                      </h4>
                      <motion.div
                        className="flex items-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                      >
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                            result.prediction.severity === "High"
                              ? "bg-red-100 text-red-800"
                              : result.prediction.severity === "Medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {result.prediction.severity}
                        </span>
                      </motion.div>
                    </div>

                    <div>
                      <h4 className="text-sm text-green-600 font-medium mb-1">
                        Confidence
                      </h4>
                      <div>
                        <motion.div
                          className="flex items-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.8 }}
                        >
                          <span className="text-xl font-bold text-gray-900 mr-2">
                            {result.prediction.confidence.toFixed(5) * 100}%
                          </span>
                        </motion.div>
                        <motion.div
                          className="w-full bg-gray-200 rounded-full h-2 mt-2"
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ delay: 0.9, duration: 0.8 }}
                        >
                          <motion.div
                            className="bg-green-600 h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{
                              width: `${result.prediction.confidence * 100}%`,
                            }}
                            transition={{ delay: 0.9, duration: 1 }}
                          />
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="rounded-xl overflow-hidden border border-gray-200"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Recommended Treatment
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="prose prose-green max-w-none">
                      {parseMarkdown(result.remedies)}
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <h4 className="text-sm font-medium text-gray-500 mb-2">
                        Environmental Details Provided
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                        <div>
                          <span className="block text-xs text-gray-500">
                            Location
                          </span>
                          <span className="font-medium">
                            {environmentData.location || "Not provided"}
                          </span>
                        </div>
                        <div>
                          <span className="block text-xs text-gray-500">
                            Temperature
                          </span>
                          <span className="font-medium">
                            {environmentData.temp
                              ? `${environmentData.temp}°C`
                              : "Not provided"}
                          </span>
                        </div>
                        <div>
                          <span className="block text-xs text-gray-500">
                            Humidity
                          </span>
                          <span className="font-medium">
                            {environmentData.humidity
                              ? `${environmentData.humidity}%`
                              : "Not provided"}
                          </span>
                        </div>
                        <div>
                          <span className="block text-xs text-gray-500">
                            Soil Status
                          </span>
                          <span className="font-medium capitalize">
                            {environmentData.soil_status || "Not provided"}
                          </span>
                        </div>
                        <div>
                          <span className="block text-xs text-gray-500">
                            Weather
                          </span>
                          <span className="font-medium capitalize">
                            {environmentData.weather || "Not provided"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default DiagnosisPage;
