import { useState, useEffect } from 'react';
import { ChevronUp, MapPin, Phone, Mail, Clock, Send, X, Menu, Search, ShoppingCart, Facebook, Instagram, Twitter } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  type FormErrors = {
    name?: string;
    email?: string;
    subject?: string;
    message?: string;
    [key: string]: string | undefined;
  };

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount] = useState(0);
  
  // BACK TO TOP STATE
  const [showBackToTop, setShowBackToTop] = useState(false);

  // BACK TO TOP EFFECT
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

  // SCROLL TO TOP FUNCTION
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Optionally clear error for the field being edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: undefined
      });
    }
  };
  
  // Validation function for form fields
  const validate = (): FormErrors => {
    const errors: FormErrors = {};
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
      errors.email = 'Invalid email address';
    }
    if (!formData.subject.trim()) {
      errors.subject = 'Subject is required';
    }
    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    }
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    }, 1500);
  };
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  
  
  return (
    <div className="min-h-screen bg-gray-50">
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
            
            <div className="hidden font-semibold md:flex items-center space-x-8">
              <a href="./" className="hover:text-yellow-400">Home</a>
              <a href="./products" className="hover:text-yellow-400">Products</a>
              <a href="./services" className="hover:text-yellow-400">Services</a>
              <a href="./about" className="hover:text-yellow-400">About</a>
              <a href="./contacts" className="hover:text-white text-yellow-500">Contact</a>
            </div> 
            
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-gray-700 px-4">
            <nav className="flex flex-col space-y-2 my-4">
              <a href="./" className="py-2 px-4 hover:bg-gray-600 rounded">Home</a>
              <a href="./products" className="py-2 px-4 hover:bg-gray-600 rounded">Products</a>
              <a href="./services" className="py-2 px-4 hover:bg-gray-600 rounded">Services</a>
              <a href="./about" className="py-2 px-4 hover:bg-gray-600 rounded">About</a>
              <a href="./contacts" className="py-2 px-4 hover:bg-gray-600 rounded text-yellow-500 hover:text-white">Contact</a>
            </nav>
          </div>
        )}
      </header>
      
      {/* Page title */}
      <div className="bg-gray-100 border-b border-gray-200">
        <div className="container mx-auto px-4 py-5">
          <h1 className="text-3xl font-bold text-gray-800">Contact Us</h1>
          <div className="flex items-center text-sm text-gray-500">
            <a href="/" className="hover:text-yellow-600">Home</a>
            <span className="mx-2">{">"}</span>
            <span className="text-yellow-600">Contact</span>
          </div>
        </div>
      </div>

      {/* Contact content */}
      <div className="container mx-auto px-4 py-1">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Contact information */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold mb-3 text-gray-800">Get In Touch</h2>
              <p className="text-gray-600 mb-6">
                Have questions about our products or services? Need assistance with an order? 
                We'd love to hear from you! Fill out the form or use our contact information below.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-yellow-100 rounded-full p-3 mr-4">
                    <MapPin size={20} className="text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Our Location</h3>
                    <p className="text-gray-600">Allied Place, Sheikh Karume Rd <br />Nairobi </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-yellow-100 rounded-full p-3 mr-4">
                    <Phone size={20} className="text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Call Us</h3>
                    <p className="text-gray-600">+254 (0) 700 761-283</p>
                    <p className="text-gray-600">+254 (0) 729 675-159</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-yellow-100 rounded-full p-3 mr-4">
                    <Mail size={20} className="text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Email Us</h3>
                    <p className="text-gray-600">eliqamaa98@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-yellow-100 rounded-full p-3 mr-4">
                    <Clock size={20} className="text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Business Hours</h3>
                    <p className="text-gray-600">
                      Monday - Friday: 7:00 AM - 6:30 PM<br />
                      Saturday: 8:00 AM - 5:00 PM<br />
                      Sunday: 11:00 AM - 3:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
           
        {/* Map */}
        <div className="mt-4 mb-12 bg-white rounded-lg shadow-sm p-2" id='map'>
          <div className="rounded-lg overflow-hidden h-96 bg-gray-200 flex justify-center items-center ">
            <div className="text-center object-cover w-full h-full">
              <iframe className='w-full h-full' src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.8153917051445!2d36.825569474080666!3d-1.2847102356225337!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f11290d835c59%3A0x4c8004af144a325b!2sSheikh%20Karume%20Rd%2C%20Nairobi!5e0!3m2!1sen!2ske!4v1747995596135!5m2!1sen!2ske"></iframe>
            </div>
          </div>
        </div>

          {/* Contact form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold mb-3 text-gray-800">Send Us a Message</h2>
              
              {isSubmitted ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Send size={24} className="text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-green-800 mb-2">Message Sent Successfully!</h3>
                  <p className="text-green-600 mb-4">
                    Thank you for reaching out to us. We'll respond to your inquiry as soon as possible.
                  </p>
                  <button 
                    onClick={() => setIsSubmitted(false)}
                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition duration-300"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <div onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-gray-700 mb-2">Your Name *</label>
                      <input 
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                        placeholder="Enter Your Name"
                      />
                      {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 mb-2">Email Address *</label>
                      <input 
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                        placeholder="Enter Your Email"
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 mb-2">Phone Number (Optional)</label>
                      <input 
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        placeholder="your phone number"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 mb-2">Subject *</label>
                      <input 
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 rounded-lg border ${errors.subject ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                        placeholder="Product inquiry"
                      />
                      {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-gray-700 mb-2">Your Message *</label>
                    <textarea 
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      className={`w-full px-4 py-2 rounded-lg border ${errors.message ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                      placeholder="How can we help you?"
                    ></textarea>
                    {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                  </div>
                  
                  <div className="flex justify-end">
                    <button 
                      type="submit"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-medium py-2 px-6 rounded-lg transition duration-300 flex items-center"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-gray-900 mr-2"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send size={16} className="ml-2" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
       
        
        {/* FAQ */}
        <div className="mt-4 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-2">What are your store hours?</h3>
              <p className="text-gray-600">
                We're open Monday through Friday from 7:00 AM to 6:30 PM, Saturday from 8:00 AM to 5:00 PM, 
                and Sunday from 11:00 AM to 3:00 PM. We may have shorter hours during holidays.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-2">Do you offer delivery services?</h3>
              <p className="text-gray-600">
                Yes, we offer local delivery for orders over Ksh 5,000 within a 20-km radius of our store. 
                For larger items or special orders, special delivery arrangements can be made. Please call us for details.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-2">What's your return policy?</h3>
              <p className="text-gray-600">
                We accept returns within 3 days of purchase with a valid receipt. Items must be in original condition and packaging. 
                Some restrictions apply for electrical components, special orders, and clearance items.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-2">Do you price match?</h3>
              <p className="text-gray-600">
                Occassionally, we're happy to match the price of identical items from local competitors. 
                Simply bring in the competitor's current ad or show us the price on their website, and we'll match it.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* BACK TO TOP BUTTON */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 bg-yellow-500 hover:bg-yellow-600 text-gray-900 p-3 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl transform hover:scale-110"
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