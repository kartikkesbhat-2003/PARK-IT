import React from 'react'
import { SearchCheck, BookmarkCheck, SquareParking } from "lucide-react";
import curvedDottedLine from "../../../assets/curvedDottedLine.svg";

export const HowItWorks = () => {
    return (
        <section className="py-0 bg-[#1A1C1D] sm:py-16 lg:py-8 ">
          <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold leading-tight text-gray-200 sm:text-4xl lg:text-5xl">
                How does it work?
              </h2>
              <p className="max-w-lg mx-auto mt-4 text-gray-400 text-lg leading-8">
                Effortlessly upload, manage, and organize your parking details with ease using our user-friendly PARK-IT platform.
              </p>
            </div>
    
            <div className="relative mt-12 lg:mt-20">
              <div className="absolute inset-x-0 hidden xl:px-44 top-2 md:block md:px-20 lg:px-28">
                <img
                  className="w-full"
                  src={curvedDottedLine}
                  width={1000}
                  height={1000}
                  alt="svg"
                />
              </div>
    
              <div className="relative grid grid-cols-1 text-center gap-y-12 md:grid-cols-3 gap-x-12">
                <div>
                  <div className="flex items-center justify-center w-16 h-16 mx-auto bg-[#2E3333] border-2 border-gray-600 rounded-full shadow">
                    <span className="text-xl font-semibold text-gray-300">
                      <SearchCheck className="h-7 w-7 text-indigo-500" />
                    </span>
                  </div>
                  <h3 className="mt-6 text-xl font-semibold leading-tight text-gray-200 md:mt-10">
                    Search
                  </h3>
                  <p className="mt-4 text-base text-gray-400">
                    Easily find available parking spaces nearby or at your destination, tailored to your timing and preferences.
                  </p>
                </div>
    
                <div>
                  <div className="flex items-center justify-center w-16 h-16 mx-auto bg-[#2E3333] border-2 border-gray-600 rounded-full shadow">
                    <span className="text-xl font-semibold text-gray-300">
                      <BookmarkCheck className="h-7 w-7 text-indigo-500" />
                    </span>
                  </div>
                  <h3 className="mt-6 text-xl font-semibold leading-tight text-gray-200 md:mt-10">
                    Book
                  </h3>
                  <p className="mt-4 text-base text-gray-400">
                    Secure your spot in advance with a quick booking process, ensuring hassle-free parking when you arrive.
                  </p>
                </div>
    
                <div>
                  <div className="flex items-center justify-center w-16 h-16 mx-auto bg-[#2E3333] border-2 border-gray-600 rounded-full shadow">
                    <span className="text-xl font-semibold text-gray-300">
                      <SquareParking className="h-7 w-7 text-indigo-500" />
                    </span>
                  </div>
                  <h3 className="mt-6 text-xl font-semibold leading-tight text-gray-200 md:mt-10">
                    Park
                  </h3>
                  <p className="mt-4 text-base text-gray-400">
                    Secure your spot in advance with a quick booking process, ensuring hassle-free parking when you arrive.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
    );
}
