import { MapPin, Clock, Car, IndianRupee, Shield, Bell } from "lucide-react";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export const ParkItFeatures = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-20 mt-12 bg-gray-900">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto text-center"
        >
          <h2 className="text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Why Choose Park-It?
          </h2>
          <p className="max-w-lg mx-auto mt-4 text-lg leading-8 text-gray-300">
            Experience hassle-free parking with our innovative features designed to make your parking experience seamless and secure.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 mt-10 text-center sm:mt-16 sm:grid-cols-2 sm:gap-x-12 gap-y-12 md:grid-cols-3 md:gap-0 xl:mt-24"
        >
          <motion.div variants={item} className="p-4 transition-all md:p-8 lg:p-14 hover:bg-gray-800 rounded-xl">
            <div className="flex items-center justify-center w-16 h-16 mx-auto bg-gray-800 border-2 border-purple-500 rounded-full shadow-lg">
              <MapPin className="text-purple-400 h-7 w-7" />
            </div>
            <h3 className="mt-12 text-xl font-bold text-white font-pj">
              Real-time Availability
            </h3>
            <p className="mt-5 text-base text-gray-300 font-pj">
              Find available parking spots in real-time with our live tracking system. Never waste time searching for parking again.
            </p>
          </motion.div>

          <motion.div variants={item} className="p-4 transition-all md:p-8 lg:p-14 md:border-l md:border-gray-700 hover:bg-gray-800 rounded-xl">
            <div className="flex items-center justify-center w-16 h-16 mx-auto bg-gray-800 border-2 border-purple-500 rounded-full shadow-lg">
              <Clock className="text-purple-400 h-7 w-7" />
            </div>
            <h3 className="mt-12 text-xl font-bold text-white font-pj">
              Instant Booking
            </h3>
            <p className="mt-5 text-base text-gray-300 font-pj">
              Book your parking spot instantly with our easy-to-use platform. Reserve in advance or find spots on the go.
            </p>
          </motion.div>

          <motion.div variants={item} className="p-4 transition-all md:p-8 lg:p-14 md:border-l md:border-gray-700 hover:bg-gray-800 rounded-xl">
            <div className="flex items-center justify-center w-16 h-16 mx-auto bg-gray-800 border-2 border-purple-500 rounded-full shadow-lg">
              <Car className="text-purple-400 h-7 w-7" />
            </div>
            <h3 className="mt-12 text-xl font-bold text-white font-pj">
              Space Owner Benefits
            </h3>
            <p className="mt-5 text-base text-gray-300 font-pj">
              Turn your unused parking space into a source of income. List your space and earn money while helping others.
            </p>
          </motion.div>

          <motion.div variants={item} className="p-4 transition-all md:p-8 lg:p-14 md:border-t md:border-gray-700 hover:bg-gray-800 rounded-xl">
            <div className="flex items-center justify-center w-16 h-16 mx-auto bg-gray-800 border-2 border-purple-500 rounded-full shadow-lg">
              <IndianRupee className="text-purple-400 h-7 w-7" />
            </div>
            <h3 className="mt-12 text-xl font-bold text-white font-pj">
              Secure Payments
            </h3>
            <p className="mt-5 text-base text-gray-300 font-pj">
              Enjoy safe and secure transactions with our integrated payment system. Multiple payment options available.
            </p>
          </motion.div>

          <motion.div variants={item} className="p-4 transition-all md:p-8 lg:p-14 md:border-l md:border-gray-700 md:border-t hover:bg-gray-800 rounded-xl">
            <div className="flex items-center justify-center w-16 h-16 mx-auto bg-gray-800 border-2 border-purple-500 rounded-full shadow-lg">
              <Shield className="text-purple-400 h-7 w-7" />
            </div>
            <h3 className="mt-12 text-xl font-bold text-white font-pj">
              Verified Spaces
            </h3>
            <p className="mt-5 text-base text-gray-300 font-pj">
              All parking spaces are verified and monitored for your safety. Park with confidence in our trusted locations.
            </p>
          </motion.div>

          <motion.div variants={item} className="p-4 transition-all md:p-8 lg:p-14 md:border-l md:border-gray-700 md:border-t hover:bg-gray-800 rounded-xl">
            <div className="flex items-center justify-center w-16 h-16 mx-auto bg-gray-800 border-2 border-purple-500 rounded-full shadow-lg">
              <Bell className="text-purple-400 h-7 w-7" />
            </div>
            <h3 className="mt-12 text-xl font-bold text-white font-pj">
              Smart Notifications
            </h3>
            <p className="mt-5 text-base text-gray-300 font-pj">
              Get timely alerts about your booking status, parking reminders, and important updates through our notification system.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
