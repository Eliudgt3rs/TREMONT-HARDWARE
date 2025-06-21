// sampleData.js - Use this to populate your Firestore database

import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

// Sample products data
const sampleProducts = [
  {
    name: 'Professional Drill Set',
    price: 129.99,
    originalPrice: 149.99,
    rating: 4.5,
    reviews: 128,
    image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=300&h=300&fit=crop',
    category: 'Power Tools',
    brand: 'DeWalt',
    inStock: true,
    description: 'High-performance cordless drill with multiple attachments and long-lasting battery',
    tags: ['cordless', 'professional', 'drill', 'battery'],
    createdAt: serverTimestamp()
  },
  {
    name: 'Garden Tool Collection',
    price: 89.99,
    originalPrice: 109.99,
    rating: 4.2,
    reviews: 89,
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=300&fit=crop',
    category: 'Garden',
    brand: 'Fiskars',
    inStock: true,
    description: 'Complete garden tool set for all your outdoor needs including spade, rake, and pruner',
    tags: ['garden', 'outdoor', 'tools', 'set'],
    createdAt: serverTimestamp()
  },
  {
    name: 'Premium Paint Brushes',
    price: 24.99,
    rating: 3.8,
    reviews: 256,
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=300&h=300&fit=crop',
    category: 'Painting',
    brand: 'Purdy',
    inStock: true,
    description: 'Professional-grade paint brushes for smooth finishes and precision work',
    tags: ['paint', 'brushes', 'professional', 'precision'],
    createdAt: serverTimestamp()
  },
  {
    name: 'Smart Home Security Kit',
    price: 199.99,
    rating: 4.7,
    reviews: 45,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop',
    category: 'Home Security',
    brand: 'Ring',
    inStock: false,
    description: 'Complete smart security system with mobile monitoring and cloud storage',
    tags: ['smart', 'security', 'home', 'wifi'],
    createdAt: serverTimestamp()
  },
  {
    name: 'Cordless Circular Saw',
    price: 149.99,
    rating: 4.6,
    reviews: 78,
    image: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=300&h=300&fit=crop',
    category: 'Power Tools',
    brand: 'Milwaukee',
    inStock: true,
    description: 'Powerful cordless circular saw for precision cuts with adjustable depth',
    tags: ['cordless', 'saw', 'precision', 'cutting'],
    createdAt: serverTimestamp()
  },
  {
    name: 'Premium Hammer Set',
    price: 59.99,
    rating: 4.3,
    reviews: 134,
    image: 'https://images.unsplash.com/photo-1609205807107-e8ec2120f9de?w=300&h=300&fit=crop',
    category: 'Hand Tools',
    brand: 'Stanley',
    inStock: true,
    description: 'Durable hammer set for various applications with comfortable grip handles',
    tags: ['hammer', 'hand tools', 'durable', 'comfort'],
    createdAt: serverTimestamp()
  },
  {
    name: 'Indoor/Outdoor Extension Cord',
    price: 19.99,
    rating: 4.0,
    reviews: 92,
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=300&h=300&fit=crop',
    category: 'Electrical',
    brand: 'Husky',
    inStock: true,
    description: 'Weather-resistant extension cord for indoor and outdoor use, 25 feet long',
    tags: ['extension', 'electrical', 'weather-resistant', 'outdoor'],
    createdAt: serverTimestamp()
  },
  {
    name: 'Adjustable Wrench Set',
    price: 34.99,
    rating: 4.4,
    reviews: 67,
    image: 'https://images.unsplash.com/photo-1609205807107-e8ec2120f9de?w=300&h=300&fit=crop',
    category: 'Hand Tools',
    brand: 'Craftsman',
    inStock: true,
    description: 'Versatile adjustable wrench set for multiple uses with non-slip grips',
    tags: ['wrench', 'adjustable', 'versatile', 'grip'],
    createdAt: serverTimestamp()
  },
  {
    name: 'LED Work Light',
    price: 45.99,
    rating: 4.1,
    reviews: 203,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop',
    category: 'Electrical',
    brand: 'DEWALT',
    inStock: true,
    description: 'Bright LED work light with adjustable stand and long battery life',
    tags: ['LED', 'work light', 'portable', 'bright'],
    createdAt: serverTimestamp()
  },
  {
    name: 'Plumbing Repair Kit',
    price: 79.99,
    rating: 4.0,
    reviews: 156,
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=300&h=300&fit=crop',
    category: 'Plumbing',
    brand: 'Ridgid',
    inStock: true,
    description: 'Complete plumbing repair kit with pipes, fittings, and essential tools',
    tags: ['plumbing', 'repair', 'pipes', 'fittings'],
    createdAt: serverTimestamp()
  }
];

// Function to populate Firestore with sample data
export const populateFirestore = async () => {
  try {
    console.log('Starting to populate Firestore...');
    
    for (const product of sampleProducts) {
      const docRef = await addDoc(collection(db, 'products'), product);
      console.log('Document written with ID: ', docRef.id);
    }
    
    console.log('All products added successfully!');
  } catch (error) {
    console.error('Error adding documents: ', error);
  }
};
export const databaseStructure = {
  collections: {
    products: {
      fields: {
        name: 'string',
        price: 'number',
        originalPrice: 'number (optional)',
        rating: 'number',
        reviews: 'number (optional)',
        image: 'string (URL)',
        category: 'string',
        brand: 'string',
        inStock: 'boolean',
        description: 'string (optional)',
        tags: 'array of strings (optional)',
        createdAt: 'timestamp'
      },
      indexes: [
        'category',
        'brand',
        'price',
        'rating',
        'inStock',
        'createdAt'
      ]
    },
    orders: {
      fields: {
        userId: 'string',
        items: 'array of objects',
        status: 'string',
        total: 'number',
        customer: 'object',
        paymentMethod: 'string',
        paymentDetails: 'object',
        date: 'string',
        createdAt: 'timestamp'
      },
      indexes: [
        'userId',
        'status',
        'createdAt'
      ]
    },
    users: {
      fields: {
        email: 'string',
        displayName: 'string',
        createdAt: 'timestamp',
        lastLogin: 'timestamp'
      }
    }
  }
};

