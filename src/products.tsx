import { useState, useEffect, JSX } from 'react';
import { ChevronUp, ShoppingCart, Menu, X, Phone, Mail, MapPin, Grid, List, ChevronDown, ShieldCheck, Truck, FileText, CreditCard, MessageCircle, Facebook, Instagram, Twitter, Search } from 'lucide-react';

export default function ProductsPage() {
  // State Management
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  type Product = {
    id: number;
    name: string;
    price: number;
    rating: number;
    image: string;
    category: string;
    brand: string;
    inStock: boolean;
  };

  type CartItem = {
    product: Product;
    quantity: number;
  };

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  type User = {
    name: string;
    email: string;
    id: string;
  };

  const [user, setUser] = useState<User | null>(null);
  const [showInvoice, setShowInvoice] = useState(false);
  type Invoice = {
    invoiceNumber: string;
    invoiceDate: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    items: CartItem[];
    subtotal: number;
    tax: number;
    total: number;
    paymentMethod: string;
    status: string;
  };

  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null);
  type Order = {
    id: string;
    date: string;
    items: CartItem[];
    status: string;
    total: number;
  };

  const [orders, setOrders] = useState<Order[]>([]);
  const [showOrders, setShowOrders] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showMpesaModal, setShowMpesaModal] = useState(false);
  const [mpesaPhone, setMpesaPhone] = useState('');
  const [mpesaLoading, setMpesaLoading] = useState(false);
  const [mpesaMessage, setMpesaMessage] = useState('');

  // SEARCH FUNCTIONALITY - NEW STATE
  const [searchQuery, setSearchQuery] = useState('');

const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setSearchQuery(e.target.value);
};

  //Bact to top
  useEffect(() => {
  const handleScroll = () => {
    if (window.scrollY > 300) {
      setShowBackToTop(true);
    } else {
      setShowBackToTop(false);
    }
  };

  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);

  const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

  // Form States
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  // M-Pesa Payment Functions
  const formatPhoneNumber = (phone: string) => {
    // Convert to format: 254XXXXXXXXX
    if (phone.startsWith('0')) {
      return '254' + phone.slice(1);
    }
    if (phone.startsWith('+254')) {
      return phone.slice(1);
    }
    if (phone.startsWith('254')) {
      return phone;
    }
    return '254' + phone;
  };

  const handleMpesaPayment = async () => {
    if (!mpesaPhone || mpesaPhone.length < 10) {
      setMpesaMessage('Please enter a valid phone number');
      return;
    }

    if (!currentInvoice || currentInvoice.total <= 0) {
      setMpesaMessage('Invalid payment amount. Please check your order.');
      return;
    }

    setMpesaLoading(true);
    setMpesaMessage('');

    try {
      const formattedPhone = formatPhoneNumber(mpesaPhone);
      
      const response = await fetch('./api/mpesa/stkpush', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: formattedPhone,
          amount: currentInvoice.total,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMpesaMessage('Payment request sent! Check your phone for M-Pesa prompt.');
        // Update invoice status
        if (currentInvoice) {
          setCurrentInvoice({
            ...currentInvoice,
            status: 'Payment Sent',
            customerPhone: formattedPhone
          });
        }
        // Update order status if user is logged in
        if (isLoggedIn) {
          setOrders(orders.map(order => 
            order.id === currentInvoice.invoiceNumber 
              ? { ...order, status: 'Payment Sent' }
              : order
          ));
        }
      } else {
        setMpesaMessage('Payment failed: ' + (data.message || 'Unknown error'));
      }
    } catch (error: any) {
      setMpesaMessage('Error: ' + error.message);
    } finally {
      setMpesaLoading(false);
    }
  };

  // Extended Products Data
  const allProducts = [
    { id: 1, name: 'Hand Washing Sink', price: 4500, rating: 4.2, image: './Handwashsink.png', category: 'Plumbing', brand: 'Frencia', inStock: true },
    { id: 2, name: 'Hot/Cold Faucet', price: 4000 , rating: 3.8, image: './Taps/Hot_ColdFaucet.png', category: 'Plumbing', brand: 'Original', inStock: true },
    { id: 3, name: 'Washroom Kit', price: 4500, rating: 4.7, image: './Washroomkit.jpg', category: 'Plumbing', brand: 'Original', inStock: true },
    { id: 4, name: 'Luxury Kitchen Tap', price: 7000, rating: 4.6, image: './Taps/LuxuryKitchenTap.jpg', category: 'Plumbing', brand: 'Brimix', inStock: true },
    { id: 5, name: 'Metal Lever Lock', price: 1700, rating: 4.3, image: './GloryLock.png', category: 'Home Security', brand: 'Glory', inStock: true },
    { id: 6, name: 'Metal Lever Lock', price: 800, rating: 4.0, image: './GloryCoffeeLock.png', category: 'Home Security', brand: 'Moment', inStock: true },
    { id: 7, name: 'Ceramic Toilet', price: 10000, rating: 4.5, image: './Ceramic_Toilet.png', category: 'Plumbing', brand: 'Frencia', inStock: true },
    { id: 8, name: 'Medium Flat Gun', price: 12500, rating: 4.4, image: './MedFlatGun (1).png', category: 'Power Tools', brand: 'Craftsman', inStock: true },
    { id: 9, name: '3 Joint Flex Tap', price: 299.99, rating: 4.1, image: './Taps/3 Joint Flex Tap.jpg', category: 'Plumbing', brand: 'Black+Decker', inStock: true },
    { id: 10, name: 'Kitchen Sink Full Set', price: 25000, rating: 4.5, image: './Taps/Kitchensinkfullset.jpg', category: 'Plumbing', brand: 'Craftsman', inStock: true },
    { id: 11, name: 'High Grade Faucet', price: 5000, rating: 4.2, image: './Taps/High Grade Faucet.jpg', category: 'Plumbing', brand: 'Husky', inStock: true },
    { id: 12, name: 'Luxury Shower', price: 13000, rating: 4.3, image: './Luxuryshower.jpg', category: 'Plumbing', brand: 'Ridgid', inStock: true },
    { id: 13, name: 'Bathroom Accessory', price: 350, rating: 4.2, image: './Taps/Bathroom Accessory.jpg', category: 'Plumbing', brand: 'Frencia', inStock: true },
    { id: 14, name: 'Stopper', price: 500 , rating: 3.8, image: './Stopper.jpg', category: 'Plumbing', brand: 'Original', inStock: true },
    { id: 15, name: 'Washroom Kit', price: 4500, rating: 4.7, image: '', category: 'Plumbing', brand: 'Original', inStock: false },
    { id: 16, name: 'Luxury Arabic Tap', price: 7000, rating: 4.6, image: './Taps/IMG-20250603-WA0041.jpg', category: 'Plumbing', brand: 'Brimix', inStock: true },
    { id: 17, name: 'Metal Lever Lock', price: 1700, rating: 4.3, image: './IMG-20250603-WA0073.jpg', category: 'Hand Tools', brand: 'Glory', inStock: true },
    { id: 18, name: 'Metal Lever Lock', price: 800, rating: 4.0, image: './IMG-20250603-WA0080.jpg', category: 'Power Tools', brand: 'Moment', inStock: true },
    { id: 19, name: 'Ceramic Toilet', price: 10000, rating: 4.5, image: './IMG-20250603-WA0096.jpg', category: 'Power tools', brand: 'Frencia', inStock: true },
    { id: 20, name: 'Medium Flat Gun', price: 12500, rating: 4.4, image: './IMG-20250603-WA0079.jpg', category: 'Power Tools', brand: 'Craftsman', inStock: true },
    { id: 21, name: 'Lawn Mower Electric', price: 299.99, rating: 4.1, image: './6Roller.jpg', category: 'Hand tools', brand: 'Black+Decker', inStock: true },
    { id: 22, name: 'Socket Wrench Set', price: 89.99, rating: 4.5, image: './IMG-20250603-WA0078.jpg', category: 'Electrical', brand: 'Craftsman', inStock: true },
    { id: 23, name: 'LED Work Light', price: 45.99, rating: 4.2, image: './IMG-20250603-WA0089.jpg', category: 'Hand Tools', brand: 'Husky', inStock: true },
    { id: 24, name: 'Simple Tap', price: 67.99, rating: 4.3, image: './Taps/IMG-20250603-WA0040.jpg', category: 'Plumbing', brand: 'Ridgid', inStock: true },
    { id: 25, name: 'Hand Washing Sink', price: 4500, rating: 4.2, image: './Taps/IMG-20250603-WA0039.jpg', category: 'Plumbing', brand: 'Frencia', inStock: true },
    { id: 26, name: 'Kitchen Sink Faucet', price: 4000 , rating: 3.8, image: './Taps/IMG-20250603-WA0032.jpg', category: 'Plumbing', brand: 'Original', inStock: true },
    { id: 27, name: '6" Paint Brushes', price: 900, rating: 4.7, image: './IMG-20250603-WA0092.jpg', category: 'Hand Tools', brand: 'Fixtec', inStock: true },
    { id: 28, name: 'Scrappers', price: 7000, rating: 4.6, image: './IMG-20250603-WA0072 (1).jpg', category: 'Hand Tools', brand: 'Brimix', inStock: true },
    { id: 29, name: 'Metal Lever Lock', price: 1700, rating: 4.3, image: './IMG-20250603-WA0046.jpg', category: 'Plumbing', brand: 'Glory', inStock: true },
    { id: 30, name: 'Wood Graining Rubber Set', price: 800, rating: 4.0, image: './IMG-20250603-WA0055.jpg', category: 'Hand tools', brand: 'Original', inStock: true },
    { id: 31, name: 'Paint Roller', price: 10000, rating: 4.5, image: './IMG-20250603-WA0090.jpg', category: 'Hand Tools', brand: 'Frencia', inStock: true },
    { id: 32, name: 'Medium Flat Gun', price: 12500, rating: 4.4, image: './IMG-20250603-WA0095.jpg', category: 'Power Tools', brand: 'Craftsman', inStock: true },
    { id: 33, name: 'Lawn Mower Electric', price: 299.99, rating: 4.1, image: './IMG-20250603-WA0057 (1).jpg', category: 'Hand Tools', brand: 'Black+Decker', inStock: true },
    { id: 34, name: 'Socket Wrench Set', price: 89.99, rating: 4.5, image: './IMG-20250603-WA0085.jpg', category: 'Power Tools', brand: 'Craftsman', inStock: true },
    { id: 35, name: 'Long Neck Faucet', price: 45.99, rating: 4.2, image: './IMG-20250603-WA0031.jpg', category: 'Plumbing', brand: 'Husky', inStock: true },
    { id: 36, name: 'Pipe Wrench Heavy Duty', price: 67.99, rating: 4.3, image: './IMG-20250603-WA0063.jpg', category: 'Plumbing', brand: 'Ridgid', inStock: true },
    { id: 37, name: 'Hand Sink', price: 4500, rating: 4.2, image: './IMG-20250603-WA0061.jpg', category: 'Hand Tools', brand: 'Frencia', inStock: true },
    { id: 38, name: 'Sink Faucet', price: 4000 , rating: 3.8, image: './IMG-20250603-WA0048.jpg', category: 'Plumbing', brand: 'Original', inStock: true },
    { id: 39, name: 'Brush', price: 4500, rating: 4.7, image: './IMG-20250603-WA0087.jpg', category: 'Hand Tools', brand: 'Original', inStock: true },
    { id: 40, name: 'Steel Hand Scrapper', price: 7000, rating: 4.6, image: './IMG-20250603-WA0059 (1).jpg', category: 'Hand Tools', brand: 'Brimix', inStock: true },
    { id: 41, name: 'Metal Lever Lock', price: 1700, rating: 4.3, image: './IMG-20250603-WA0067 (1).jpg', category: 'Hand Tools', brand: 'Glory', inStock: true },
    { id: 42, name: 'Metal Lever Lock', price: 800, rating: 4.0, image: './IMG-20250603-WA0043.jpg', category: 'Plumbing', brand: 'Moment', inStock: true },
    { id: 43, name: 'Tap', price: 10000, rating: 4.5, image: './IMG-20250603-WA0045 (1).jpg', category: 'Plumbing', brand: 'Frencia', inStock: true },
    { id: 44, name: 'Medium Flat Gun', price: 12500, rating: 4.4, image: './IMG-20250603-WA0069.jpg', category: 'Power Tools', brand: 'Craftsman', inStock: true },
    { id: 45, name: 'Shower', price: 299.99, rating: 4.1, image: './IMG-20250603-WA0028.jpg', category: 'Plumbing', brand: 'Black+Decker', inStock: true },
    { id: 46, name: 'Socket Wrench Set', price: 89.99, rating: 4.5, image: './IMG-20250603-WA0053.jpg', category: 'Hand Tools', brand: 'Craftsman', inStock: true },
    { id: 47, name: 'LED Work Light', price: 45.99, rating: 4.2, image: './IMG-20250603-WA0077.jpg', category: 'Electrical', brand: 'Husky', inStock: true },
    { id: 48, name: 'Pipe Wrench Heavy Duty', price: 67.99, rating: 4.3, image: './IMG-20250603-WA0083 (1).jpg', category: 'Power Tools', brand: 'Ridgid', inStock: true },
  ];

  // SEARCH FUNCTIONALITY - NEW FUNCTION
  const filterProducts = () => {
    if (!searchQuery.trim()) {
      return allProducts;
    }
    
    const query = searchQuery.toLowerCase().trim();
    return allProducts.filter(product => 
      product.name.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      product.brand.toLowerCase().includes(query)
    );
  };

  // Updated to work with filtered products
  const filteredProducts = filterProducts();
  
  // Pagination settings - Updated to work with filtered products
  const productsPerPage = 12;
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  
  // Get current page products - Updated to work with filtered products
  const getCurrentPageProducts = () => {
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
  };
  
  const products = getCurrentPageProducts();
  
  // Categories and Brands for filtering
  const categories = ['Power Tools', 'Hand Tools', 'Electrical', 'Plumbing', 'Painting', 'Home Security'];
  
  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);
  
  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };
  
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };
  
  // WhatsApp integration
  const buyWithWhatsApp = (product: Product) => {
    const message = `Hi! I'm interested in purchasing the ${product.name} for KSh${product.price.toFixed(2)}. Can you help me with this order?`;
    const phoneNumber = "254700761283";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };
  
  // Add to Cart function
  const addToCart = (product: Product) => {
    const existingItem = cartItems.find(item => item.product.id === product.id);
    
    if (existingItem) {
      setCartItems(cartItems.map(item => 
        item.product.id === product.id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      ));
    } else {
      setCartItems([...cartItems, { product, quantity: 1 }]);
    }
  };
  
  // Remove from Cart function
  const removeFromCart = (productId: number) => {
    setCartItems(cartItems.filter(item => item.product.id !== productId));
  };
  
  // Update Cart Item Quantity
  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setCartItems(cartItems.map(item => 
      item.product.id === productId 
        ? { ...item, quantity: newQuantity } 
        : item
    ));
  };
  
  // Calculate Cart Total
  const cartTotal = cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);

  // Generate Invoice
  const generateInvoice = (paymentMethod = 'Credit Card') => {
    const invoiceNumber = 'INV-' + Date.now().toString().slice(-6);
    const invoiceDate = new Date().toISOString().split('T')[0];
    const tax = cartTotal * (paymentMethod === 'MPESA' ? 0.16 : 0.07);

    const newInvoice = {
      invoiceNumber,
      invoiceDate,
      customerName: user ? user.name : 'Guest User',
      customerEmail: user ? user.email : 'guest@example.com',
      customerPhone: paymentMethod === 'MPESA' ? mpesaPhone : '',
      items: [...cartItems],
      subtotal: cartTotal,
      tax: tax,
      total: cartTotal,
      paymentMethod: paymentMethod,
      status: 'Pending'
    };
    
    setCurrentInvoice(newInvoice);
    setShowInvoice(true);
    
    if (isLoggedIn) {
      const newOrder = {
        id: invoiceNumber,
        date: invoiceDate,
        items: [...cartItems],
        status: paymentMethod === 'MPESA' ? 'Payment Pending' : 'Processing',
        total: newInvoice.total
      };
      setOrders([newOrder, ...orders]);
    }
    
    setCartItems([]);
  };

  // Render stars for ratings
  const renderStars = (rating: number) => {
    const stars: JSX.Element[] = [];
    
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<span key={i} className="text-yellow-500">★</span>);
      } else if (i - 0.5 <= rating) {
        stars.push(<span key={i} className="text-yellow-500">★</span>);
      } else {
        stars.push(<span key={i} className="text-gray-300">★</span>);
      }
    }
    
    return stars;
  };
  
  return (
<div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-gray-800 text-white">
        {/* Top Bar */}
        <div className="bg-gray-900 py-2 px-4">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-4 text-sm">
              <span className="flex items-center">
                <Phone size={14} className="mr-1" /> +254 (0) 700 761 283</span>
              <span className="hidden md:flex items-center"><Mail size={14} className="mr-1" /> eliqamaa98@gmail.com</span>
            </div>
            <div className="flex items-center space-x-4">
              <a href="./contacts" className="text-sm hover:text-gray-300">Find our Store</a>
            </div>
          </div>
        </div>
        
        {/* Main Header */}
        <div className="container mx-auto py-4 px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <button onClick={toggleMenu} className="mr-4 md:hidden">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <a href="/" className="text-2xl font-bold">TREMONT HARDWARE</a>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="/" className="hover:text-yellow-400">Home</a>
              <a href="#" className="text-yellow-400 border-b-2 border-yellow-400 pb-1">Products</a>
              <a href="./services" className="hover:text-yellow-400">Services</a>
              <a href="./about" className="hover:text-yellow-400">About</a>
              <a href="./contacts" className="hover:text-yellow-400">Contact</a>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button onClick={toggleCart} className="relative">
                  <ShoppingCart size={24} className=" hover:text-yellow-400 cursor-pointer" />
                  {cartItems.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-yellow-400 text-gray-800 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItems.reduce((total, item) => total + item.quantity, 0)}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-gray-700 px-4 py-2">
            <nav className="flex flex-col space-y-2 my-4">
              <a href="/" className="py-2 px-4 hover:bg-gray-600 rounded">Home</a>
              <a href="#" className="py-2 px-4 bg-gray-600 rounded text-yellow-400">Products</a>
              <a href="./services" className="py-2 px-4 hover:bg-gray-600 rounded">Services</a>
              <a href="./contacts" className="py-2 px-4 hover:bg-gray-600 rounded">About</a>
              <a href="./about" className="py-2 px-4 hover:bg-gray-600 rounded">Contact</a>
            </nav>
          </div>
        )}
      </header>
      
      {/* Page Title */}
      <section className="bg-gradient-to-r from-gray-700 to-gray-900 text-white py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Products</h1>
          <div className="flex items-center text-sm mt-2">
            <a href="/" className="hover:text-yellow-400">Home</a>
            <span className="mx-2">›</span>
            <span className="text-yellow-400">Products</span>
          </div>
        </div>
      </section>
      
      {/* Main Content */}
      <section className="py-8 bg-gray-100 flex-grow">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row">
            {/* Filters Sidebar (Desktop) */}
            <div className="hidden md:block md:w-1/4 lg:w-1/5 pr-6">
              {/* SEARCH FUNCTIONALITY - SEARCH BOX */}
              <div className="bg-white rounded-lg shadow-md p-4 mb-3">
                <h3 className="font-bold text-lg mb-4">Search Products</h3>
                <div className="relative">
                  <input 
  type="text" 
  placeholder="Search products..." 
  value={searchQuery}
  onChange={handleSearchChange}
  className="bg-gray-700 rounded-full px-4 py-1 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
/>
                  <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                {searchQuery && (
                  <div className="mt-2 text-sm text-gray-600">
                    Found {filteredProducts.length} products
                  </div>
                )}
              </div>

              <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <h3 className="font-bold text-lg mb-4">Categories</h3>
                <ul className="space-y-2">
                  {categories.map((category, index) => (
                    <li key={index}>
                      <label className="flex items-center cursor-pointer">
                        
                        <span className="ml-2">{category}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
              
              </div>
            
            {/* Products Area */}
            <div className="md:w-3/4 lg:w-4/5">
              {/* SEARCH FUNCTIONALITY - MOBILE SEARCH BOX */}
              <div className="md:hidden mb-4">
                <div className="bg-white rounded-lg shadow-md p-2">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    />
                    <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                  {searchQuery && (
                    <div className="mt-2 text-sm text-gray-600">
                      Found {filteredProducts.length} products
                    </div>
                  )}
                </div>
              </div>

              {/* Desktop View Controls */}
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-gray-600">
                    Showing <span className="font-semibold">{((currentPage - 1) * productsPerPage) + 1}-{Math.min(currentPage * productsPerPage, filteredProducts.length)}</span> of <span className="font-semibold">{filteredProducts.length}</span> products
                    {searchQuery && <span className="ml-2 text-yellow-600 font-medium">(filtered)</span>}
                  </p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border rounded-lg overflow-hidden">
                    <button 
                      onClick={() => setViewMode('grid')} 
                      className={`p-2 ${viewMode === 'grid' ? 'bg-yellow-500 text-gray-900' : 'bg-gray-200 text-gray-700'}`}
                    >
                      <Grid size={16} />
                    </button>
                    <button 
                      onClick={() => setViewMode('list')} 
                      className={`p-2 ${viewMode === 'list' ? 'bg-yellow-500 text-gray-900' : 'bg-gray-200 text-gray-700'}`}
                    >
                      <List size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* No Results Message */}
              {searchQuery && filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <Search size={64} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
                  <p className="text-gray-500 mb-4">
                    No products match your search for "{searchQuery}". Try different keywords or browse our categories.
                  </p>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold px-4 py-2 rounded transition duration-300"
                  >
                    Clear Search
                  </button>
                </div>
              )}
              
              {/* Products Grid View */}
              {viewMode === 'grid' && products.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {products.map(product => (
                    <div key={`${product.id}-${product.name}-${product.brand}`} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
                      <div className="relative">
                        <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
                        <div className="absolute top-2 right-2 bg-yellow-500 text-xs font-bold uppercase rounded-full py-1 px-2">
                          {product.category}
                        </div>
                        {!product.inStock && (
                          <div className="absolute inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center">
                            <span className="bg-red-600 text-white px-3 py-1 rounded-lg font-semibold">Out of Stock</span>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="flex items-center mb-1">
                          {renderStars(product.rating)}
                          <span className="text-sm text-gray-600 ml-1">({product.rating})</span>
                        </div>
                        <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{product.brand}</p>
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-xl font-bold text-gray-800">Ksh{product.price.toFixed(2)}</span>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <button 
                            onClick={() => addToCart(product)}
                            disabled={!product.inStock}
                            className={`w-full justify-center items-center mt-1 flex py-2 font-semibold rounded-4xl shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 transition duration-300 ${
                              product.inStock 
                                ? 'bg-gray-800 hover:bg-yellow-500 text-white hover:text-gray-900' 
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                          >
                            Add to Cart
                          </button>
                          <a
                            href={`https://wa.me/254700761283?text=Hello,%20I%20would%20like%20to%20buy%20the%20product:%20${product.name}%20of%20${product.brand}%20Brand%20for%20KES${product.price}%20.Thank%20You.`}
                            target="_blank"
                            rel="noopener"
                            className="w-full flex items-center justify-center px-4 py-2 bg-green-500 text-white font-semibold rounded-4xl shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.105 1.523 5.84L0 24l6.293-1.523A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm6.29 17.71c-.26.73-1.52 1.39-2.09 1.48-.55.09-1.22.13-1.97-.15-.45-.17-1.03-.35-1.77-.68-3.1-1.34-5.1-4.5-5.26-4.71-.15-.21-1.26-1.68-1.26-3.21 0-1.53.8-2.29 1.08-2.61.26-.31.57-.39.77-.39.2 0 .39.002.56.01.18.01.42-.07.66.51.26.61.88 2.1.96 2.25.08.15.13.33.03.53-.09.2-.13.33-.26.51-.13.18-.27.39-.39.52-.13.13-.26.27-.11.52.15.26.67 1.1 1.44 1.78.99.88 1.83 1.15 2.08 1.28.26.13.41.11.56-.08.15-.18.65-.76.82-1.02.18-.26.36-.22.61-.13.26.08 1.67.79 1.96.93.29.13.48.22.55.34.08.13.08.75-.18 1.48z"/>
                            </svg>
                            Buy via WhatsApp
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Products List View */}
              {viewMode === 'list' && products.length > 0 && (
                <div className="space-y-4">
                  {products.map(product => (
                    <div key={`${product.id}-${product.name}-${product.brand}`} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
                      <div className="flex flex-col sm:flex-row">
                        <div className="relative sm:w-1/3 lg:w-1/4">
                          <img src={product.image} alt={product.name} className="w-full h-48 sm:h-full object-cover" />
                          <div className="absolute top-2 right-2 bg-yellow-500 text-xs font-bold uppercase rounded-full py-1 px-2">
                            {product.category}
                          </div>
                          {!product.inStock && (
                            <div className="absolute inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center">
                              <span className="bg-red-600 text-white px-3 py-1 rounded-lg font-semibold">Out of Stock</span>
                            </div>
                          )}
                        </div>
                        <div className="p-4 sm:w-2/3 lg:w-3/4">
                          <div className="flex items-center mb-1">
                            {renderStars(product.rating)}
                            <span className="text-sm text-gray-600 ml-1">({product.rating})</span>
                          </div>
                          <h3 className="text-xl font-semibold mb-1">{product.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">Brand: {product.brand}</p>
                          <p className="text-gray-700 mb-4 hidden sm:block">
                            High-quality hardware tool perfect for both professional and home use.
                          </p>
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
                            <span className="text-2xl font-bold text-gray-800">Ksh{product.price.toFixed(2)}</span>
                            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                              <button 
                                onClick={() => addToCart(product)}
                                disabled={!product.inStock}
                                className={`rounded-4xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 transition duration-300 ${
                                  product.inStock 
                                    ? 'bg-gray-800 hover:bg-yellow-500 text-white hover:text-gray-900' 
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                              >
                                Add to Cart
                              </button>
                              <button 
                                onClick={() => buyWithWhatsApp(product)}
                                disabled={!product.inStock}
                                className={`rounded-4xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 transition duration-300 flex items-center justify-center ${
                                  product.inStock 
                                    ? 'bg-green-500 hover:bg-green-700 text-white'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                              >
                                <MessageCircle size={16} className="mr-1" />
                                Buy via WhatsApp
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <nav className="inline-flex rounded-md shadow" >
                    <button 
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                      className={`py-2 px-4 rounded-l-md transition duration-300 ${
                        currentPage === 1 
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Previous
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button 
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`py-2 px-4 transition duration-300 ${
                          currentPage === page 
                            ? 'bg-yellow-500 text-gray-900 font-semibold' 
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    
                    <button 
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      className={`py-2 px-4 rounded-r-md transition duration-300 ${
                        currentPage === totalPages 
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Next
                    </button>
                  </nav>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Shopping Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={toggleCart}></div>
          <div className="relative w-full max-w-md bg-white shadow-xl h-full flex flex-col">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold">Shopping Cart</h2>
              <button onClick={toggleCart} className="p-1 hover:bg-gray-100 rounded-full">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-grow overflow-auto p-4">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-gray-500">
                  <ShoppingCart size={64} className="mb-4" />
                  <p className="text-lg mb-2">Your cart is empty</p>
                  <p className="mb-6">Add items to get started</p>
                  <button 
                    onClick={toggleCart}
                    className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold px-4 py-2 rounded-4xl transition duration-300"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map(item => (
                    <div key={item.product.id} className="flex items-center border-b border-gray-200 pb-4">
                      <img src={item.product.image} alt={item.product.name} className="w-16 h-16 object-cover rounded" />
                      <div className="ml-4 flex-grow">
                        <h4 className="font-semibold">{item.product.name}</h4>
                        <div className="flex justify-between items-center mt-1">
                          <div className="flex items-center">
                            <button 
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="border rounded-l w-8 h-8 flex items-center justify-center hover:bg-gray-100"
                            >
                              -
                            </button>
                            <span className="border-t border-b w-10 h-8 flex items-center justify-center">
                              {item.quantity}
                            </span>
                            <button 
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="border rounded-r w-8 h-8 flex items-center justify-center hover:bg-gray-100"
                            >
                              +
                            </button>
                          </div>
                          <span className="font-semibold">Ksh{(item.product.price * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.product.id)}
                        className="ml-2 text-gray-500 hover:text-red-600"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {cartItems.length > 0 && (
              <div className="p-4 border-t border-gray-200">
                <div className="flex justify-between mb-4">
                  <span className="font-semibold">Subtotal:</span>
                  <span className="font-bold">Ksh{cartTotal.toFixed(2)}</span>
                </div>
                <p className="text-sm text-gray-600 mb-4">Shipping and taxes calculated at checkout</p>
                <div className="space-y-2">
                  <button 
                    onClick={() => generateInvoice('Credit Card')}
                    className="bg-gray-800 hover:bg-yellow-500 text-white hover:text-gray-900 w-full py-3 rounded-lg font-semibold transition duration-300 flex items-center justify-center"
                  >
                    <CreditCard size={16} className="mr-2" />
                    View Invoice & Pay
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* MPESA Payment Modal */}
      {showMpesaModal && (
        <div className="fixed z-100 bg-green-50 inset-0 flex place-items-center-safe justify-center">
          <div className="fixed inset-1 bg-opacity-0" onClick={() => setShowMpesaModal(false)}></div>
          <div className="relative w-90 border-2 bg-white border-green-600 rounded-3xl shadow-xl max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold flex items-center">
                <Phone size={24} className="mr-2 text-green-600" />
                LIPA NA MPESA
              </h2>
              <button onClick={() => setShowMpesaModal(false)} className="p-1 hover:bg-gray-100 rounded-full">
                <X size={20} className='text-red-500'/>
              </button>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h3 className="font-semibold mb-2">Order Summary</h3>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>KSh {currentInvoice?.total ? currentInvoice.total.toFixed(2) : '0.00'}</span>
                </div>
                
                <div className="flex justify-between font-bold border-t pt-1">
                  <span>Total:</span>
                  <span>KSh {currentInvoice?.total ? currentInvoice.total.toFixed(2) : '0.00'}</span>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="0712345678"
                value={mpesaPhone}
                disabled={mpesaLoading}
                onChange={(e) => setMpesaPhone(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount to Pay
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={`KSh ${currentInvoice?.total ? currentInvoice.total.toFixed(2) : '0.00'}`}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-green-600 font-semibold">✓</span>
                </div>
              </div>
            </div>

            {(!currentInvoice?.total || currentInvoice.total <= 0) && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm">⚠️ Invalid payment amount. Please check your order.</p>
              </div>
            )}

            <div className='w-full flex justify-center rounded-lg items-center space-x-8'>
              <button
                onClick={handleMpesaPayment}
                disabled={mpesaLoading}
                className="hover:cursor-pointer mt-3 flex bg-green-500 hover:bg-green-700 text-white font-semibold py-2 px-3 transition-colors duration-200 sm:rounded-lg"
              >
                {mpesaLoading ? 'Processing...' : 'Send Payment Request'}
              </button>
              
              <div className="w-fit items-center justify-between space-x-4">
                <button
                  type="button"
                  onClick={() => setShowMpesaModal(false)}
                  className="mt-3 rounded-md bg-red-300 hover:bg-red-700 hover:text-amber-50 text-gray-800 font-bold py-2 px-4 transition duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>

            {mpesaMessage && (
              <div className={`mt-4 p-3 rounded-md border ${
                mpesaMessage.includes('sent') || mpesaMessage.includes('success') 
                  ? 'bg-green-50 border-green-200 text-green-700' 
                  : 'bg-red-50 border-red-200 text-red-700'
              }`}>
                {mpesaMessage}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {showInvoice && currentInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-gray-700 bg-opacity-50" onClick={() => setShowInvoice(false)}></div>
          <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-screen overflow-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Invoice</h2>
              
              <button className="p-1 bg-gray-800 hover:bg-yellow-500 text-white rounded-lg flex items-center"
                   onClick={() => window.print()}>
                <FileText size={16} className="mr-1" /> Download PDF
                </button>
                <button onClick={() => setShowInvoice(false)} className="p-1 hover:bg-gray-100 rounded-full">
                <X size={20} />
              </button>
            </div>
            
            <div className="border-2 z-10 rounded-lg  mb-6">
              <div className="flex justify-between items-start">
                <div className='p-2'>
                  <h1 className="text-xl font-bold text-gray-800 mb-1">TREMONT HARDWARE</h1>
                  <address className="not-italic text-gray-600">
                    Allied Place<br />
                    Sheikh Karume, Nairobi<br />
                    0700 761 283
                  </address>
                </div>
                <div className="p-2 text-right">
                  <h2 className="text-xl font-bold text-gray-800 mb-1">INVOICE</h2>
                  <p className="text-gray-600 mb-1"><span className="font-semibold">Invoice #:</span> {currentInvoice.invoiceNumber}</p>
                  <p className="text-gray-600 mb-1"><span className="font-semibold">Date:</span> {currentInvoice.invoiceDate}</p>
                  <p className="text-gray-600"><span className="font-semibold">Status:</span> 
                    <span className={`font-semibold ml-1 ${
                      currentInvoice.status === 'Paid' ? 'text-green-600' : 'text-blue-600'
                    }`}>
                      {currentInvoice.status}
                    </span>
                  </p>
                </div>
              </div>
              
              <div className="p-2 mb-1">
                <h3 className="text-red-800 font-bold mb-1">NOTE:</h3>
                <p>This is a computer generated receipt and is not proof of payment.</p>
              </div>
              
              <div className="mb-2">
                <table className="w-fit">
                  <thead className='w-fit'>
                    <tr className="bg-gray-100 max-w-fit">
                      <th className="py-3 px-1 font-semibold">Item</th>
                      <th className="py-3 px-1 font-semibold">Qty</th>
                      <th className="py-3 px-1 font-semibold">Price</th>
                      <th className="py-3 px-1 font-semibold">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentInvoice.items.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-3 px-4">{item.product.name}</td>
                        <td className="py-3 px-4">{item.quantity}</td>
                        <td className="py-3 px-4">
                          {currentInvoice.paymentMethod === 'MPESA' 
                            ? `KSh ${(item.product.price).toFixed(2)}`
                            : `${item.product.price.toFixed(2)}`
                          }
                        </td>
                        <td className="py-3 px-4 text-right">
                          {currentInvoice.paymentMethod === 'MPESA' 
                            ? `KSh ${(item.product.price * item.quantity).toFixed(2)}`
                            : `${(item.product.price * item.quantity).toFixed(2)}`
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="flex justify-end p-2">
                <div className="w-64">
                  <div className="flex justify-between py-2">
                    <span className="font-semibold">Subtotal:</span>
                    <span>
                      {currentInvoice.paymentMethod === 'MPESA' 
                        ? `KSh ${(currentInvoice.subtotal).toFixed(2)}`
                        : `${currentInvoice.subtotal.toFixed(2)}`
                      }
                    </span>
                  </div>
                  
                  <div className="flex justify-between py-2 border-t border-gray-300 text-lg font-bold">
                    <span>Total:</span>
                    <span>
                      {currentInvoice.paymentMethod === 'MPESA' 
                        ? `KSh ${currentInvoice.total.toFixed(2)}`
                        : `${currentInvoice.total.toFixed(2)}`
                      }
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-300 pt-4 mb-2 p-2">
                <h3 className="text-gray-800 font-bold mb-2">Payment Information</h3>
                <p className="text-gray-600 mb-1"><span className="font-semibold">Method:</span> M-PESA </p>
                <p className="text-gray-600"><span className="font-semibold">Date:</span> {currentInvoice.invoiceDate}</p>
              </div>
            </div>
            
            <div className="flex justify-center space-x-4">
              <button 
                onClick={() => setShowInvoice(false)}
                className=" bg-red-800 text-white hover:bg-red-600 font-semibold px-6 py-2 rounded-lg transition duration-300"
              >
                Close
              </button>
              <button 
                    onClick={() => setShowMpesaModal(true)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition duration-300 flex items-center justify-center"
                  >
                    <Phone size={16} className="mr-2" />
                    Pay with MPESA
                  </button>
            </div>
          </div>
        </div>
      )}

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-yellow-500 hover:bg-yellow-600 text-gray-900 p-3 rounded-full shadow-lg transition duration-300 z-40"
        >
          <ChevronUp size={24} />
        </button>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-12 pb-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">TREMONT HARDWARE</h3>
              <p className="text-gray-400 mb-4">Serving our community with quality products and expert advice since 2016.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <Facebook size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <Instagram size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <Twitter size={20} />
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="./" className="text-gray-400 hover:text-yellow-500">Home</a></li>
                <li><a href="./about" className="text-gray-400 hover:text-yellow-500">About Us</a></li>
                <li><a href="./products" className="text-gray-400 hover:text-yellow-500">Shop Now</a></li>
                <li><a href="./services" className="text-gray-400 hover:text-yellow-500">Services</a></li>
                <li><a href="./contacts" className="text-gray-400 hover:text-yellow-500">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-yellow-500">FAQ</a></li>
                <li><a href="#" className="text-gray-400 hover:text-yellow-500">Privacy Policy</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <MapPin size={18} className="mr-2 mt-1 text-yellow-500" />
                  <span className="text-gray-400">Allied Place, Sheikh Karume RD<br />Nairobi, KE</span>
                </li>
                <li className="flex items-center">
                  <Phone size={18} className="mr-2 text-yellow-500" />
                  <span className="text-gray-400">+254 (0) 700 761-283 / </span>
                  <span className="text-gray-400">+254 (0) 729 675 159</span>
                </li>
                <li className="flex items-center">
                  <Mail size={18} className="mr-2 text-yellow-500" />
                  <span className="text-gray-400">eliqamaa98@gmail.com</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-6 text-sm text-gray-500 text-center">
            <p>&copy; {new Date().getFullYear()} Tremont Hardware. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}