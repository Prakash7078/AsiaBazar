import React from 'react'

function SpecialOrder() {
  return (
    <div className='grid md:grid-cols-2 mt-14 md:mb-10 '>
        <div className='relative  max-w-3xl mx-auto px-4 '>
            <img src='../Images/order-now.avif' alt='order' className='rounded-md w-full' />
            
            <div className='absolute top-1/2 md:-right-10 right-0'>
                <img
                src='../Images/Special-Order.jpg'
                alt='special'
                className='h-28 w-28 rounded-full border-4 border-white shadow-lg'
                />
            </div>
            </div>

        <div className='md:px-20 px-5 pb-8  flex md:text-lg flex-col gap-4 '>
            <h1 className='font-bold text-3xl'>Order Now</h1>
            <p className=''>If you need any special orders for occasions like festivals or birthdays, you can contact us and order delicious items like:</p>
            <ul className='list-disc pl-4 '>
                <li>Biryani</li>
                <li>Sweets</li>
                <li>Chicken Curry</li>
                <li>Mutton Curry</li>
                <li>Tandoori Chicken</li>
            </ul>
            <a href="tel:+1234567890" className="text-blue-300 ">
                  +1 (316) 612-2700
            </a>
            <p className=''>6100 E 21st St N Ste 300
            Wichita, KS 67208</p>
        </div>
    </div>
  )
}

export default SpecialOrder