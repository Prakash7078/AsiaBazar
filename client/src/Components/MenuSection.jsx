import React from "react";
import menu from "/Images/abm.jpg";

const MenuSection = () => {
  return (
    <section className="bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4 text-center">
        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Our Menu
        </h2>
        <div className="w-20 h-1 bg-red-500 mx-auto mb-6 rounded-full"></div>
        <p className="text-gray-600 text-base md:text-lg mb-8">
          Discover our handpicked dishes crafted with love and flavor.
        </p>

        {/* Image */}
        <div className="flex justify-center">
          <div className="max-w-3xl w-full">
            <img
              src={menu}
              alt="Menu"
              className="w-full h-auto rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default MenuSection;
