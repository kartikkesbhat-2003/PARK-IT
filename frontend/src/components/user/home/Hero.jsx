import React from 'react'
import { Link } from 'react-router-dom'
import { MoveRight } from "lucide-react";

export const Hero = () => {
    return (
        <div
          className="min-h-[calc(100vh-70px)] md:min-h-[calc(100vh-80px)]
         relative isolate bg-[#1A1C1D] px-6 pt-2 lg:px-8 "
        >
          
          <div className="max-w-2xl py-32 mx-auto sm:py-32 lg:py-28">
            <div className="hidden sm:mb-8 sm:flex sm:justify-center"></div>
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-200 sm:text-6xl">
                Your Parking Solution, Just a Tap Away.
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-400">
                Discover our innovative parking management solution, designed to simplify hosting and renting personal parking spaces, redefining convenience in the parking industry.
              </p>
              <div className="flex items-center justify-center mt-10 gap-x-6">
                <Link to={"/spots"}>
                  <div className="px-12 py-3 rounded-full bg-[#2E3333] text-white tracking-wide text-[16px] flex items-center gap-2 border-2 border-gray-600">
                    Explore Now
                    <MoveRight size={20} />
                  </div>
                </Link>
              </div>
            </div>
          </div>
          <div
            className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
            aria-hidden="true"
          >
            <div
              className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            />
          </div>
        </div>
      );
}
