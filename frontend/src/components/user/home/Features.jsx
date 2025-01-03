import { CloudUpload } from "lucide-react";
import { Store } from "lucide-react";
import { SquareMenu } from "lucide-react";
import { Clock } from "lucide-react";
import { CircleDollarSign } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

export const ParkItFeatures = () => {
    return (
        <section className="py-12  sm:py-16 lg:py-20  mt-12 bg-black/[0.03]">
            <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 ">
                <div className="mx-auto text-center ">
                    <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl">
                        Revolutionize Your Parking Experience
                    </h2>
                    <p className="max-w-lg mx-auto mt-4 text-lg leading-8 text-gray-600 ">
                        Effortlessly explore, reserve, and manage your parking spaces with ease using our intuitive platform.
                    </p>
                </div>

                <div className="grid grid-cols-1 mt-10 text-center sm:mt-16 sm:grid-cols-2 sm:gap-x-12 gap-y-12 md:grid-cols-3 md:gap-0 xl:mt-24">
                    <div className="p-4 transition-all md:p-8 lg:p-14 hover:bg-indigo-50 ">
                        <div className="flex items-center justify-center w-16 h-16 mx-auto bg-white border-2 border-gray-200 rounded-full shadow">
                            <span className="text-xl font-semibold text-gray-700">
                                {" "}
                                <Store className="text-indigo-500 h-7 w-7" />{" "}
                            </span>
                        </div>
                        <h3 className="mt-12 text-xl font-bold text-gray-900 font-pj">
                            Find Nearby Parking Spaces
                        </h3>
                        <p className="mt-5 text-base text-gray-600 font-pj">
                            Locate available parking spots around you based on your location and preferences. Say goodbye to the hassle of searching for parking on busy days.
                        </p>
                    </div>

                    <div className="p-4 transition-all md:p-8 lg:p-14 md:border-l md:border-gray-200 hover:bg-indigo-50">
                        <div className="flex items-center justify-center w-16 h-16 mx-auto bg-white border-2 border-gray-200 rounded-full shadow ">
                            <span className="text-xl font-semibold text-gray-700">
                                {" "}
                                <CloudUpload className="text-indigo-500 h-7 w-7" />{" "}
                            </span>
                        </div>
                        <h3 className="mt-12 text-xl font-bold text-gray-900 font-pj">
                            Secure Booking
                        </h3>
                        <p className="mt-5 text-base text-gray-600 font-pj">
                            Reserve your parking with confidence through secure booking. Your reservations are protected and visible only to you.
                        </p>
                    </div>

                    <div className="p-4 transition-all md:p-8 lg:p-14 md:border-l md:border-gray-200 hover:bg-indigo-50">
                        <div className="flex items-center justify-center w-16 h-16 mx-auto bg-white border-2 border-gray-200 rounded-full shadow">
                            <span className="text-xl font-semibold text-gray-700">
                                {" "}
                                <SquareMenu className="text-indigo-500 h-7 w-7" />{" "}
                            </span>
                        </div>
                        <h3 className="mt-12 text-xl font-bold text-gray-900 font-pj">
                            Customizable Parking Options
                        </h3>
                        <p className="mt-5 text-base text-gray-600 font-pj">
                            Select your preferred parking duration and amenities for a personalized experience. Park comfortably, just the way you need.
                        </p>
                    </div>

                    <div className="p-4 transition-all md:p-8 lg:p-14 md:border-t md:border-gray-200 hover:bg-indigo-50 ">
                        <div className="flex items-center justify-center w-16 h-16 mx-auto bg-white border-2 border-gray-200 rounded-full shadow">
                            <span className="text-xl font-semibold text-gray-700">
                                {" "}
                                <FaWhatsapp className="text-indigo-500 h-7 w-7" />{" "}
                            </span>
                        </div>
                        <h3 className="mt-12 text-xl font-bold text-gray-900 font-pj">
                            Instant Notifications
                        </h3>
                        <p className="mt-5 text-base text-gray-600 font-pj">
                            Receive real-time updates about your booking via app notifications. Track your parking status without needing to navigate away.
                        </p>
                    </div>

                    <div className="p-4 transition-all md:p-8 lg:p-14 md:border-l md:border-gray-200 md:border-t hover:bg-indigo-50">
                        <div className="flex items-center justify-center w-16 h-16 mx-auto bg-white border-2 border-gray-200 rounded-full shadow">
                            <span className="text-xl font-semibold text-gray-700">
                                {" "}
                                <CircleDollarSign className="text-indigo-500 h-7 w-7" />{" "}
                            </span>
                        </div>
                        <h3 className="mt-12 text-xl font-bold text-gray-900 font-pj">
                            Flexible Payment Options
                        </h3>
                        <p className="mt-5 text-base text-gray-600 font-pj">
                            Choose from various payment methods for a smooth transaction experience. Pay securely and conveniently for your parking spot.
                        </p>
                    </div>

                    <div className="p-4 transition-all md:p-8 lg:p-14 md:border-l md:border-gray-200 md:border-t hover:bg-indigo-50">
                        <div className="flex items-center justify-center w-16 h-16 mx-auto bg-white border-2 border-gray-200 rounded-full shadow">
                            <span className="text-xl font-semibold text-gray-700">
                                {" "}
                                <Clock className="text-indigo-500 h-7 w-7" />{" "}
                            </span>
                        </div>
                        <h3 className="mt-12 text-xl font-bold text-gray-900 font-pj">
                            Live Booking Tracking
                        </h3>
                        <p className="mt-5 text-base text-gray-600 font-pj">
                            Stay updated on your parking reservations with real-time tracking. Monitor your booking status from reservation to completion.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};
