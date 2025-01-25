import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSpots, setLoading, setError } from "../redux/slices/spotSlice";
import SpotCard from "../components/SpotCard";

const SpotList = () => {
    const dispatch = useDispatch();
    const { spots, loading, error } = useSelector((state) => state.spot);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchSpots = async () => {
            dispatch(setLoading(true));
            try {
                const response = await fetch("/api/spots");
                const data = await response.json();
                dispatch(setSpots(data));
            } catch (err) {
                dispatch(setError("Failed to fetch spots"));
            } finally {
                dispatch(setLoading(false));
            }
        };

        fetchSpots();
    }, [dispatch]);

    const filteredSpots = spots.filter(
        (spot) =>
            spot.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
            spot.spotSize.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mx-auto p-4">
            {/* Search Bar */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search by location or size..."
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Loading/Error State */}
            {loading && <p className="text-center text-gray-500">Loading...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}

            {/* Spot List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSpots.length > 0 ? (
                    filteredSpots.map((spot) => <SpotCard key={spot._id} spot={spot} />)
                ) : (
                    <p className="text-center text-gray-500 col-span-full">No spots found</p>
                )}
            </div>
        </div>
    );
};

export default SpotList;
