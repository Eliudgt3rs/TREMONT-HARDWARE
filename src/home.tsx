import { useState, useEffect } from 'react';
import { Menu, X, Phone, Mail, MapPin, ArrowRight, Facebook, Instagram, Twitter, ChevronUp, Paintbrush, Wrench, Hammer, Shield, Wallpaper, Package, Key, Palette, Settings } from 'lucide-react';
import { image } from 'html2canvas/dist/types/css/types/image';

function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Subscribe logic moved here
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleSubscribe = () => {
    if (!isSubscribed) {
      setIsClicked(true);
      setTimeout(() => setIsClicked(false), 200);
      setTimeout(() => setIsSubscribed(true), 600);
    }
  };
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const featuredProducts = [
    { 
      id: 9, 
      name: '3 Joint Flex Tap', 
      price: 299.99, 
      image: '3 Joint Flex Tap.jpg',
      rating: 4.1, 
      category: 'Plumbing', 
      brand: 'Black+Decker', 
      inStock: true 
    },
    { 
      id: 10, 
      name: 'Kitchen Sink Full Set', 
      price: 25000, 
      rating: 4.5, 
      category: 'Plumbing', 
      brand: 'Craftsman', 
      inStock: true 
    },
    { 
      id: 11, 
      name: 'High Grade Faucet', 
      price: 5000, 
      rating: 4.2, 
      category: 'Plumbing', 
      brand: 'Husky', 
      inStock: true 
    },
    { 
      id: 12, 
      name: 'Luxury Shower', 
      price: 13000, 
      rating: 4.3, 
      category: 'Plumbing', 
      brand: 'Ridgid', 
      inStock: true 
    },
  ];
  
  const categories = [
    { 
      name: 'Paints', 
      icon: Paintbrush 
    },
    { 
      name: 'Plumbing', 
      icon: Wrench 
    },
    { 
      name: 'Tools', 
      icon: Hammer 
    },
    { 
      name: 'Home Security', 
      icon: Shield 
    },
    { 
      name: 'Wallpapers', 
      icon: Wallpaper 
    },
    { 
      name: 'Others', 
      icon: Package 
    },
  ];
  
  // Back to top logic
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
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 text-white">
        {/* Top Bar */}
        <div className="bg-gray-900 py-2 px-4">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-4 text-sm">
              <span className="flex items-center"><Phone size={14} className="mr-1" /> +254 (0) 700 761 283</span>
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
              <div className="text-2xl font-bold">TREMONT HARDWARE</div>
            </div>
            
            <div className="hidden md:flex items-center font-semibold space-x-8">
              <a href="./" className="text-yellow-400 hover:text-white">Home</a>
              <a href="./products" className="hover:text-yellow-400">Products</a>
              <a href="./services" className="hover:text-yellow-400">Services</a>
              <a href="./about" className="hover:text-yellow-400">About</a>
              <a href="./contacts" className="hover:text-yellow-400">Contact</a>
            </div> 
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-gray-700 px-4">
            <nav className="flex flex-col space-y-2 my-4">
              <a href="./" className="py-2 px-4 hover:bg-gray-600 rounded text-yellow-400">Home</a>
              <a href="./products" className="py-2 px-4 hover:bg-gray-600 rounded">Products</a>
              <a href="./services" className="py-2 px-4 hover:bg-gray-600 rounded">Services</a>
              <a href="./about" className="py-2 px-4 hover:bg-gray-600 rounded">About</a>
              <a href="./contacts" className="py-2 px-4 hover:bg-gray-600 rounded">Contact</a>
            </nav>
          </div>
        )}
      </header>
    
      {/* Hero Section */}
      <section 
        className="bg-gradient-to-r from-gray-700 to-gray-900 text-white relative"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1510016290251-68aaad49723e?q=80&w=1476&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="container mx-auto px-4 py-10 md:py-20 flex flex-col md:flex-row">
          <div className="md:w-1/2 mb-2 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Quality Products and Tools for Every Project</h1>
            <p className="text-lg mb-8">Tremont Hardware has everything you need to get the job done right.</p>
            <div className="flex flex-wrap gap-4">
              <a href="./products" className="bg-yellow-500 hover:bg-gray-900 hover:scale-110 hover:text-yellow-500 text-gray-900 font-semibold px-6 py-3 rounded-4xl transition duration-300 flex items-center">
                Shop Now <ArrowRight size={16} className="ml-2" />
              </a>
              <a href="./services" className="bg-transparent border-2 border-white hover:bg-white hover:text-gray-900 hover:scale-110 text-white font-semibold px-6 py-3 rounded-4xl transition duration-300">
                Our Services
              </a>
            </div>
          </div>
        </div>
      </section>
      
      {/* Categories */}
      <section className="py-8 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-6">All Products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <a 
                  href="./products" 
                  key={index} 
                  className="bg-white rounded-lg shadow-md hover:shadow-lg p-4 flex flex-col items-center justify-center transition duration-500 group hover:scale-y-105"
                >
                  <div className="w-16 h-16 mb-4 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                    <IconComponent size={32} className="text-white" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 group-hover:text-yellow-600">{category.name}</h3>
                </a>
              );
            })}
          </div>
        </div>
      </section>
      
      {/* Featured Products */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold hover:text-amber-600 duration-300">Our Customers' Favorite Products</h2>
            <a href="./products" className="text-yellow-600 hover:text-yellow-600 font-medium flex items-center hover:scale-y-105 duration-300">
              View All Products <ArrowRight size={16} className="ml-1" />
            </a>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
  <div
    key={product.id}
    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg duration-500 hover:scale-105"
  >
    <div className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
      <img
        src={product.image}
        alt={product.name}
        className="h-full w-full object-cover"
      />
      <div className="absolute top-2 right-2 bg-yellow-500 text-xs font-bold uppercase rounded-full py-1 px-2">
        {product.category}
      </div>
    </div>
    <div className="p-4">
      <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
      <div className="flex justify-between items-center">
        <span className="text-xl font-bold text-gray-800">Ksh{product.price}</span>
        <a
          href={`https://wa.me/254700761283?text=Hello,%20I%20would%20like%20to%20buy%20the%20product:%20${product.name}%20of%20${product.brand}%20Brand%20for%20KES${product.price}%20.Thank%20You.`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-fit flex items-center justify-center px-4 py-2 bg-green-500 text-white font-semibold rounded-4xl shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.105 1.523 5.84L0 24l6.293-1.523A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm6.29 17.71c-.26.73-1.52 1.39-2.09 1.48-.55.09-1.22.13-1.97-.15-.45-.17-1.03-.35-1.77-.68-3.1-1.34-5.1-4.5-5.26-4.71-.15-.21-1.26-1.68-1.26-3.21 0-1.53.8-2.29 1.08-2.61.26-.31.57-.39.77-.39.2 0 .39.002.56.01.18.01.42-.07.66.51.26.61.88 2.1.96 2.25.08.15.13.33.03.53-.09.2-.13.33-.26.51-.13.18-.27.39-.39.52-.13.13-.26.27-.11.52.15.26.67 1.1 1.44 1.78.99.88 1.83 1.15 2.08 1.28.26.13.41.11.56-.08.15-.18.65-.76.82-1.02.18-.26.36-.22.61-.13.26.08 1.67.79 1.96.93.29.13.48.22.55.34.08.13.08.75-.18 1.48z" />
          </svg>
          WhatsApp
        </a>
      </div>
    </div>
  </div>
))}

          </div>
        </div>
      </section>
      
      {/* Services Section */}
      <section className="py-12 bg-gray-800 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-700 rounded-lg p-6 hover:bg-gray-600 transition duration-300">
              <div className="w-16 h-16 mb-4 bg-yellow-500 rounded-full flex items-center justify-center">
                <Key size={24} className="text-gray-900" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Key Cutting</h3>
              <p className="text-gray-300 mb-4">Professional key cutting service with quick turnaround times and competitive pricing.</p>
              <a href="./services" className="text-yellow-400 hover:text-yellow-300 font-medium">Learn More →</a>
            </div>
            
            <div className="bg-gray-700 rounded-lg p-6 hover:bg-gray-600 transition duration-300">
              <div className="w-16 h-16 mb-4 bg-yellow-500 rounded-full flex items-center justify-center">
                <Palette size={24} className="text-gray-900" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Paint Mixing</h3>
              <p className="text-gray-300 mb-4">Custom paint mixing services with thousands of colors to choose from for your project.</p>
              <a href="./services" className="text-yellow-400 hover:text-yellow-300 font-medium">Learn More →</a>
            </div>
            
            <div className="bg-gray-700 rounded-lg p-6 hover:bg-gray-600 transition duration-300">
              <div className="w-16 h-16 mb-4 bg-yellow-500 rounded-full flex items-center justify-center">
                <Settings size={24} className="text-gray-900" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Tool Rental</h3>
              <p className="text-gray-300 mb-4">Rent professional-grade tools for your home improvement projects at affordable rates.</p>
              <a href="./services" className="text-yellow-400 hover:text-yellow-300 font-medium">Learn More →</a>
            </div>
          </div>
        </div>
      </section>
      
      {/* Special Offer */}
      <section className="py-12 bg-yellow-500">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign Up & Save 10%</h2>
            <p className="text-gray-800 text-lg">Subscribe to our newsletter for exclusive deals and DIY tips.</p>
          </div>
          <div className="w-full md:w-1/2 lg:w-1/3 relative">
            <div className="flex">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="rounded-l-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-gray-800 bg-white"
              />
              <button 
                onClick={handleSubscribe}
                className={`
                  font-semibold px-8 py-4 rounded-r-lg transition-all duration-300 transform
                  ${isSubscribed 
                    ? 'bg-green-600 hover:bg-green-700 text-white cursor-default' 
                    : 'bg-gray-800 hover:bg-gray-900 text-white hover:scale-105'
                  }
                  ${isClicked ? 'scale-95 ring-4 ring-blue-300' : ''}
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500
                `}
                disabled={isSubscribed}
              >
                <div className="flex items-center space-x-2">
                  {isSubscribed ? (
                    <>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Subscribed!</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      <span>Subscribe</span>
                    </>
                  )}
                </div>
              </button>
            </div>
            
            {isSubscribed && (
              <div className="absolute top-full mt-4 left-0 right-0 z-10">
                <div className="bg-white rounded-lg shadow-lg p-4 border border-green-200">
                  <p className="text-green-700 font-medium">🎉 Welcome to our newsletter!</p>
                  <p className="text-gray-600 text-sm mt-1">You'll receive updates soon.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 bg-yellow-500 hover:bg-yellow-600 text-gray-900 p-3 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl"
          aria-label="Back to top"
          title="Back to top"
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

export default HomePage;