import { CloudUpload } from "lucide-react";
import { Store } from "lucide-react";
import { SquareMenu } from "lucide-react";
import { Clock } from "lucide-react";
import { CircleDollarSign } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

export const ParkItFeatures = () => {
    return (
        <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-[#1A1C1D] to-[#2B2F3A]">
            <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 mt-12">
                <div className="mx-auto text-center">
                    <h2 className="text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
                        Revolutionize Your Parking Experience
                    </h2>
                    <p className="max-w-lg mx-auto mt-4 text-lg leading-8 text-gray-300">
                        Effortlessly explore, reserve, and manage your parking spaces with ease using our intuitive platform.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 mt-10 sm:mt-16 lg:mt-24">
                    {/* Find Nearby Parking Spaces */}
                    <div className="p-4 md:p-8 lg:p-10 transition-all hover:bg-indigo-700 rounded-lg shadow-md bg-[#1A1C1D] flex flex-col items-center text-center">
                        <div className="flex items-center justify-center w-16 h-16 mx-auto bg-indigo-500 text-white rounded-full shadow">
                            <Store className="h-7 w-7" />
                        </div>
                        <h3 className="mt-8 text-xl font-bold text-gray-200">Find Nearby Parking Spaces</h3>
                        <p className="mt-4 text-gray-300">
                            Locate available parking spots around you based on your location and preferences. Say goodbye to the hassle of searching for parking on busy days.
                        </p>
                    </div>

                    {/* Secure Booking */}
                    <div className="p-4 md:p-8 lg:p-10 transition-all hover:bg-indigo-700 rounded-lg shadow-md bg-[#1A1C1D] flex flex-col items-center text-center">
                        <div className="flex items-center justify-center w-16 h-16 mx-auto bg-indigo-500 text-white rounded-full shadow">
                            <CloudUpload className="h-7 w-7" />
                        </div>
                        <h3 className="mt-8 text-xl font-bold text-gray-200">Secure Booking</h3>
                        <p className="mt-4 text-gray-300">
                            Reserve your parking with confidence through secure booking. Your reservations are protected and visible only to you.
                        </p>
                    </div>

                    {/* Customizable Parking Options */}
                    <div className="p-4 md:p-8 lg:p-10 transition-all hover:bg-indigo-700 rounded-lg shadow-md bg-[#1A1C1D] flex flex-col items-center text-center">
                        <div className="flex items-center justify-center w-16 h-16 mx-auto bg-indigo-500 text-white rounded-full shadow">
                            <SquareMenu className="h-7 w-7" />
                        </div>
                        <h3 className="mt-8 text-xl font-bold text-gray-200">Customizable Parking Options</h3>
                        <p className="mt-4 text-gray-300">
                            Select your preferred parking duration and amenities for a personalized experience. Park comfortably, just the way you need.
                        </p>
                    </div>


                    {/* Instant Notifications */}
                    <div className="p-4 md:p-8 lg:p-10 transition-all hover:bg-indigo-700 rounded-lg shadow-md bg-[#1A1C1D] flex flex-col items-center text-center">
                        <div className="flex items-center justify-center w-16 h-16 mx-auto bg-indigo-500 text-white rounded-full shadow">
                            <FaWhatsapp className="h-7 w-7" />
                        </div>
                        <h3 className="mt-8 text-xl font-bold text-gray-200">Instant Notifications</h3>
                        <p className="mt-4 text-gray-300">
                            Receive real-time updates about your booking via app notifications. Track your parking status without needing to navigate away.
                        </p>
                    </div>

                    {/* Flexible Payment Options */}
                    <div className="p-4 md:p-8 lg:p-10 transition-all hover:bg-indigo-700 rounded-lg shadow-md bg-[#1A1C1D] flex flex-col items-center text-center">
                        <div className="flex items-center justify-center w-16 h-16 mx-auto bg-indigo-500 text-white rounded-full shadow">
                            <CircleDollarSign className="h-7 w-7" />
                        </div>
                        <h3 className="mt-8 text-xl font-bold text-gray-200">Flexible Payment Options</h3>
                        <p className="mt-4 text-gray-300">
                            Choose from various payment methods for a smooth transaction experience. Pay securely and conveniently for your parking spot.
                        </p>
                    </div>

                    {/* Live Booking Tracking */}
                    <div className="p-4 md:p-8 lg:p-10 transition-all hover:bg-indigo-700 rounded-lg shadow-md bg-[#1A1C1D] flex flex-col items-center text-center">
                        <div className="flex items-center justify-center w-16 h-16 mx-auto bg-indigo-500 text-white rounded-full shadow">
                            <Clock className="h-7 w-7" />
                        </div>
                        <h3 className="mt-8 text-xl font-bold text-gray-200">Live Booking Tracking</h3>
                        <p className="mt-4 text-gray-300">
                            Stay updated on your parking reservations with real-time tracking. Monitor your booking status from reservation to completion.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};