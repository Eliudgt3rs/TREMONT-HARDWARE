// populateFirestore.js - Run this script once to add sample data
// Place this file in your project root (same level as package.json)

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Your Firebase configuration (replace with your actual config)
const firebaseConfig = {
  apiKey: "AIzaSyCHBY8LNNBYXBKw_lhwbK7zISUh1lljMkc",
  authDomain: "tremont-950e5.firebaseapp.com",
  projectId: "tremont-950e5",
  storageBucket: "tremont-950e5.firebasestorage.app",
  messagingSenderId: "649151542864",
  appId: "1:649151542864:web:3fead623df669210a40355",
  measurementId: "G-WDSQWHWG9S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Sample products data
const sampleProducts = [
    { id: 11, name: 'High Grade Faucet', price: 5000, rating: 4.2, image: './Taps/High Grade Faucet.jpg', category: 'Plumbing', brand: 'Husky', inStock: true },
    { id: 12, name: 'Luxury Shower', price: 13000, rating: 4.3, image: './Luxuryshower.jpg', category: 'Plumbing', brand: 'Ridgid', inStock: true },
    { id: 13, name: 'Bathroom Accessory', price: 350, rating: 4.2, image: './Taps/Bathroom Accessory.jpg', category: 'Plumbing', brand: 'Frencia', inStock: true },
    { id: 14, name: 'Stopper', price: 500 , rating: 3.8, image: './Stopper.jpg', category: 'Plumbing', brand: 'Original', inStock: true },
    { id: 15, name: 'Washroom Kit', price: 4500, rating: 4.7, image: '/api/placeholder/300/300', category: 'Plumbing', brand: 'Original', inStock: false },
    { id: 16, name: 'Luxury Arabic Tap', price: 7000, rating: 4.6, image: './Taps/IMG-20250603-WA0041.jpg', category: 'Plumbing', brand: 'Brimix', inStock: true },
    { id: 17, name: 'Metal Lever Lock', price: 1700, rating: 4.3, image: './IMG-20250603-WA0073.jpg', category: 'Hand Tools', brand: 'Glory', inStock: true },
    { id: 18, name: 'Metal Lever Lock', price: 800, rating: 4.0, image: './IMG-20250603-WA0080.jpg', category: 'Power Tools', brand: 'Moment', inStock: true },
    { id: 19, name: 'Ceramic Toilet', price: 10000, rating: 4.5, image: './IMG-20250603-WA0096.jpg', category: 'Power tools', brand: 'Frencia', inStock: true },
    { id: 20, name: 'Medium Flat Gun', price: 12500, rating: 4.4, image: './IMG-20250603-WA0079.jpg', category: 'Power Tools', brand: 'Craftsman', inStock: true },
   
];

// Function to populate Firestore
async function populateFirestore() {
  console.log('🚀 Starting to populate Firestore with sample products...');
  console.log(`📦 Adding ${sampleProducts.length} products...`);
  
  try {
    let successCount = 0;
    
    for (let i = 0; i < sampleProducts.length; i++) {
      const product = {
        ...sampleProducts[i],
        createdAt: serverTimestamp()
      };
      
      const docRef = await addDoc(collection(db, 'products'), product);
      successCount++;
      
      console.log(`✅ Product ${i + 1}/${sampleProducts.length}: "${product.name}" added with ID: ${docRef.id}`);
      
      // Small delay to avoid hitting rate limits
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log(`\n🎉 SUCCESS! All ${successCount} products have been added to Firestore!`);
    console.log('🔗 You can now view them in your Firebase Console > Firestore Database');
    console.log('🗑️  You can delete this script file now.');
    
  } catch (error) {
    console.error('❌ Error adding products to Firestore:', error);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Check your Firebase configuration');
    console.log('2. Make sure Firestore is enabled in your Firebase project');
    console.log('3. Verify your internet connection');
    console.log('4. Check Firestore security rules (should allow writes in test mode)');
  }
}

// Run the population function
populateFirestore();