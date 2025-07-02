import { MapPin, ParkingCircle, ParkingMeter, IndianRupee } from "lucide-react";

const InfoComponent = () => {
  return (
    <div className="hidden md:flex md:w-1/2 bg-blue-600 relative">
      <div className="absolute inset-0 bg-black opacity-30"></div>
      <div
        className="w-full h-full bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/1756957/pexels-photo-1756957.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')",
        }}
      ></div>

      <div className="absolute inset-0 flex flex-col justify-center px-12 text-white">
        <div className="max-w-md">
          <div className="flex items-center mb-6">
            <MapPin className="h-8 w-8 mr-2" />
            <h2 className="text-3xl font-bold">ParkEasy</h2>
          </div>
          <h3 className="text-2xl font-semibold mb-4">
            Find and Book Parking Spots Near You
          </h3>
          <p className="text-lg mb-6">
            The easiest way to find available parking spots in your area. Book
            in advance and save time!
          </p>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center mr-3">
                <ParkingCircle className="h-6 w-6 text-blue-600" />
              </div>
              <p className="font-medium">Easily find nearby parking spots</p>
            </div>

            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center mr-3">
                <ParkingMeter className="h-6 w-6 text-blue-600" />
              </div>
              <p className="font-medium">Save time with advance booking</p>
            </div>

            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center mr-3">
                <IndianRupee className="h-6 w-6 text-blue-600" />
              </div>
              <p className="font-medium">Secure online payments</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoComponent;
