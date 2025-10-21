// import Categories from "./Components/Categories";
import Footer from "./Components/Footer";
import Contact from "./Components/Contact";

import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import CategoryScroller from "./Components/CategoryScroller";
import SpecialOrder from "./Components/SpecialOrder";
import AllItems from "./Components/AllItems";
import ABCarousel  from "./Components/ABCarousel";

function Home() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  const[selectcategory,setSelectcategory]=useState('');
  return (
    <div>
      <ABCarousel/>
      <CategoryScroller onCategorySelect={setSelectcategory}/>
      <AllItems selectedCategory={selectcategory} onCategorySelect={setSelectcategory}/>
      <SpecialOrder/>
      <Contact />
      <Footer />
    </div>
  );
}

export default Home;
