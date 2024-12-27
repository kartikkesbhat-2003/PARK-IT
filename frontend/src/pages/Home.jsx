import React from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRight } from "react-icons/fa";
import { Hero } from '../assets/components/home/Hero';

export const Home = () => {
  return (
    <div className="w-full min-h-screen">
      {/* Section 1 */}
        <Hero />
      
    </div>
  );
}
