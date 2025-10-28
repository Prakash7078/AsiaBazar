import {AiFillInstagram} from 'react-icons/ai';
import {BsTwitter,BsBrowserChrome} from 'react-icons/bs';
import ab from '/Images/asiabazar.png'
function Footer() {
  return (
    <footer className=" bg-gradient-to-br from-green-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-wrap justify-between">
          <div className="w-full md:w-1/4 mb-8 md:mb-0">
            <div className="flex items-center mb-4">
              <img
                src={ab}
                alt="Mythri Jewellers"
                className="mr-2 h-10 cursor-pointer rounded-sm"
              />
              <h2 className="text-sm font-semibold  uppercase">
                AsiaBazar 
              </h2>
            </div>
          </div>
          <div className="w-full md:w-1/4 mb-8  md:mb-0">
            <h2 className="text-sm font-semibold  uppercase mb-4">
              About Us
            </h2>
            <ul className=" font-medium">
              <li className="mb-3">
                <a href="#" className="">
                  About Us
                </a>
              </li>
              <li className="mb-3">
                <a href="#" className="">
                  Our Products
                </a>
              </li>
              <li>
                <a href="#" className="">
                  Orders
                </a>
              </li>
            </ul>
          </div>
          <div className="w-full md:w-1/4 mb-8 md:mb-0">
            <h2 className="text-sm font-semibold  uppercase mb-4">
              Services
            </h2>
            <ul className=" font-medium">
              <li className="mb-3">
                <a href="#" className="">
                  Food Delivery
                </a>
              </li>
              <li>
                <a href="#" className="">
                  Vegetables, products delivery
                </a>
              </li>
            </ul>
          </div>

          <div className="w-full md:w-1/4">
            <h2 className="text-sm font-semibold  uppercase mb-4">
              Contact
            </h2>
            <ul className=" font-medium">
              <li className="mb-3">
                <a href="tel:+1234567890" className="">
                  +1 (316) 612-2700
                </a>
              </li>
              <li>
                <a href="#" className="">
                  6100 E 21st St N Ste 300, Wichita, KS 67208
                </a>
              </li>
            </ul>
          </div>
        </div>
        <hr className="my-6 border-secondary" />
        <div className="flex justify-between items-center">
          <span className="text-sm ">
            &copy; {new Date().getFullYear()} AsiaBazar. All rights
            reserved.
          </span>
          <div className="flex space-x-4">
            <a href="#" className="">
              <BsBrowserChrome size={20} />
              <span className="sr-only">Web page</span>
            </a>
            <a href="#" className="">
              <AiFillInstagram size={20} />
              <span className="sr-only">Instagram page</span>
            </a>
            <a href="#" className="">
              <BsTwitter size={20} />
              <span className="sr-only">Twitter page</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
