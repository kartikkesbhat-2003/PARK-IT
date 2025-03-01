import React from "react";
import { Wrapper } from "../global/Wrapper";
import { Link } from "react-router-dom";
import { Footer } from "../global/Footer";

export const CallToAction = () => {
  return (
    <div className="relative mx-auto bg-gray-800 pt-12">
      <Wrapper>
        <div
          className="rounded-xl p-1 mt-20"
          style={{
            backgroundImage:
              "linear-gradient(to right bottom, #D16BA5 0%, #6A4C93 50%, #9A3F7F 100%)", // Violet-pink gradient
          }}
        >
          <div className="rounded-lg bg-black bg-opacity-80 backdrop-blur ">
            <div className="flex w-full flex-wrap items-center justify-between gap-4 px-8 py-10 sm:px-16 lg:flex-nowrap">
              <div className="lg:max-w-xl">
                <h2 className="block w-full pb-6 bg-gradient-to-b from-white to-gray-500 bg-clip-text font-bold text-transparent text-3xl sm:text-4xl">
                  List Your Parking Space
                </h2>
                <p className="text-white text-lg">
                  Easily add your xerox store to our platform by providing your
                  phone number. Reach more customers and grow your business with
                  our user-friendly listing process.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-6">
                <Link to="/create-parking-spot" prefetch={false}>
                  <button className="bg-gradient-to-r from-[#D16BA5] to-[#6A4C93] font-medium text-white button-text flex items-center justify-center whitespace-nowrap rounded-md transition-all duration-300 px-8 py-3 text-xs sm:text-sm hover:scale-105">
                    Get Started
                  </button>
                </Link>
                <Link
                  to={"/signup"}
                  prefetch={false}
                  className="flex items-center font-medium justify-center whitespace-nowrap rounded-md border border-zinc-700 bg-zinc-900 text-center text-white backdrop-blur transition-all hover:bg-zinc-800 px-8 py-3 text-xs sm:text-sm"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Wrapper>
      <Footer />
    </div>
  );
};
