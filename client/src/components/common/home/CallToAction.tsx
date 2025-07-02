import { Wrapper } from "../wrapper";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { Car, ArrowRight } from "lucide-react";

const CallToAction = () => {
  return (
    <div className="relative mx-auto mt-20">
      <Wrapper>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="rounded-xl p-1"
          style={{
            backgroundImage:
              "linear-gradient(to right bottom, rgb(79, 70, 229) 0%, rgb(165, 56, 164) 50%, rgb(220, 38, 38) 100%)",
          }}
        >
          <div className="rounded-lg bg-gray-900 bg-opacity-90 backdrop-blur">
            <div className="flex w-full flex-wrap items-center justify-between gap-4 px-8 py-10 sm:px-16 lg:flex-nowrap">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="lg:max-w-xl"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Car className="h-8 w-8 text-purple-400" />
                  <h2 className="block w-full pb-2 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text font-bold text-transparent text-3xl sm:text-4xl">
                    List Your Parking Space
                  </h2>
                </div>
                <p className="my-4 font-normal leading-relaxed tracking-wide text-gray-300">
                  Turn your unused parking space into a source of income. Join our network of parking space owners and start earning today. 
                  Set your own rates, manage bookings, and grow your business with our user-friendly platform.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
                className="flex flex-wrap items-center justify-center gap-6"
              >
                <Link to="/parking-owner/list-parking-spot">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 font-medium text-white button-text flex items-center justify-center whitespace-nowrap rounded-md transition-all duration-300 px-8 py-3 text-xs sm:text-sm hover:from-purple-700 hover:to-pink-700 gap-2"
                  >
                    Start Listing
                    <ArrowRight size={16} />
                  </motion.button>
                </Link>
                <Link
                  to="/parking-owner/listings"
                  className="flex items-center font-medium justify-center whitespace-nowrap rounded-md border border-purple-500 bg-gray-800 text-center text-white backdrop-blur transition-all hover:bg-gray-700 px-8 py-3 text-xs sm:text-sm"
                >
                  View My Listings
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </Wrapper>
    </div>
  );
};

export default CallToAction;
