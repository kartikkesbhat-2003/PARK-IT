import React, { useState } from "react";

export const AddSpots = () => {
  const [formData, setFormData] = useState({
    houseFlat: "",
    streetAddress: "",
    city: "",
    state: "",
    postalCode: "",
    spotLength: "",
    spotWidth: "",
    pricePerHour: "",
    verificationDoc: null,
    spotImage: null,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name } = e.target;
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, [name]: file }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate Address Section
    if (!formData.houseFlat.trim()) newErrors.houseFlat = "House/Flat is required.";
    if (!formData.streetAddress.trim()) newErrors.streetAddress = "Street Address is required.";
    if (!formData.city.trim()) newErrors.city = "City is required.";
    if (!formData.state.trim()) newErrors.state = "State is required.";
    if (!formData.postalCode.trim()) newErrors.postalCode = "Postal/ZIP Code is required.";

    // Validate Spot Details
    if (!formData.spotLength.trim()) newErrors.spotLength = "Spot Length is required.";
    if (!formData.spotWidth.trim()) newErrors.spotWidth = "Spot Width is required.";
    if (!formData.pricePerHour.trim()) newErrors.pricePerHour = "Price per hour is required.";

    // Validate File Uploads
    if (!formData.verificationDoc) newErrors.verificationDoc = "Verification document is required.";
    if (!formData.spotImage) newErrors.spotImage = "Spot image is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    try {
      const response = await fetch("/api/parking-spot", {
        method: "POST",
        body: formDataToSend,
      });

      const result = await response.json();
      if (result.success) {
        alert("Parking spot added successfully!");
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error("Error submitting the form:", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Add Parking Spot</h2>

        {/* Address Section */}
      

        {/* Spot Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Spot Length <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="spotLength"
              value={formData.spotLength}
              onChange={handleChange}
              className={`border ${
                errors.spotLength ? "border-red-500" : "border-gray-300"
              } rounded-md p-2 w-full`}
            />
            {errors.spotLength && <p className="text-red-500 text-sm">{errors.spotLength}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Spot Width <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="spotWidth"
              value={formData.spotWidth}
              onChange={handleChange}
              className={`border ${
                errors.spotWidth ? "border-red-500" : "border-gray-300"
              } rounded-md p-2 w-full`}
            />
            {errors.spotWidth && <p className="text-red-500 text-sm">{errors.spotWidth}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price per Hour <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="pricePerHour"
              value={formData.pricePerHour}
              onChange={handleChange}
              className={`border ${
                errors.pricePerHour ? "border-red-500" : "border-gray-300"
              } rounded-md p-2 w-full`}
            />
            {errors.pricePerHour && <p className="text-red-500 text-sm">{errors.pricePerHour}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Verification Document <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              name="verificationDoc"
              onChange={handleFileChange}
              className="border border-gray-300 rounded-md p-2 w-full"
            />
            {errors.verificationDoc && (
              <p className="text-red-500 text-sm">{errors.verificationDoc}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Spot Image <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              name="spotImage"
              onChange={handleFileChange}
              className="border border-gray-300 rounded-md p-2 w-full"
            />
            {errors.spotImage && <p className="text-red-500 text-sm">{errors.spotImage}</p>}
          </div>
        </div>

        <fieldset className="mb-6">
          <legend className="text-lg font-medium">Address</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                House/Flat <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="houseFlat"
                value={formData.houseFlat}
                onChange={handleChange}
                className={`border ${
                  errors.houseFlat ? "border-red-500" : "border-gray-300"
                } rounded-md p-2 w-full`}
              />
              {errors.houseFlat && <p className="text-red-500 text-sm">{errors.houseFlat}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Street Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="streetAddress"
                value={formData.streetAddress}
                onChange={handleChange}
                className={`border ${
                  errors.streetAddress ? "border-red-500" : "border-gray-300"
                } rounded-md p-2 w-full`}
              />
              {errors.streetAddress && <p className="text-red-500 text-sm">{errors.streetAddress}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={`border ${
                  errors.city ? "border-red-500" : "border-gray-300"
                } rounded-md p-2 w-full`}
              />
              {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className={`border ${
                  errors.state ? "border-red-500" : "border-gray-300"
                } rounded-md p-2 w-full`}
              />
              {errors.state && <p className="text-red-500 text-sm">{errors.state}</p>}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Postal/ZIP Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                className={`border ${
                  errors.postalCode ? "border-red-500" : "border-gray-300"
                } rounded-md p-2 w-full`}
              />
              {errors.postalCode && <p className="text-red-500 text-sm">{errors.postalCode}</p>}
            </div>
          </div>
        </fieldset>

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
};