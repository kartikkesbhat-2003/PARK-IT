import React, { useRef, useState } from "react";
import { Wrapper } from "./Wrapper";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import useOnClickOutside from "../../../hooks/useOnClickOutside";
import { LogOut, User, FileText, MapPin, Book } from "lucide-react"; // Importing icons
import { logout } from "../../../services/operations/authAPI";

export const Navbar = () => {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const ref = useRef(null);

  const [open, setOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [documentType, setDocumentType] = useState("");
  const [documentId, setDocumentId] = useState("");

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("Document Type:", documentType);
    console.log("Document ID:", documentId);
    setShowForm(false); // Close the form after submission
  };

  // Close dropdown when clicking outside
  useOnClickOutside(ref, () => setOpen(false));

  return (
    <>
      <nav
        className={`w-full h-[70px] md:h-[80px] bg-white flex items-center justify-between z-20 fixed top-0 left-0 right-0 transition-transform duration-300 border-b border-black/[0.1]`}
      >
        <Wrapper className={`h-[70px] flex justify-between items-center`}>
          {/* Logo */}
          <div className="flex flex-col items-start">
            <Link to="/">
              <h2 className="text-3xl font-extrabold leading-tight text-black sm:text-3xl lg:text-3xl">
                Park-It
              </h2>
            </Link>
          </div>

          {/* User Actions */}
          <div>
            {user && user?.accountType === "User" && (
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
                ref={ref}
              >
                <div
                  className={`rounded-full border ${user?.status === "Verified"
                      ? "text-green-500 border-green-500"
                      : user?.status === "Pending"
                        ? "text-yellow-500 border-yellow-500"
                        : "text-red-500 border-red-500"
                    }`}
                >
                  {user?.status === "Unverified" ? (
                    <button
                      className="text-red-400 py px-2 rounded-full "
                      onClick={() => setShowForm(true)}
                    >
                      Verify Now
                    </button>
                  ) : user?.status === "Pending" ? (
                    "Pending Verification"
                  ) : (
                    "Verified"
                  )}
                </div>

                {showForm && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-4 rounded shadow-lg w-80">
                      <h2 className="text-lg font-bold mb-4">Upload Documents</h2>
                      <form onSubmit={handleFormSubmit}>
                        <div className="mb-4">
                          <label className="block text-gray-700 font-bold mb-2">
                            Document Type
                          </label>
                          <input
                            type="text"
                            value={documentType}
                            onChange={(e) => setDocumentType(e.target.value)}
                            className="w-full border p-2 rounded"
                            required
                          />
                        </div>
                        <div className="mb-4">
                          <label className="block text-gray-700 font-bold mb-2">
                            Document ID
                          </label>
                          <input
                            type="text"
                            value={documentId}
                            onChange={(e) => setDocumentId(e.target.value)}
                            className="w-full border p-2 rounded"
                            required
                          />
                        </div>
                        <div className="flex justify-end">
                          <button
                            type="button"
                            className="bg-gray-500 text-white py-1 px-3 rounded mr-2 hover:bg-gray-600"
                            onClick={() => setShowForm(false)}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
                          >
                            Submit
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {/* Parking Spot Icon */}
                <div
                  onClick={() => navigate("/spots")}
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "40px",
                    height: "40px",
                    backgroundColor: "#f0f0f0",
                    borderRadius: "50%",
                    border: "2px solid #ccc",
                  }}
                  title="Go to Parking Spots"
                >
                  <MapPin size={24} />
                </div>

                {/* Profile Photo */}
                <img
                  onClick={() => setOpen((prev) => !prev)}
                  src={user.image || "/path-to-default-avatar.png"} // Fallback for default avatar
                  alt="Profile"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid #ccc",
                  }}
                  title="Profile Photo"
                />

                {/* Dropdown */}
                {open && (
                  <div
                    className="absolute top-16 right-8 z-[1000] shadow-md rounded-md border border-gray-200 bg-white w-56"
                    onClick={(e) => e.stopPropagation()} // Prevent closing on inner clicks
                  >
                    {/* User Info */}
                    <div className="p-4 text-sm text-gray-800 border-b border-gray-200">
                      <h1 className="font-medium">{user?.fullName}</h1>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>

                    {/* Links */}
                    <Link
                      to="/dashboard/my-profile"
                      onClick={() => setOpen(false)}
                    >
                      <div className="flex items-center gap-x-2 py-2 px-4 text-sm text-gray-700 hover:bg-gray-100">
                        <User className="text-gray-500" />
                        <span>My Profile</span>
                      </div>
                    </Link>
                    <Link
                      to="/dashboard/my-parking-spots"
                      onClick={() => setOpen(false)}
                    >
                      <div className="flex items-center gap-x-2 py-2 px-4 text-sm text-gray-700 hover:bg-gray-100">
                        <MapPin className="text-gray-500" />
                        <span>My Parking Spots</span>
                      </div>
                    </Link>
                    <Link
                      to="/dashboard/my-bookings"
                      onClick={() => setOpen(false)}
                    >
                      <div className="flex items-center gap-x-2 py-2 px-4 text-sm text-gray-700 hover:bg-gray-100">
                        <Book className="text-gray-500" />
                        <span>My Bookings</span>
                      </div>
                    </Link>

                    

                    {/* Logout */}
                    <div
                      onClick={() => {
                        dispatch(logout(navigate));
                        setOpen(false);
                      }}
                      className="flex items-center gap-x-2 py-2 px-4 text-sm text-gray-700 cursor-pointer hover:bg-gray-100 border-t border-gray-200"
                    >
                      <LogOut className="text-gray-500" />
                      <span>Logout</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Auth Actions */}
            {!token && (
              <>
                <Link to="/signup">
                  <button className="border border-gray-300 bg-white text-gray-800 px-4 py-2 text-sm transition-transform duration-200 hover:bg-gray-100 hover:scale-105">
                    Sign up
                  </button>
                </Link>
              </>
            )}
          </div>
        </Wrapper>
      </nav>

      {/* Push the content below the navbar */}
      <div className="h-[70px] md:h-[80px]" />
    </>
  );
};