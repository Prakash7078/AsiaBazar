import { Product } from '../types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Fresh Organic Apples',
    price: 4.99,
    originalPrice: 5.99,
    image: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'fruits',
    description: 'Crisp and sweet organic apples, perfect for snacking or baking.',
    inStock: true,
    rating: 4.5,
    reviews: 124,
    discount: 17
  },
  {
    id: '2',
    name: 'Fresh Milk',
    price: 3.49,
    image: 'https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'dairy',
    description: 'Fresh whole milk from local farms, rich in calcium and vitamins.',
    inStock: true,
    rating: 4.8,
    reviews: 89
  },
  {
    id: '3',
    name: 'Whole Grain Bread',
    price: 2.99,
    originalPrice: 3.49,
    image: 'https://images.pexels.com/photos/209206/pexels-photo-209206.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'bakery',
    description: 'Freshly baked whole grain bread, perfect for sandwiches and toast.',
    inStock: true,
    rating: 4.3,
    reviews: 67,
    discount: 14
  },
  {
    id: '4',
    name: 'Organic Bananas',
    price: 1.99,
    image: 'https://images.pexels.com/photos/61127/pexels-photo-61127.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'fruits',
    description: 'Sweet and ripe organic bananas, great source of potassium.',
    inStock: true,
    rating: 4.6,
    reviews: 201
  },
  {
    id: '5',
    name: 'Free Range Eggs',
    price: 5.99,
    originalPrice: 6.99,
    image: 'https://images.pexels.com/photos/162712/egg-white-food-eat-162712.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'dairy',
    description: 'Fresh free-range eggs from happy hens, perfect for any meal.',
    inStock: true,
    rating: 4.7,
    reviews: 156,
    discount: 14
  },
  {
    id: '6',
    name: 'Fresh Spinach',
    price: 2.49,
    image: 'https://images.pexels.com/photos/2255935/pexels-photo-2255935.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'vegetables',
    description: 'Fresh organic spinach leaves, packed with nutrients.',
    inStock: true,
    rating: 4.4,
    reviews: 78
  },
  {
    id: '7',
    name: 'Greek Yogurt',
    price: 4.99,
    originalPrice: 5.99,
    image: 'https://images.pexels.com/photos/1446291/pexels-photo-1446291.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'dairy',
    description: 'Creamy Greek yogurt with probiotics and high protein content.',
    inStock: true,
    rating: 4.8,
    reviews: 143,
    discount: 17
  },
  {
    id: '8',
    name: 'Fresh Carrots',
    price: 1.99,
    image: 'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'vegetables',
    description: 'Crisp and sweet carrots, perfect for cooking or snacking.',
    inStock: true,
    rating: 4.5,
    reviews: 92
  }
];

export const categories = [
  { id: 'all', name: 'All Products' },
  { id: 'fruits', name: 'Fruits' },
  { id: 'vegetables', name: 'Vegetables' },
  { id: 'dairy', name: 'Dairy' },
  { id: 'bakery', name: 'Bakery' },
  { id: 'meat', name: 'Meat & Poultry' },
  { id: 'seafood', name: 'Seafood' }
];