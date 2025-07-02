import { Search, Calendar, Car, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export const HowItWorks = () => {
  return (
    <section className="py-0 bg-gray-900 sm:py-16 lg:py-8">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            How Park-It Works
          </h2>
          <p className="max-w-lg mx-auto mt-4 text-gray-300 text-lg leading-8">
            Book your parking spot in three simple steps. Fast, secure, and convenient parking at your fingertips.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="relative mt-12 lg:mt-20"
        >
          <div className="absolute inset-x-0 hidden xl:px-44 top-2 md:block md:px-20 lg:px-28">
            <img
              className="w-full opacity-20"
              src="https://cdn.rareblocks.xyz/collection/celebration/images/steps/2/curved-dotted-line.svg"
              width={1000}
              height={1000}
              alt="svg"
            />
          </div>

          <div className="relative grid grid-cols-1 gap-8 md:grid-cols-3">
            <motion.div variants={item} className="text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto bg-gray-800 border-2 border-purple-500 rounded-full shadow-lg">
                <Search className="text-purple-400 h-7 w-7" />
              </div>
              <h3 className="mt-8 text-xl font-bold text-white">Find a Spot</h3>
              <p className="mt-4 text-base text-gray-300">
                Search for available parking spots near your destination. Filter by location, price, and availability.
              </p>
            </motion.div>

            <motion.div variants={item} className="text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto bg-gray-800 border-2 border-purple-500 rounded-full shadow-lg">
                <Calendar className="text-purple-400 h-7 w-7" />
              </div>
              <h3 className="mt-8 text-xl font-bold text-white">Book & Pay</h3>
              <p className="mt-4 text-base text-gray-300">
                Select your preferred time slot and make a secure payment. Get instant confirmation of your booking.
              </p>
            </motion.div>

            <motion.div variants={item} className="text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto bg-gray-800 border-2 border-purple-500 rounded-full shadow-lg">
                <CheckCircle className="text-purple-400 h-7 w-7" />
              </div>
              <h3 className="mt-8 text-xl font-bold text-white">Park & Go</h3>
              <p className="mt-4 text-base text-gray-300">
                Arrive at your reserved spot, park your vehicle, and go about your day. Your space is guaranteed.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
