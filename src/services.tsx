import { useState, useEffect } from "react";
import {
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  Facebook,
  Instagram,
  Twitter,
  Key,
  Droplet,
  Wrench,
  Hammer,
  Calendar,
  ChevronUp,
} from "lucide-react";

export default function ServicesPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const services = [
    {
      id: 1,
      name: "Key Cutting",
      description:
        "Professional key cutting service with quick turnaround times and competitive pricing. We can duplicate most residential, commercial, and automotive keys.",
      icon: <Key size={40} />,
      image: "/api/placeholder/600/400",
      benefits: [
        "Fast service - most keys ready in minutes",
        "Wide variety of key blanks available",
        "High-precision cutting for perfect fit",
        "Competitive pricing",
      ],
    },
    {
      id: 2,
      name: "Labour",
      description:
        "We have an arsenal of professional plumbers, painters, carpenters, electricians and many more. We are more than glad to connect you with workmen and women who are tested, approved and trusted.",
      icon: <Key size={40} />,
      image: "/api/placeholder/600/400",
      benefits: [
        "Quality service - 100% customer satisfaction",
        "Wide variety of servicess available",
        "Technical support",
        "Competitive pricing",
      ],
    },
    {
      id: 3,
      name: "Paint Mixing",
      description:
        "Custom paint mixing services with thousands of colors to choose from for your project. Our computerized system ensures perfect color matching every time.",
      icon: <Droplet size={40} />,
      image: "/api/placeholder/600/400",
      benefits: [
        "Computerized color matching technology",
        "Environmentally friendly paint options",
        "Sample sizes available for testing",
        "Expert advice on paint types and finishes",
      ],
    },
    {
      id: 4,
      name: "Repair Services",
      description:
        "Our skilled technicians can repair a wide range of tools and equipment, extending their lifespan and saving you money.",
      icon: <Wrench size={40} />,
      image: "/api/placeholder/600/400",
      benefits: [
        "Experienced, certified technicians",
        "Quick turnaround on most repairs",
        "Genuine replacement parts",
        "Warranty on all repair work",
      ],
    },
    {
      id: 5,
      name: "DIY Workshops",
      description:
        "Learn new skills with our regular DIY workshops taught by experienced professionals. Topics range from basic home repairs to advanced woodworking.",
      icon: <Calendar size={40} />,
      image: "/api/placeholder/600/400",
      benefits: [
        "Hands-on learning experience",
        "Small class sizes for personalized attention",
        "All materials provided",
        "Take-home projects and detailed handouts",
      ],
    },
  ];

  //BACK TO TOP LOGIC
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
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
              <span className="flex items-center">
                <Phone size={14} className="mr-1" /> +254 (0) 700 761 283
              </span>
              <span className="hidden md:flex items-center">
                <Mail size={14} className="mr-1" /> eliqamaa98@gmail.com
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <a href="./contacts" className="text-sm hover:text-gray-300">
                Find our Store
              </a>
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

            <div className="hidden md:flex font-semibold items-center space-x-8">
              <a href="./" className="hover:text-yellow-400">
                Home
              </a>
              <a href="./products" className="hover:text-yellow-400">
                Products
              </a>
              <a href="./services" className="text-yellow-400 hover:text-white">
                Services
              </a>
              <a href="./about" className="hover:text-yellow-400">
                About
              </a>
              <a href="./contacts" className="hover:text-yellow-400">
                Contact
              </a>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-gray-700 px-4">
            <nav className="flex flex-col space-y-2 my-4">
              <a href="./" className="py-2 px-4 hover:bg-gray-600 rounded">
                Home
              </a>
              <a
                href="./products"
                className="py-2 px-4 hover:bg-gray-600 rounded"
              >
                Products
              </a>
              <a
                href="./services"
                className="py-2 px-4 hover:bg-gray-600 rounded text-yellow-500"
              >
                Services
              </a>
              <a href="./about" className="py-2 px-4 hover:bg-gray-600 rounded">
                About
              </a>
              <a
                href="./contacts"
                className="py-2 px-4 hover:bg-gray-600 rounded"
              >
                Contact
              </a>
            </nav>
          </div>
        )}
      </header>

      {/* Page Title */}
      <section className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
          <p className="text-lg max-w-2xl">
            At Tremont Hardware, we offer a wide range of professional services
            to help you complete your projects with confidence. Our trained
            partners are ready to assist with everything you need.
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300 flex flex-col"
              >
                <div className="h-48 bg-gray-200 relative">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-40 flex items-center justify-center">
                    <div className="bg-yellow-500 rounded-full w-20 h-20 flex items-center justify-center">
                      <div className="text-gray-900">{service.icon}</div>
                    </div>
                  </div>
                </div>
                <div className="p-6 flex-grow">
                  <h3 className="text-2xl font-semibold mb-3">
                    {service.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Benefits:
                  </h4>
                  <ul className="text-gray-600 space-y-1 mb-6">
                    {service.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <ArrowRight
                          size={16}
                          className="text-yellow-500 mr-2 mt-1 flex-shrink-0"
                        />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Request Service */}
      <section className="py-12 bg-gray-100">
        <div className="md:w-1/2 bg-gray-800 text-white p-8 md:p-12">
          <h3 className="text-2xl font-bold mb-6">Service Hours</h3>
          <div className="space-y-3 mb-8">
            <div className="flex justify-between">
              <span>Monday - Friday</span>
              <span>7:00 AM -6:30 PM</span>
            </div>
            <div className="flex justify-between">
              <span>Saturday</span>
              <span>8:00 AM - 5:00 PM</span>
            </div>
            <div className="flex justify-between">
              <span>Sunday</span>
              <span>11:00 AM - 3:00 PM</span>
            </div>
          </div>

          <h3 className="text-2xl font-bold mb-6">Contact Us Directly</h3>
          <div className="space-y-4">
            <div className="flex items-start">
              <Phone size={20} className="mr-3 text-yellow-500 mt-1" />
              <div>
                <p className="font-semibold">Phone</p>
                <p className="text-gray-300"> 0700 761 283 \ 0729 675 159</p>
              </div>
            </div>

            <div className="flex items-start">
              <Mail size={20} className="mr-3 text-yellow-500 mt-1" />
              <div>
                <p className="font-semibold">Email</p>
                <p className="text-gray-300">eliqamaa98@gmail.com</p>
              </div>
            </div>

            <div className="flex items-start">
              <MapPin size={20} className="mr-3 text-yellow-500 mt-1" />
              <div>
                <p className="font-semibold">Address</p>
                <p className="text-gray-300">
                  Allied Place, Sheikh Karmue Rd <br />
                  Naiobi, KE
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            What Our Customers Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-yellow-500">
              <div className="flex items-center mb-4">
                <div>
                  <h4 className="font-semibold">Michael Kirumba</h4>
                  <div className="flex text-yellow-500">
                    <span>★★★★★</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600">
                "I'm amazed at how perfectly they matched my paint color from
                just a tiny chip! Their computerized system is impressive, and
                the quality of the paint is excellent."
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-yellow-500">
              <div className="flex items-center mb-4">
                <div>
                  <h4 className="font-semibold">Esther Osumba</h4>
                  <div className="flex text-yellow-500">
                    <span>★★★★★</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600">
                "I've taken three of their DIY workshops so far. The instructors
                are so knowledgeable and patient. I've learned skills I use all
                the time now around my house."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-3">
                How quickly can you cut keys?
              </h3>
              <p className="text-gray-600">
                Most standard keys can be cut while you wait, typically in less
                than 5 minutes per key. Specialized or high-security keys may
                take longer or require ordering.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-3">
                How do I sign up for DIY workshops?
              </h3>
              <p className="text-gray-600">
                You can register for workshops in-store, by phone, or through
                our website. Payment is required at registration to secure your
                spot, as class sizes are limited.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-3">
                Do you offer delivery for rental equipment?
              </h3>
              <p className="text-gray-600">
                Yes, we offer delivery and pickup for larger rental items within
                a 15-mile radius of our store. Delivery fees vary based on
                distance and equipment size.
              </p>
            </div>
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
          <a
            href="https://wa.me/254700761283"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 left-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg p-4 flex items-center justify-center transition duration-300"
            title="Chat with me on WhatsApp"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              className="w-6 h-6"
              viewBox="0 0 24 24"
            >
              <path d="M20.52 3.48A11.77 11.77 0 0 0 12.01 0C5.37 0 .01 5.36.01 12c0 2.11.55 4.16 1.59 5.98L0 24l6.26-1.64A11.86 11.86 0 0 0 12.01 24c6.63 0 11.99-5.36 11.99-12 0-3.19-1.24-6.19-3.48-8.52zM12 21.9c-1.95 0-3.88-.51-5.55-1.48l-.4-.23-3.71.97.99-3.61-.25-.43a9.9 9.9 0 0 1-1.43-5.23C2.65 6.3 6.93 2.1 12 2.1c2.63 0 5.1 1.02 6.95 2.86a9.77 9.77 0 0 1 2.89 6.94c0 5.07-4.28 9.2-9.84 9.2zm5.3-7.4c-.29-.14-1.72-.85-1.99-.95s-.46-.14-.66.14-.76.95-.93 1.15-.34.21-.63.07a8.1 8.1 0 0 1-2.38-1.47 8.74 8.74 0 0 1-1.6-1.99c-.17-.29 0-.45.13-.6.13-.14.29-.34.43-.51.14-.17.17-.29.26-.48.08-.17.04-.37-.02-.51s-.66-1.59-.9-2.17c-.24-.57-.48-.5-.66-.51h-.57c-.19 0-.5.07-.76.37s-1 1-.98 2.44 1 2.83 1.14 3.03c.14.19 2.04 3.12 4.95 4.38.7.3 1.25.48 1.67.62.7.22 1.34.19 1.85.12.57-.08 1.72-.7 1.96-1.37.24-.68.24-1.26.17-1.37-.06-.11-.26-.17-.54-.31z" />
            </svg>
          </a>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">TREMONT HARDWARE</h3>
              <p className="text-gray-400 mb-4">
                Serving our community with quality products and expert advice
                since 2016.
              </p>
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
                <li>
                  <a href="./" className="text-gray-400 hover:text-yellow-500">
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="./about"
                    className="text-gray-400 hover:text-yellow-500"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="./products"
                    className="text-gray-400 hover:text-yellow-500"
                  >
                    Shop Now
                  </a>
                </li>
                <li>
                  <a
                    href="./services"
                    className="text-gray-400 hover:text-yellow-500"
                  >
                    Services
                  </a>
                </li>
                <li>
                  <a
                    href="./contacts"
                    className="text-gray-400 hover:text-yellow-500"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-yellow-500">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-yellow-500">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <MapPin size={18} className="mr-2 mt-1 text-yellow-500" />
                  <span className="text-gray-400">
                    Allied Place, Sheikh Karume RD
                    <br />
                    Nairobi, KE
                  </span>
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
            <p>
              &copy; {new Date().getFullYear()} Tremont Hardware. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
