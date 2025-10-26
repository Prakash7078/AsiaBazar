// import Categories from "./Components/Categories";


import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import CategoryScroller from "./CategoryScroller";
import SpecialOrder from "./SpecialOrder";
import AllItems from "./AllItems";
import ABCarousel  from "./ABCarousel";
import Categories from "./Categories";
import Contact from "./Contact";
import Footer from "./Footer";
import CafeItems from "./CafeItems";

function Cafe() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  // const[selectcategory,setSelectcategory]=useState('');
  return (
    <div>
      {/* <ABCarousel/> */}
      {/* <CategoryScroller onCategorySelect={setSelectcategory}/> */}
      <CafeItems/>
      {/* <AllItems selectedCategory={selectcategory} onCategorySelect={setSelectcategory}/> */}
      <SpecialOrder/>

      <Contact />
      <Footer />
    </div>
  );
}

export default Cafe;
