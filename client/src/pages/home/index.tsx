import { ParkItFeatures } from "@/components/common/home/Features";
import { Hero } from "@/components/common/home/Hero";
import { HowItWorks } from "@/components/common/home/HowItWorks";
import CallToAction from "@/components/common/home/CallToAction";
import Footer from "@/components/common/footer";

const HomePage = () => {
  return (
    <div className="w-full min-h-screen flex flex-col">
      <div className="flex-1">
        <Hero />
        <HowItWorks />
        <ParkItFeatures />
        <div className="pb-16 sm:pb-24">
          <CallToAction />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
