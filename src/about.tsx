import { useState, useEffect } from 'react';
import {  ChevronUp, Menu, X, Phone, Mail, MapPin, ArrowRight, Facebook, Instagram, Twitter, Users, Clock, Award, Hammer } from 'lucide-react';

export default function AboutPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
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



  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const teamMembers = [
    { name: 'Elijah Muriuki', position: 'Founder & CEO', image: '', bio: 'Started Tremont Hardware in 2016 with a vision to provide quality tools and exceptional service to the community.' },
    { name: 'Sarah Johnson', position: 'General Manager', image: '', bio: 'With 15 years of experience in retail management, Sarah ensures our store operations run smoothly and efficiently.' },
  ];
  
  const milestones = [
    { year: '2016', title: 'Grand Opening', description: 'Tremont Hardware opened its doors for the first time along Luthuli Lane.' },
    { year: '2019', title: 'Expansion', description: 'Expanded our store to include a wider range of products and services.' },
    { year: '2020', title: 'Modern Renovation', description: 'Completely renovated our store with modern fixtures and improved layout.' },
    { year: '2025', title: 'Online Presence', description: 'Launched our first website to reach customers beyond our local community.' },
    { year: '2026', title: '10th Anniversary', description: ' We shall Celebrate a decade of service with a community event and special promotions.' },
    
  ];
  
  const values = [
    { title: 'Quality', icon: <Award size={32} className="text-yellow-500" />, description: 'We stand behind every product we sell with a satisfaction guarantee.' },
    { title: 'Expertise', icon: <Hammer size={32} className="text-yellow-500" />, description: 'Our staff are knowledgeable and trained to help with any project.' },
    { title: 'Community', icon: <Users size={32} className="text-yellow-500" />, description: "We're proud to be a part of the Tremont community for close to 10 years." },
    { title: 'Service', icon: <Clock size={32} className="text-yellow-500" />, description: 'We provide prompt, friendly service to every customer who walks through our doors.' },
  ];
  
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
              <a href="./" className="hover:text-yellow-400">Home</a>
              <a href="./products" className="hover:text-yellow-400">Products</a>
              <a href="./services" className="hover:text-yellow-400">Services</a>
              <a href="./about" className="text-yellow-400 hover:text-white">About</a>
              <a href="./contacts" className="hover:text-yellow-400">Contact</a>
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
              <a href="./about" className="py-2 px-4 hover:bg-gray-600 rounded text-yellow-400">About</a>
              <a href="./contacts" className="py-2 px-4 hover:bg-gray-600 rounded">Contact</a>
            </nav>
          </div>
        )}
      </header>
      
      {/* Page Title */}
      <section className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Tremont Hardware</h1>
          <p className="text-lg max-w-3xl mx-auto">Your trusted neighborhood hardware store serving the Tremont community since 2016.</p>
        </div>
      </section>
      
      {/* Our Story */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-gray-700 mb-4">
                Tremont Hardware was founded in 2016 by Elijah Muriuki, a former contractor who saw the need for a local hardware store that truly understood the needs of professionals and homeowners alike.
              </p>
              <p className="text-gray-700 mb-4">
                What started as a small shop with basic tools and supplies has grown into a comprehensive hardware destination, offering lots of products, expert advice, and specialized services to help our customers tackle projects of any size.
              </p>
              <p className="text-gray-700">
                Through economic ups and downs, technological changes, and shifts in the retail landscape, our commitment to quality, service, and community has remained unwavering. We believe in being more than just a store – we're your project partners.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Our Values */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300">
                <div className="flex justify-center mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-center mb-2">{value.title}</h3>
                <p className="text-gray-600 text-center">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* History Timeline */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Journey</h2>
          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex flex-col md:flex-row items-start">
                <div className="md:w-1/6 mb-4 md:mb-0">
                  <span className="bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded-lg">{milestone.year}</span>
                </div>
                <div className="md:w-5/6 bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold mb-2">{milestone.title}</h3>
                  <p className="text-gray-700">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Meet the Team */}
      <section className="py-12 bg-gray-800 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-gray-700 rounded-lg overflow-hidden hover:bg-gray-600 transition duration-300">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-64 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-yellow-400 mb-3">{member.position}</p>
                  <p className="text-gray-300">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

{/*Back to top button*/}
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
      
      {/* Customer Testimonials */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-100 rounded-lg p-6 relative">
              <div className="text-yellow-500 text-4xl font-serif absolute top-4 left-4">"</div>
              <p className="text-gray-700 mb-4 pt-6">
                The staff at Tremont Hardware are always so helpful. They helped me find exactly what I needed for my bathroom renovation project and even gave me tips on installation.
              </p>
              <div className="flex items-center">
                <div>
                  <p className="font-semibold">John P.</p>
                  <p className="text-sm text-gray-500">Loyal customer since 2017</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-100 rounded-lg p-6 relative">
              <div className="text-yellow-500 text-4xl font-serif absolute top-4 left-4">"</div>
              <p className="text-gray-700 mb-4 pt-6">
                I've been shopping at Tremont Hardware for over 6 years. Their product selection is unmatched and the quality is always top-notch. It's the only hardware store I trust.
              </p>
              <div className="flex items-center">
                <div>
                  <p className="font-semibold">Mary S.</p>
                  <p className="text-sm text-gray-500">Contractor</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-100 rounded-lg p-6 relative">
              <div className="text-yellow-500 text-4xl font-serif absolute top-4 left-4">"</div>
              <p className="text-gray-700 mb-4 pt-6">
                As a first-time homeowner, I was overwhelmed by all the tools I needed. The team at Tremont took the time to walk me through everything and helped me build my essential toolkit.
              </p>
              <div className="flex items-center">
                <div>
                  <p className="font-semibold">David K.</p>
                  <p className="text-sm text-gray-500">New homeowner</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Community Involvement */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-6">Community Involvement</h2>
              <p className="text-gray-700 mb-4">
                At Tremont Hardware, we believe in giving back to the community that has supported us for close to a decade. Each year, we organize and participate in various community events and initiatives.
              </p>
              <div className="space-y-4 mb-6">
                <div className="flex items-start">
                  <div className="bg-yellow-500 p-1 rounded-full mr-3 mt-1">
                    <ArrowRight size={16} className="text-gray-900" />
                  </div>
                  <p className="text-gray-700">Annual Charity Event</p>
                </div>
                <div className="flex items-start">
                  <div className="bg-yellow-500 p-1 rounded-full mr-3 mt-1">
                    <ArrowRight size={16} className="text-gray-900" />
                  </div>
                  <p className="text-gray-700">Sponsor of the Tremont Community Bursery</p>
                </div>
                <div className="flex items-start">
                  <div className="bg-yellow-500 p-1 rounded-full mr-3 mt-1">
                    <ArrowRight size={16} className="text-gray-900" />
                  </div>
                  <p className="text-gray-700">Tool donation program for vocational training</p>
                </div>
                <div className="flex items-start">
                  <div className="bg-yellow-500 p-1 rounded-full mr-3 mt-1">
                    <ArrowRight size={16} className="text-gray-900" />
                  </div>
                  <p className="text-gray-700">Volunteer home repair services for elderly residents</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-12 bg-yellow-500">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Visit Us Today</h2>
          <p className="text-gray-800 text-lg mb-8 max-w-3xl mx-auto">
            Experience the Tremont Hardware difference. Our knowledgeable staff is ready to help with your next project, big or small.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="./contacts" className="bg-gray-800 hover:bg-gray-900 text-white font-semibold px-6 py-3 rounded-lg transition duration-300">
              Find Our Store
            </a>
          </div>
        </div>
      </section>
      
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