import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Footer from "./Components/Footer";
import Contact from "./Components/Contact";
import { Coffee, ShoppingBasket } from "lucide-react";

function Home() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex flex-col min-h-screen justify-center items-center bg-gradient-to-b from-green-100 via-white to-green-50">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-6 relative ">
        {/* Animated background shapes */}
        <motion.div
          className="absolute top-0 left-0 w-64 h-64 bg-green-200 rounded-full blur-3xl opacity-40"
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ repeat: Infinity, duration: 6 }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-64 h-64 bg-amber-200 rounded-full blur-3xl opacity-40"
          animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
          transition={{ repeat: Infinity, duration: 7 }}
        />

        {/* Headline */}
        <motion.h1
          className="text-4xl md:text-6xl font-extrabold text-gray-800 mb-4 leading-tight"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Welcome to <span className="text-green-600">Asia Bazaar</span>
        </motion.h1>

        <motion.p
          className="text-gray-600 text-lg md:text-xl max-w-xl mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Discover fresh produce and flavorful café delights — all in one place.
        </motion.p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 relative z-10">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/store")}
            className="flex items-center gap-2 px-8 py-4 bg-green-600 text-white text-lg font-semibold rounded-2xl shadow-lg hover:bg-green-700 transition-all"
          >
            <ShoppingBasket size={22} />
            Visit Store
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/cafe")}
            className="flex items-center gap-2 px-8 py-4 bg-amber-500 text-white text-lg font-semibold rounded-2xl shadow-lg hover:bg-amber-600 transition-all"
          >
            <Coffee size={22} />
            Visit Café
          </motion.button>
        </div>

      </section>

      
    </div>
  );
}

export default Home;
