import React from 'react'
import { Hero } from '../components/user/home/Hero';
import { HowItWorks } from '../components/user/home/HowItWorks';
import { ParkItFeatures } from '../components/user/home/Features';
import { CallToAction } from '../components/user/home/CallToAction';

export const Home = () => {
  return (
    <div className="w-full min-h-screen">
      {/* Section 1 */}
        <Hero />
        <HowItWorks />
        <ParkItFeatures />
        <CallToAction />
    </div>
  );
}
