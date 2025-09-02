import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TypeAnimation } from 'react-type-animation';
import { Link } from "react-router-dom";

const images = [
  "/Images/borcelle.jpeg",
  "/Images/cheese.jpeg",
  "/Images/chickenrice.jpeg",
  "/Images/cold_drinks.jpeg",
  "/Images/dryfruits.jpeg",
  "/Images/fish.jpeg",
  "/Images/freshmutton.jpeg",
  "/Images/frozen_veg.jpeg",
  "/Images/gulab.jpeg",
  "/Images/meals.jpeg",
  "/Images/meat.jpeg",
  "/Images/meat1.jpeg",
  "/Images/ogveg.jpeg",
  "/Images/parata.jpeg",
  "/Images/pulses.jpeg",
  "/Images/rasa.jpeg",
  "/Images/snacks.jpeg",
  "/Images/species.jpeg",
  "/Images/sweets1.jpeg",
  "/Images/vege1.jpeg",
];

export default function ABCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const variants = {
    initial: { x: 200, opacity: 0, scale: 0.9 },
    animate: { x: 0, opacity: 1, scale: 1 },
    exit: { x: -200, opacity: 0, scale: 0.9 },
  };

  return (
    <section className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gradient-to-r from-yellow-50 to-pink-50 px-6 md:px-16 py-10 gap-10">
      {/* LEFT CONTENT */}
      <div className="md:w-1/2 md:ml-10 mt-20 md:mt-0 text-center md:text-left space-y-6">
        <h1 className="text-2xl md:text-4xl font-extrabold text-gray-800">
          Welcome to{" "}
          <TypeAnimation
            sequence={["ASIA BAZAR", 2000, "ASIA BAZAR", 2000]}
            speed={50}
            wrapper="span"
            repeat={Infinity}
            className="inline-block ml-2 text-pink-600"
          />
        </h1>
        <p className="text-md md:text-xl text-gray-600 font-medium">
          One Stop for Every Flavor of Asia
        </p>
        <ul className="md:list-disc md:ml-6 text-sm md:text-lg text-gray-700">
          <li>🍚 Chicken Rice & Meals</li>
          <li>🧀 Cheese & Dairy</li>
          <li>🥩 Fresh Mutton & Meat</li>
          <li>🫘 Dals & Dry Fruits</li>
          <li>🧃 Cold Drinks & Juices</li>
          <li>🍬 Gulab Jamun & Sweets</li>
          <li>🍝 Borcelle & Pasta Essentials</li>
        </ul>
        <Link to="/allitems">
          <button className="mt-4 px-8 py-3 bg-pink-600 text-white rounded-full font-semibold hover:bg-pink-700 transition duration-300 shadow-md">
            Order Now
          </button>
        </Link>
      </div>

      {/* RIGHT IMAGE SLIDER */}
      <div className="md:w-1/2 flex items-center justify-center h-[400px] w-full relative overflow-hidden">
        <div className="w-[300px] h-[400px] relative">
          <AnimatePresence mode="wait">
            <motion.img
              key={index}
              src={images[index]}
              alt={`Slide ${index + 1}`}
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute w-full h-full object-fit rounded-xl shadow-xl border-4 border-white"
            />
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
