import React, { useState, useEffect, ReactElement } from "react";
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  Trash,
  Grid,
  List,
  ChevronDown,
  User,
  ArrowRight,
  ShieldCheck,
  Truck,
  Zap,
  LogIn,
  Package,
  FileText,
  CreditCard,
  Clock,
  Facebook,
  Instagram,
  Twitter,
  CheckCircle,
  AlertCircle,
  Smartphone,
  Star,
  SlidersHorizontal,
} from "lucide-react";
import { ChevronUp } from "lucide-react";
import jsPDF from "jspdf";

// Firebase imports
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { db, auth } from "./firebase.js"; // Import your firebase config

export default function ProductsPage() {
  // State Management
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  type Product = {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    rating: number;
    reviews?: number;
    image: string;
    category: string;
    brand: string;
    inStock: boolean;
    description?: string;
    tags?: string[];
    createdAt?: any;
  };

  type CartItem = {
    product: Product;
    quantity: number;
  };

  type User = {
    uid: string;
    name: string;
    email: string;
  };

  type Order = {
    id: string;
    date: string;
    items: CartItem[];
    status: string;
    total: number;
    customer: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      address: string;
      city: string;
      postalCode: string;
      country: string;
    };
    paymentMethod: string;
    paymentDetails: any;
    userId: string;
    createdAt: any;
  };

  type Invoice = {
    invoiceNumber: string;
    invoiceDate: string;
    customerName: string;
    customerEmail: string;
    items: CartItem[];
    subtotal: number;
    tax: number;
    total: number;
    paymentMethod: string;
    status: string;
  };

  // Cart and UI States
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Authentication States
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // Order and Invoice States
  const [showInvoice, setShowInvoice] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [showOrders, setShowOrders] = useState(false);

  // Checkout States
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [checkoutForm, setCheckoutForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "Kenya",
  });
  const [mpesaForm, setMpesaForm] = useState({ phoneNumber: "" });
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showOrderConfirmed, setShowOrderConfirmed] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [showMpesaModal, setShowMpesaModal] = useState(false);
  const [mpesaStatus, setMpesaStatus] = useState<
    "pending" | "success" | "failed" | null
  >(null);

  // Form States
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Product and Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000000 });
  const [selectedRating, setSelectedRating] = useState(0);
  const [sortBy, setSortBy] = useState("relevance");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(12);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Categories and Brands (you can also fetch these from Firestore)
  const [categories, setCategories] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);

  // Cart Storage Functions
  const CART_STORAGE_KEY = "tremont_hardware_cart";
  const CART_EXPIRY_DAYS = 7;

  // Save cart to localStorage with expiry
  const saveCartToStorage = (items: CartItem[]) => {
    try {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + CART_EXPIRY_DAYS);

      const cartData = {
        items: items,
        expiry: expiryDate.getTime(),
      };

      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartData));
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  };

  // Load cart from localStorage
  const loadCartFromStorage = (): CartItem[] => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (!savedCart) return [];

      const cartData = JSON.parse(savedCart);
      const now = new Date().getTime();

      // Check if cart has expired
      if (now > cartData.expiry) {
        localStorage.removeItem(CART_STORAGE_KEY);
        return [];
      }

      return cartData.items || [];
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
      localStorage.removeItem(CART_STORAGE_KEY);
      return [];
    }
  };

  // Clear cart from localStorage
  const clearCartFromStorage = () => {
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch (error) {
      console.error("Error clearing cart from localStorage:", error);
    }
  };

  // Authentication Effect
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || "User",
          email: firebaseUser.email || "",
        });
        setIsLoggedIn(true);
        // Load user's orders
        loadUserOrders(firebaseUser.uid);
      } else {
        setUser(null);
        setIsLoggedIn(false);
        setOrders([]);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCartItems = loadCartFromStorage();
    if (savedCartItems.length > 0) {
      setCartItems(savedCartItems);
    }
  }, []);

  // Save cart to localStorage whenever cartItems changes
  useEffect(() => {
    if (cartItems.length > 0) {
      saveCartToStorage(cartItems);
    } else {
      clearCartFromStorage();
    }
  }, [cartItems]);

  // Firebase Functions
  const fetchProductsFromFirestore = async () => {
    setLoading(true);
    setError(null);

    try {
      const collectionRef = collection(db, "products");
      const constraints: import("firebase/firestore").QueryConstraint[] = [];

      // Add filters
      if (selectedCategories.length > 0) {
        constraints.push(where("category", "in", selectedCategories));
      }

      if (selectedBrands.length > 0) {
        constraints.push(where("brand", "in", selectedBrands));
      }

      if (inStockOnly) {
        constraints.push(where("inStock", "==", true));
      }

      // Add sorting
      switch (sortBy) {
        case "price-low":
          constraints.push(orderBy("price", "asc"));
          break;
        case "price-high":
          constraints.push(orderBy("price", "desc"));
          break;
        case "rating":
          constraints.push(orderBy("rating", "desc"));
          break;
        case "newest":
          constraints.push(orderBy("createdAt", "desc"));
          break;
        case "name":
          constraints.push(orderBy("name", "asc"));
          break;
        default:
          constraints.push(orderBy("createdAt", "desc"));
          break;
      }

      let q;
      if (constraints.length > 0) {
        q = query(collectionRef, ...constraints);
      } else {
        q = collectionRef;
      }

      const querySnapshot = await getDocs(q);
      let fetchedProducts: Product[] = [];

      querySnapshot.forEach((doc) => {
        fetchedProducts.push({
          id: doc.id,
          ...(doc.data() as Record<string, any>),
        } as Product);
      });

      // Apply client-side filters that Firestore can't handle efficiently
      let filteredProducts = fetchedProducts;

      // Search filter
      if (searchQuery) {
        filteredProducts = filteredProducts.filter(
          (product) =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            product.tags?.some((tag) =>
              tag.toLowerCase().includes(searchQuery.toLowerCase())
            )
        );
      }

      // Price range filter
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.price >= priceRange.min && product.price <= priceRange.max
      );

      // Rating filter
      if (selectedRating > 0) {
        filteredProducts = filteredProducts.filter(
          (product) => product.rating >= selectedRating
        );
      }

      setProducts(filteredProducts);
      setTotalProducts(filteredProducts.length);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products. Please try again later.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoriesAndBrands = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const categoriesSet = new Set<string>();
      const brandsSet = new Set<string>();

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.category) categoriesSet.add(data.category);
        if (data.brand) brandsSet.add(data.brand);
      });

      setCategories(Array.from(categoriesSet));
      setBrands(Array.from(brandsSet));
    } catch (error) {
      console.error("Error fetching categories and brands:", error);
    }
  };

  const loadUserOrders = async (userId: string) => {
    try {
      const q = query(
        collection(db, "orders"),
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(q);
      const userOrders: Order[] = [];

      querySnapshot.forEach((orderDoc) => {
        userOrders.push({
          id: orderDoc.id,
          ...orderDoc.data(),
        } as unknown as Order);
      });

      setOrders(userOrders);
    } catch (error) {
      console.error("Error loading user orders:", error);
    }
  };

  // Generate Invoice
  const generateInvoice = (paymentMethod = "MPESA") => {
    const invoiceNumber = "INV-" + Date.now().toString().slice(-6);
    const invoiceDate = new Date().toISOString().split("T")[0];
    const tax = cartTotal * 0.16;

    const newInvoice = {
      invoiceNumber,
      invoiceDate,
      customerName: user ? user.name : "Guest User",
      customerEmail: user ? user.email : "guest@example.com",
      customerPhone: mpesaForm.phoneNumber,
      items: [...cartItems],
      subtotal: cartTotal,
      tax: tax,
      total: cartTotal,
      paymentMethod: paymentMethod,
      status: "Pending",
    };

    setCurrentInvoice(newInvoice);
    setShowInvoice(true);

    if (isLoggedIn) {
      const newOrder = {
        id: invoiceNumber,
        date: invoiceDate,
        items: [...cartItems],
        status: "Payment Pending",
        total: newInvoice.total,
        customer: {
          firstName: checkoutForm.firstName,
          lastName: checkoutForm.lastName,
          email: checkoutForm.email,
          phone: checkoutForm.phone,
          address: checkoutForm.address,
          city: checkoutForm.city,
          postalCode: checkoutForm.postalCode,
          country: checkoutForm.country,
        },
        paymentMethod: paymentMethod,
        paymentDetails: mpesaForm,
        userId: user ? user.uid : "guest",
        createdAt: new Date(),
      };
      setOrders([newOrder, ...orders]);
    }
  };

  // M-Pesa STK Push Function

  const initiateMpesaPayment = async () => {
    if (!mpesaForm.phoneNumber) {
      alert("Please enter your M-Pesa phone number");
      return;
    }

    // Validate phone number format
    const phoneRegex = /^(254|0)[7][0-9]{8}$/;
    const cleanPhone = mpesaForm.phoneNumber.replace(/\D/g, "");

    if (
      !phoneRegex.test(cleanPhone) &&
      !phoneRegex.test("254" + cleanPhone.slice(1))
    ) {
      alert(
        "Please enter a valid Kenyan phone number (e.g., 254700000000 or 0700000000)"
      );
      return;
    }

    setIsProcessingPayment(true);
    setMpesaStatus("pending");

    try {
      const response = await fetch("/api/mpesa/stkpush", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: mpesaForm.phoneNumber,
          amount: cartTotal,
          accountReference:
            currentInvoice?.invoiceNumber || "ORDER-" + Date.now(),
          transactionDesc: `Payment for Tremont Hardware products - ${currentInvoice?.invoiceNumber}`,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Start polling for payment status
        pollPaymentStatus(data.checkoutRequestId);

        // Show success message for STK push
        console.log("STK Push sent successfully:", data.customerMessage);
      } else {
        setMpesaStatus("failed");
        alert(data.error || "Failed to initiate payment. Please try again.");
      }
    } catch (error) {
      console.error("Payment initiation error:", error);
      setMpesaStatus("failed");
      alert(
        "Failed to initiate payment. Please check your internet connection and try again."
      );
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Poll payment status
  const pollPaymentStatus = async (checkoutRequestId: string) => {
    const maxAttempts = 30; // Poll for 2.5 minutes
    let attempts = 0;

    const poll = setInterval(async () => {
      attempts++;

      try {
        const response = await fetch(`/api/mpesa/status/${checkoutRequestId}`);
        const data = await response.json();

        if (data.status === "completed") {
          setMpesaStatus("success");
          completeOrder();
          clearInterval(poll);
        } else if (data.status === "failed" || attempts >= maxAttempts) {
          setMpesaStatus("failed");
          clearInterval(poll);
        }
      } catch (error) {
        console.error("Error polling payment status:", error);
        if (attempts >= maxAttempts) {
          setMpesaStatus("failed");
          clearInterval(poll);
        }
      }
    }, 4000); // Poll every 4 seconds
  };

  // Complete order after successful payment
  const completeOrder = () => {
    if (currentInvoice) {
      // Update order status to completed
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === currentInvoice.invoiceNumber
            ? { ...order, status: "Completed", completedAt: new Date() }
            : order
        )
      );

      // Update current invoice status
      setCurrentInvoice((prev) => (prev ? { ...prev, status: "Paid" } : prev));

      // Clear the cart and storage
      setCartItems([]);
      clearCartFromStorage();

      // Show success and close modals
      setShowMpesaModal(false);
      setShowInvoice(false);
      setShowCheckout(false);
      setShowOrderConfirmed(true);
    }
  };

  // Authentication Functions
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        loginForm.email,
        loginForm.password
      );
      setShowLoginForm(false);
      setLoginForm({ email: "", password: "" });
    } catch (error: any) {
      console.error("Login error:", error);
      alert(error.message || "Login failed. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (registerForm.password !== registerForm.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setAuthLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        registerForm.email,
        registerForm.password
      );

      // Update user profile with name
      await updateProfile(userCredential.user, {
        displayName: registerForm.name,
      });

      setShowRegisterForm(false);
      setRegisterForm({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      console.error("Registration error:", error);
      alert(error.message || "Registration failed. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsUserMenuOpen(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Order Management
  const createOrder = async (orderData: Omit<Order, "id">) => {
    try {
      const docRef = await addDoc(collection(db, "orders"), {
        ...orderData,
        createdAt: serverTimestamp(),
      });

      return docRef.id;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  };

  // Process Payment Function - Now only for M-Pesa
  const processPayment = async () => {
    if (!mpesaForm.phoneNumber) {
      alert("Please enter your M-Pesa phone number");
      return;
    }

    // Create invoice first
    generateInvoice("MPESA");

    // Show M-Pesa modal
    setShowMpesaModal(true);
    setShowCheckout(false);
  };

  // Effects
  useEffect(() => {
    fetchCategoriesAndBrands();
  }, []);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      fetchProductsFromFirestore();
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [
    searchQuery,
    selectedCategories,
    selectedBrands,
    priceRange,
    selectedRating,
    sortBy,
    inStockOnly,
    currentPage,
    productsPerPage,
  ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    selectedCategories,
    selectedBrands,
    priceRange,
    selectedRating,
    sortBy,
    inStockOnly,
  ]);

  // Cart Management Functions
  const addToCart = (product: Product) => {
    const existingItem = cartItems.find(
      (item) => item.product.id === product.id
    );

    if (existingItem) {
      const updatedItems = cartItems.map((item) =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setCartItems(updatedItems);
    } else {
      const updatedItems = [...cartItems, { product, quantity: 1 }];
      setCartItems(updatedItems);
    }
  };

  const removeFromCart = (productId: string) => {
    const updatedItems = cartItems.filter(
      (item) => item.product.id !== productId
    );
    setCartItems(updatedItems);
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    const updatedItems = cartItems.map((item) =>
      item.product.id === productId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedItems);
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
    clearCartFromStorage();
  };

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  // Filter handlers
  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleBrandChange = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange({ min: 0, max: 1000 });
    setSelectedRating(0);
    setSortBy("relevance");
    setInStockOnly(false);
  };

  // Form handlers
  const handleCheckoutChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setCheckoutForm({
      ...checkoutForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm({
      ...loginForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterForm({
      ...registerForm,
      [e.target.name]: e.target.value,
    });
  };

  // Pagination
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  const getPaginatedProducts = () => {
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    return products.slice(startIndex, endIndex);
  };
  const paginatedProducts = getPaginatedProducts();

  // Utility functions
  const renderStars = (rating: number) => {
    const stars: ReactElement[] = [];

    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(
          <Star key={i} size={16} className="text-yellow-500 fill-yellow-500" />
        );
      } else if (i - 0.5 <= rating) {
        stars.push(
          <Star key={i} size={16} className="text-yellow-500 fill-yellow-500" />
        );
      } else {
        stars.push(<Star key={i} size={16} className="text-gray-300" />);
      }
    }

    return stars;
  };

  const [showBackToTop, setShowBackToTop] = useState(false);

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

  // Toggle functions
  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);
  const toggleCart = () => setIsCartOpen(!isCartOpen);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Show loading spinner while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-lg">Loading...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-gray-800 text-white">
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
              <div className="relative">
                <button
                  onClick={toggleUserMenu}
                  className="text-sm hover:text-gray-300 flex items-center"
                >
                  {isLoggedIn && user ? user.name : "My Account"}{" "}
                  <ChevronDown size={14} className="ml-1" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 bg-white text-gray-800 rounded-lg shadow-lg py-2 w-48 z-10">
                    {isLoggedIn ? (
                      <>
                        <a
                          href="#"
                          className="block px-4 py-2 hover:bg-gray-100 items-center"
                          onClick={() => {
                            setShowOrders(true);
                            setIsUserMenuOpen(false);
                          }}
                        >
                          <Package size={16} className="mr-2" /> My Orders
                        </a>
                        <a
                          href="#"
                          className="px-4 py-2 hover:bg-gray-100 flex items-center"
                        >
                          <User size={16} className="mr-2" /> Profile Settings
                        </a>
                        <div className="border-t border-gray-200 my-1"></div>
                        <a
                          href="#"
                          className="block px-4 py-2 hover:bg-gray-100 text-red-600 items-center"
                          onClick={handleLogout}
                        >
                          <LogIn size={16} className="mr-2" /> Logout
                        </a>
                      </>
                    ) : (
                      <>
                        <a
                          href="#"
                          className="px-4 py-2 hover:bg-gray-100 flex items-center"
                          onClick={() => {
                            setShowLoginForm(true);
                            setIsUserMenuOpen(false);
                          }}
                        >
                          <LogIn size={16} className="mr-2" /> Login
                        </a>
                        <a
                          href="#"
                          className="block px-4 py-2 hover:bg-gray-100 items-center"
                          onClick={() => {
                            setShowRegisterForm(true);
                            setIsUserMenuOpen(false);
                          }}
                        >
                          <User size={16} className="mr-2" /> Register
                        </a>
                      </>
                    )}
                  </div>
                )}
              </div>
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
              <a href="/" className="text-2xl font-bold">
                TREMONT HARDWARE
              </a>
            </div>

            <div className="hidden md:flex font-semibold items-center space-x-8">
              <a href="./" className="hover:text-yellow-400">
                Home
              </a>
              <a href="./products" className="hover:text-white text-yellow-400">
                Products
              </a>
              <a href="./services" className="hover:text-yellow-400">
                Services
              </a>
              <a href="./about" className="text-white hover:text-yellow-400">
                About
              </a>
              <a href="./contacts" className="hover:text-yellow-400">
                Contact
              </a>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-gray-700 rounded-full px-4 py-1 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <Search
                  size={16}
                  className="absolute left-3 top-2 text-gray-400"
                />
              </div>

              <div className="relative">
                <button onClick={toggleCart} className="relative">
                  <ShoppingCart
                    size={24}
                    className="hover:text-yellow-400 cursor-pointer"
                  />
                  {cartItems.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-yellow-400 text-gray-800 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItems.reduce(
                        (total, item) => total + item.quantity,
                        0
                      )}
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
            <div className="flex items-center my-2">
              <Search size={16} className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-600 rounded-lg px-3 py-1 text-sm w-full focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
            <nav className="flex flex-col space-y-2 my-4">
              <>
                <a href="./" className="hover:text-yellow-400">
                  Home
                </a>
                <a
                  href="./products"
                  className="hover:text-white text-yellow-400"
                >
                  Products
                </a>
                <a href="./services" className="hover:text-yellow-400">
                  Services
                </a>
                <a href="./about" className="text-white hover:text-yellow-400">
                  About
                </a>
                <a href="./contacts" className="hover:text-yellow-400">
                  Contact
                </a>
              </>
            </nav>
          </div>
        )}
      </header>

      {/* Page Title */}
      <section
        className="bg-ima text-white py-8"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1510016290251-68aaad49723e?q=80&w=1476&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Products</h1>
          <div className="flex items-center text-sm mt-2">
            <a href="/" className="hover:text-yellow-400">
              Home
            </a>
            <span className="mx-2">›</span>
            <span className="text-yellow-400">Products</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 bg-gray-100 flex-grow">
        <div className="container mx-auto px-4">
          {/* Search and Filter Bar */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Search Input */}
              <div className="relative flex-1 max-w-md">
                <Search
                  size={20}
                  className="absolute left-3 top-3 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search products, brands, categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                />
              </div>

              {/* Filter and Sort Controls */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <SlidersHorizontal size={18} />
                  Filters
                  {(selectedCategories.length > 0 ||
                    selectedBrands.length > 0 ||
                    selectedRating > 0 ||
                    inStockOnly) && (
                    <span className="bg-yellow-500 text-gray-900 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {selectedCategories.length +
                        selectedBrands.length +
                        (selectedRating > 0 ? 1 : 0) +
                        (inStockOnly ? 1 : 0)}
                    </span>
                  )}
                </button>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <option value="relevance">Sort by Relevance</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest First</option>
                  <option value="name">Name A-Z</option>
                </select>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded ${
                      viewMode === "grid"
                        ? "bg-yellow-500 text-gray-900"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    <Grid size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded ${
                      viewMode === "list"
                        ? "bg-yellow-500 text-gray-900"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    <List size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {(selectedCategories.length > 0 ||
              selectedBrands.length > 0 ||
              selectedRating > 0 ||
              inStockOnly) && (
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200">
                <span className="text-sm font-semibold text-gray-700">
                  Active filters:
                </span>
                {selectedCategories.map((category) => (
                  <span
                    key={category}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full"
                  >
                    {category}
                    <button
                      onClick={() => handleCategoryChange(category)}
                      className="hover:text-yellow-600"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
                {selectedBrands.map((brand) => (
                  <span
                    key={brand}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {brand}
                    <button
                      onClick={() => handleBrandChange(brand)}
                      className="hover:text-blue-600"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
                {selectedRating > 0 && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                    {selectedRating}+ stars
                    <button
                      onClick={() => setSelectedRating(0)}
                      className="hover:text-green-600"
                    >
                      <X size={14} />
                    </button>
                  </span>
                )}
                {inStockOnly && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                    In Stock Only
                    <button
                      onClick={() => setInStockOnly(false)}
                      className="hover:text-purple-600"
                    >
                      <X size={14} />
                    </button>
                  </span>
                )}
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-gray-600 hover:text-gray-800 underline"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Advanced Filters Sidebar */}
            {isFilterOpen && (
              <div className="lg:w-1/4">
                <div className="bg-white rounded-lg shadow-md p-4 space-y-6">
                  {/* Categories Filter */}
                  <div>
                    <h3 className="font-bold text-lg mb-3">Categories</h3>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <label
                          key={category}
                          className="flex items-center cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(category)}
                            onChange={() => handleCategoryChange(category)}
                            className="mr-2 rounded"
                          />
                          <span className="text-sm">{category}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Brands Filter */}
                  <div>
                    <h3 className="font-bold text-lg mb-3">Brands</h3>
                    <div className="space-y-2">
                      {brands.map((brand) => (
                        <label
                          key={brand}
                          className="flex items-center cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedBrands.includes(brand)}
                            onChange={() => handleBrandChange(brand)}
                            className="mr-2 rounded"
                          />
                          <span className="text-sm">{brand}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Price Range Filter */}
                  <div>
                    <h3 className="font-bold text-lg mb-3">Price Range</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          placeholder="Min"
                          value={priceRange.min}
                          onChange={(e) =>
                            setPriceRange({
                              ...priceRange,
                              min: Number(e.target.value),
                            })
                          }
                          className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                        />
                        <span>-</span>
                        <input
                          type="number"
                          placeholder="Max"
                          value={priceRange.max}
                          onChange={(e) =>
                            setPriceRange({
                              ...priceRange,
                              max: Number(e.target.value),
                            })
                          }
                          className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Rating Filter */}
                  <div>
                    <h3 className="font-bold text-lg mb-3">Minimum Rating</h3>
                    <div className="space-y-2">
                      {[4, 3, 2, 1].map((rating) => (
                        <label
                          key={rating}
                          className="flex items-center cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="rating"
                            checked={selectedRating === rating}
                            onChange={() => setSelectedRating(rating)}
                            className="mr-2"
                          />
                          <div className="flex items-center">
                            {renderStars(rating)}
                            <span className="ml-1 text-sm">& up</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Availability Filter */}
                  <div>
                    <h3 className="font-bold text-lg mb-3">Availability</h3>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={inStockOnly}
                        onChange={(e) => setInStockOnly(e.target.checked)}
                        className="mr-2 rounded"
                      />
                      <span className="text-sm">In Stock Only</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Products Section */}
            <div className={`${isFilterOpen ? "lg:w-3/4" : "w-full"}`}>
              {/* Results Info */}
              <div className="flex justify-between items-center mb-6">
                <p className="text-gray-600">
                  {loading
                    ? "Loading..."
                    : `Showing ${paginatedProducts.length} of ${totalProducts} products`}
                  {searchQuery && ` for "${searchQuery}"`}
                </p>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-6">
                  <strong className="font-bold">Error! </strong>
                  <span className="block sm:inline">{error}</span>
                  <button
                    onClick={fetchProductsFromFirestore}
                    className="ml-4 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Retry
                  </button>
                </div>
              )}

              {/* No Results */}
              {!loading && !error && products.length === 0 && (
                <div className="text-center py-12">
                  <Search size={64} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    No products found
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your search or filters
                  </p>
                  <button
                    onClick={clearAllFilters}
                    className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold px-6 py-2 rounded-lg"
                  >
                    Clear all filters
                  </button>
                </div>
              )}

              {/* Products Grid View */}
              {!loading &&
                !error &&
                viewMode === "grid" &&
                products.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {paginatedProducts.map((product) => (
                      <div
                        key={product.id}
                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300 hover:-translate-y-2"
                      >
                        <div className="relative">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-48 object-cover"
                          />
                          {product.originalPrice && (
                            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                              SALE
                            </div>
                          )}
                          <div className="absolute top-2 right-2 bg-yellow-500 text-gray-900 text-xs font-bold uppercase rounded-full py-1 px-2">
                            {product.category}
                          </div>
                          {!product.inStock && (
                            <div className="absolute inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center">
                              <span className="bg-red-600 text-white px-3 py-1 rounded-lg font-semibold">
                                Out of Stock
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <div className="flex items-center mb-2">
                            <div className="flex items-center">
                              {renderStars(product.rating)}
                            </div>
                            <span className="text-sm text-gray-600 ml-1">
                              ({product.rating}){" "}
                              {product.reviews &&
                                `• ${product.reviews} reviews`}
                            </span>
                          </div>
                          <h3 className="text-lg font-semibold mb-1 line-clamp-2">
                            {product.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {product.brand}
                          </p>
                          {product.description && (
                            <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                              {product.description}
                            </p>
                          )}
                          <div className="flex justify-between items-center">
                            <div className="flex flex-col w-full">
                              <span className="text-xl font-bold text-gray-800">
                                KSh {product.price.toFixed(2)}
                              </span>
                              {product.originalPrice && (
                                <span className="text-sm text-gray-500 line-through">
                                  KSh {product.originalPrice.toFixed(2)}
                                </span>
                              )}
                            </div>
                            <div className="w-full flex flex-col space-y-2">
                              <button
                                onClick={() => addToCart(product)}
                                disabled={!product.inStock}
                                className={`w-full justify-center items-center mt-1 flex py-2 font-semibold rounded-4xl shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 transition duration-300 ${
                                  product.inStock
                                    ? "bg-gray-800 hover:bg-yellow-500 text-white hover:text-gray-900"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                }`}
                              >
                                Add to Cart
                              </button>
                              <a
                                href={`https://wa.me/254700761283?text=Hello,%20I%20would%20like%20to%20buy%20the%20product:%20${product.name}%20of%20${product.brand}%20Brand%20for%20KSh${product.price}%20.Thank%20You.`}
                                target="_blank"
                                rel="noopener"
                                className="w-full flex items-center justify-center px-4 py-2 bg-green-500 text-white font-semibold rounded-4xl shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="w-5 h-5 mr-2"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.105 1.523 5.84L0 24l6.293-1.523A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm6.29 17.71c-.26.73-1.52 1.39-2.09 1.48-.55.09-1.22.13-1.97-.15-.45-.17-1.03-.35-1.77-.68-3.1-1.34-5.1-4.5-5.26-4.71-.15-.21-1.26-1.68-1.26-3.21 0-1.53.8-2.29 1.08-2.61.26-.31.57-.39.77-.39.2 0 .39.002.56.01.18.01.42-.07.66.51.26.61.88 2.1.96 2.25.08.15.13.33.03.53-.09.2-.13.33-.26.51-.13.18-.27.39-.39.52-.13.13-.26.27-.11.52.15.26.67 1.1 1.44 1.78.99.88 1.83 1.15 2.08 1.28.26.13.41.11.56-.08.15-.18.65-.76.82-1.02.18-.26.36-.22.61-.13.26.08 1.67.79 1.96.93.29.13.48.22.55.34.08.13.08.75-.18 1.48z" />
                                </svg>
                                WhatsApp
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              {/* Products List View */}
              {!loading &&
                !error &&
                viewMode === "list" &&
                products.length > 0 && (
                  <div className="space-y-4">
                    {paginatedProducts.map((product) => (
                      <div
                        key={product.id}
                        className="bg-white rounded-4xl shadow-md overflow-hidden hover:shadow-lg transition duration-300"
                      >
                        <div className="flex flex-col sm:flex-row">
                          <div className="relative sm:w-1/3 lg:w-1/4">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-48 sm:h-full object-cover"
                            />
                            {product.originalPrice && (
                              <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                                SALE
                              </div>
                            )}
                            <div className="absolute top-2 right-2 bg-yellow-500 text-gray-900 text-xs font-bold uppercase rounded-full py-1 px-2">
                              {product.category}
                            </div>
                            {!product.inStock && (
                              <div className="absolute inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center">
                                <span className="bg-red-600 text-white px-3 py-1 rounded-lg font-semibold">
                                  Out of Stock
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="p-4 sm:w-2/3 lg:w-3/4">
                            <div className="flex items-center mb-2">
                              <div className="flex items-center">
                                {renderStars(product.rating)}
                              </div>
                              <span className="text-sm text-gray-600 ml-1">
                                ({product.rating}){" "}
                                {product.reviews &&
                                  `• ${product.reviews} reviews`}
                              </span>
                            </div>
                            <h3 className="text-xl font-semibold mb-1">
                              {product.name}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">
                              Brand: {product.brand}
                            </p>
                            {product.description && (
                              <p className="text-gray-700 mb-4">
                                {product.description}
                              </p>
                            )}
                            <div>
                              <div className="flex flex-col">
                                <span className="text-2xl font-bold text-gray-800">
                                  KSh {product.price.toFixed(2)}
                                </span>
                                {product.originalPrice && (
                                  <span className="text-lg text-gray-500 line-through">
                                    KSh {product.originalPrice.toFixed(2)}
                                  </span>
                                )}
                              </div>
                              <button
                                onClick={() => addToCart(product)}
                                disabled={!product.inStock}
                                className={`w-fit rounded-4xl font-semibold px-4 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 transition duration-300 ${
                                  product.inStock
                                    ? "bg-gray-800 hover:bg-yellow-500 text-white hover:text-gray-900"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                }`}
                              >
                                Add to Cart
                              </button>
                              <a
                                href={`https://wa.me/254700761283?text=Hello,%20I%20would%20like%20to%20buy%20the%20product:%20${product.name}%20of%20${product.brand}%20Brand%20for%20KSh${product.price}%20.Thank%20You.`}
                                target="_blank"
                                rel="noopener"
                                className="w-fit flex items-center justify-center px-4 py-2 bg-green-500 text-white font-semibold rounded-4xl shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="w-5 h-5 mr-2"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.105 1.523 5.84L0 24l6.293-1.523A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm6.29 17.71c-.26.73-1.52 1.39-2.09 1.48-.55.09-1.22.13-1.97-.15-.45-.17-1.03-.35-1.77-.68-3.1-1.34-5.1-4.5-5.26-4.71-.15-.21-1.26-1.68-1.26-3.21 0-1.53.8-2.29 1.08-2.61.26-.31.57-.39.77-.39.2 0 .39.002.56.01.18.01.42-.07.66.51.26.61.88 2.1.96 2.25.08.15.13.33.03.53-.09.2-.13.33-.26.51-.13.18-.27.39-.39.52-.13.13-.26.27-.11.52.15.26.67 1.1 1.44 1.78.99.88 1.83 1.15 2.08 1.28.26.13.41.11.56-.08.15-.18.65-.76.82-1.02.18-.26.36-.22.61-.13.26.08 1.67.79 1.96.93.29.13.48.22.55.34.08.13.08.75-.18 1.48z" />
                                </svg>
                                Buy on WhatsApp
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              {/* Pagination */}
              {!loading && !error && totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className={`flex items-center space-x-1 py-2 px-3 rounded-md transition duration-300 ${
                        currentPage === 1
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <ArrowRight size={16} className="rotate-180" />
                      <span>Previous</span>
                    </button>

                    <span className="text-sm text-gray-600 px-2">
                      Page {currentPage} of {totalPages}
                    </span>

                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className={`flex items-center space-x-1 py-2 px-3 rounded-md transition duration-300 ${
                        currentPage === totalPages
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span>Next</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Shopping Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-gray-700 bg-opacity-100"
            onClick={toggleCart}
          ></div>
          <div className="relative w-full max-w-md bg-white shadow-xl h-full flex flex-col">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold">Shopping Cart</h2>
              <button
                onClick={toggleCart}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
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
                    className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold px-4 py-2 rounded-lg transition duration-300"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center border-b border-gray-200 pb-4"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="ml-4 flex-grow">
                        <h4 className="font-semibold">{item.product.name}</h4>
                        <div className="flex justify-between items-center mt-1">
                          <div className="flex items-center">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.quantity - 1
                                )
                              }
                              className="border rounded-l w-8 h-8 flex items-center justify-center hover:bg-gray-100"
                            >
                              -
                            </button>
                            <span className="border-t border-b w-10 h-8 flex items-center justify-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.quantity + 1
                                )
                              }
                              className="border rounded-r w-8 h-8 flex items-center justify-center hover:bg-gray-100"
                            >
                              +
                            </button>
                          </div>
                          <span className="font-semibold">
                            KSh{" "}
                            {(item.product.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="ml-2 text-gray-500 hover:text-red-600"
                      >
                        <Trash size={18} />
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
                  <span className="font-bold">KSh {cartTotal.toFixed(2)}</span>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Shipping and taxes calculated at checkout
                </p>
                <div className="space-y-2">
                  <button
                    onClick={generateInvoice}
                    className="bg-gray-600 hover:bg-gray-700 text-white w-full py-2 rounded-lg font-semibold transition duration-300"
                  >
                    View Invoice
                  </button>
                  <button
                    onClick={() => setShowCheckout(true)}
                    className="bg-gray-800 hover:bg-yellow-500 text-white hover:text-gray-900 w-full py-3 rounded-lg font-semibold transition duration-300"
                  >
                    Proceed to Checkout
                  </button>
                  <button
                    onClick={clearCart}
                    className="bg-red-600 hover:bg-red-700 text-white w-full py-2 rounded-lg font-semibold transition duration-300"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {showInvoice && currentInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-gray-700 bg-opacity-50"
            onClick={() => setShowInvoice(false)}
          ></div>
          <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-screen overflow-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Invoice</h2>

              <button
                className="p-1 bg-gray-800 hover:bg-yellow-500 text-white rounded-lg flex items-center"
                onClick={async () => {
                  const invoiceElement =
                    document.getElementById("invoiceModal");
                  if (!invoiceElement) return;

                  try {
                    // Create PDF instance
                    const pdf = new jsPDF("p", "mm", "a4");
                    const pageWidth = pdf.internal.pageSize.getWidth();
                    const margin = 10; // Margin in mm
                    const maxWidth = pageWidth - margin * 2;

                    // Extract text content and split into lines
                    const text = invoiceElement.innerText;
                    const lines = pdf.splitTextToSize(text, maxWidth);

                    // Set font and add content
                    pdf.setFont("garamond");
                    pdf.setFontSize(10);

                    let yPos = margin;
                    const lineHeight = 6;

                    lines.forEach((line) => {
                      // Add new page if needed
                      if (yPos > pdf.internal.pageSize.getHeight() - margin) {
                        pdf.addPage();
                        yPos = margin;
                      }

                      pdf.text(line, margin, yPos);
                      yPos += lineHeight;
                    });

                    // Save the PDF
                    pdf.save("invoice.pdf");
                  } catch (error) {
                    console.error("Error generating PDF:", error);
                    alert("Failed to generate PDF. Please try again.");
                  }
                }}
              >
                <FileText size={16} className="mr-1" /> Download PDF
              </button>
              <button
                onClick={() => setShowInvoice(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <div
              id="invoiceModal"
              className="border-2 z-10 rounded-lg bg-white mb-6"
            >
              <div className="flex justify-between items-start">
                <div className="p-2">
                  <h1 className="text-xl font-bold text-gray-800 mb-1">
                    TREMONT HARDWARE
                  </h1>
                  <address className="not-italic text-gray-600">
                    Allied Place
                    <br />
                    Sheikh Karume, Nairobi
                    <br />
                    0700 761 283
                  </address>
                </div>
                <div className="p-2 text-right">
                  <h2 className="text-xl font-bold text-gray-800 mb-1">
                    INVOICE
                  </h2>
                  <p className="text-gray-600 mb-1">
                    <span className="font-semibold">Invoice #:</span>{" "}
                    {currentInvoice.invoiceNumber}
                  </p>
                  <p className="text-gray-600 mb-1">
                    <span className="font-semibold">Date:</span>{" "}
                    {currentInvoice.invoiceDate}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Status:</span>
                    <span
                      className={`font-semibold ml-1 ${
                        currentInvoice.status === "Paid"
                          ? "text-green-600"
                          : "text-blue-600"
                      }`}
                    >
                      {currentInvoice.status}
                    </span>
                  </p>
                </div>
              </div>

              <div className="p-2 mb-1">
                <h3 className="text-red-800 font-bold mb-1">NOTE:</h3>
                <p>
                  This is a computer generated receipt and is not proof of
                  payment.
                </p>
              </div>

              <div className="mb-2">
                <table className="w-fit">
                  <thead className="w-fit">
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
                          KSh {item.product.price.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-right">
                          KSh {(item.product.price * item.quantity).toFixed(2)}
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
                    <span>KSh {currentInvoice.subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between py-2 border-t border-gray-300 text-lg font-bold">
                    <span>Total:</span>
                    <span>KSh {currentInvoice.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-300 pt-4 mb-2 p-2">
                <h3 className="text-gray-800 font-bold mb-2">
                  Payment Information
                </h3>
                <p className="text-gray-600 mb-1">
                  <span className="font-semibold">Method:</span> M-PESA
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Date:</span>{" "}
                  {currentInvoice.invoiceDate}
                </p>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowInvoice(false)}
                className=" bg-red-800 text-white hover:bg-red-600 font-semibold px-6 py-2 rounded-lg transition duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Login Form Modal */}
      {showLoginForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setShowLoginForm(false)}
          ></div>
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Login</h2>
              <button
                onClick={() => setShowLoginForm(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleLoginSubmit}>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="email"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  value={loginForm.email}
                  onChange={handleLoginChange}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              <div className="mb-6">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={loginForm.password}
                  onChange={handleLoginChange}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              <div className="flex items-center justify-between mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-yellow-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Remember me
                  </span>
                </label>
                <a
                  href="#"
                  className="text-sm text-yellow-600 hover:text-yellow-800"
                >
                  Forgot password?
                </a>
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  disabled={authLoading}
                  className="bg-gray-800 hover:bg-yellow-500 text-white hover:text-gray-900 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 w-full disabled:opacity-50"
                >
                  {authLoading ? "Signing In..." : "Sign In"}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <a
                  className="text-yellow-600 hover:text-yellow-800 font-semibold cursor-pointer"
                  onClick={() => {
                    setShowLoginForm(false);
                    setShowRegisterForm(true);
                  }}
                >
                  Sign up now
                </a>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Register Form Modal */}
      {showRegisterForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setShowRegisterForm(false)}
          ></div>
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Create Account</h2>
              <button
                onClick={() => setShowRegisterForm(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit}>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="name"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  value={registerForm.name}
                  onChange={handleRegisterChange}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="register-email"
                >
                  Email Address
                </label>
                <input
                  id="register-email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  value={registerForm.email}
                  onChange={handleRegisterChange}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="register-password"
                >
                  Password
                </label>
                <input
                  id="register-password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={registerForm.password}
                  onChange={handleRegisterChange}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              <div className="mb-6">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="confirm-password"
                >
                  Confirm Password
                </label>
                <input
                  id="confirm-password"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={registerForm.confirmPassword}
                  onChange={handleRegisterChange}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-yellow-500"
                    required
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    I agree to the{" "}
                    <a
                      href="#"
                      className="text-yellow-600 hover:text-yellow-800"
                    >
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      href="#"
                      className="text-yellow-600 hover:text-yellow-800"
                    >
                      Privacy Policy
                    </a>
                  </span>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  disabled={authLoading}
                  className="bg-gray-800 hover:bg-yellow-500 text-white hover:text-gray-900 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 w-full disabled:opacity-50"
                >
                  {authLoading ? "Creating Account..." : "Create Account"}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <a
                  className="text-yellow-600 hover:text-yellow-800 font-semibold cursor-pointer"
                  onClick={() => {
                    setShowRegisterForm(false);
                    setShowLoginForm(true);
                  }}
                >
                  Sign in
                </a>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal - Simplified for M-Pesa only */}
      {showCheckout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setShowCheckout(false)}
          ></div>
          <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-screen overflow-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {checkoutStep === 1 ? "Shipping Details" : "Payment via M-Pesa"}
              </h2>
              <button
                onClick={() => setShowCheckout(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-center mb-8">
              <div
                className={`flex items-center ${
                  checkoutStep >= 1 ? "text-yellow-600" : "text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    checkoutStep >= 1
                      ? "bg-yellow-500 text-white"
                      : "bg-gray-300"
                  }`}
                >
                  1
                </div>
                <span className="ml-2 hidden sm:block">Details</span>
              </div>
              <div
                className={`w-12 h-0.5 mx-4 ${
                  checkoutStep >= 2 ? "bg-yellow-500" : "bg-gray-300"
                }`}
              ></div>
              <div
                className={`flex items-center ${
                  checkoutStep >= 2 ? "text-yellow-600" : "text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    checkoutStep >= 2
                      ? "bg-yellow-500 text-white"
                      : "bg-gray-300"
                  }`}
                >
                  2
                </div>
                <span className="ml-2 hidden sm:block">M-Pesa</span>
              </div>
            </div>

            {/* Step 1: Shipping Details */}
            {checkoutStep === 1 && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      First Name *
                    </label>
                    <input
                      name="firstName"
                      type="text"
                      value={checkoutForm.firstName}
                      onChange={handleCheckoutChange}
                      className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Last Name *
                    </label>
                    <input
                      name="lastName"
                      type="text"
                      value={checkoutForm.lastName}
                      onChange={handleCheckoutChange}
                      className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Email Address *
                    </label>
                    <input
                      name="email"
                      type="email"
                      value={checkoutForm.email}
                      onChange={handleCheckoutChange}
                      className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Phone Number *
                    </label>
                    <input
                      name="phone"
                      type="tel"
                      value={checkoutForm.phone}
                      onChange={handleCheckoutChange}
                      className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Address *
                    </label>
                    <input
                      name="address"
                      type="text"
                      value={checkoutForm.address}
                      onChange={handleCheckoutChange}
                      className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      City *
                    </label>
                    <input
                      name="city"
                      type="text"
                      value={checkoutForm.city}
                      onChange={handleCheckoutChange}
                      className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Postal Code
                    </label>
                    <input
                      name="postalCode"
                      type="text"
                      value={checkoutForm.postalCode}
                      onChange={handleCheckoutChange}
                      className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-gray-100 rounded-lg p-4 mb-6">
                  <h3 className="font-bold mb-4">Order Summary</h3>
                  {cartItems.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex justify-between items-center mb-2"
                    >
                      <span>
                        {item.product.name} x {item.quantity}
                      </span>
                      <span>
                        KSh {(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between items-center mb-1">
                      <span>Subtotal:</span>
                      <span>KSh {cartTotal.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between items-center font-bold text-lg">
                      <span>Total:</span>
                      <span>KSh {cartTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      // Validate form
                      const requiredFields = [
                        "firstName",
                        "lastName",
                        "email",
                        "phone",
                        "address",
                        "city",
                      ];
                      const isValid = requiredFields.every(
                        (field) =>
                          checkoutForm[
                            field as keyof typeof checkoutForm
                          ].trim() !== ""
                      );

                      if (!isValid) {
                        alert("Please fill in all required fields");
                        return;
                      }

                      setCheckoutStep(2);
                    }}
                    className="bg-gray-800 hover:bg-yellow-500 text-white hover:text-gray-900 font-bold py-2 px-6 rounded transition duration-300"
                  >
                    Continue to M-Pesa Payment
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: M-Pesa Payment */}
            {checkoutStep === 2 && (
              <div>
                <div className="text-center mb-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                    <Smartphone
                      size={48}
                      className="text-green-600 mx-auto mb-4"
                    />
                    <h3 className="text-lg font-bold text-green-800 mb-2">
                      Pay with M-Pesa
                    </h3>
                    <p className="text-green-700 text-sm">
                      Enter your M-Pesa phone number below to complete your
                      payment securely
                    </p>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      M-Pesa Phone Number *
                    </label>
                    <input
                      type="tel"
                      placeholder="254700000000"
                      value={mpesaForm.phoneNumber}
                      onChange={(e) =>
                        setMpesaForm({
                          ...mpesaForm,
                          phoneNumber: e.target.value,
                        })
                      }
                      className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-400 text-lg"
                    />
                    <p className="text-sm text-gray-600 mt-1">
                      Enter your phone number in the format 254XXXXXXXXX
                    </p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-2">
                      Payment Summary
                    </h4>
                    <div className="flex justify-between text-blue-700">
                      <span>Total Amount:</span>
                      <span className="font-bold">
                        KSh {cartTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() => setCheckoutStep(1)}
                    className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded transition duration-300"
                  >
                    Back
                  </button>
                  <button
                    onClick={processPayment}
                    disabled={!mpesaForm.phoneNumber}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Complete M-Pesa Payment
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Professional M-Pesa Payment Modal */}
      {showMpesaModal && currentInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-50"></div>
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="text-center">
              {/* Header */}
              <div className="mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Smartphone size={32} className="text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  M-Pesa Payment
                </h2>
                <p className="text-gray-600">
                  Complete your payment using M-Pesa
                </p>
              </div>

              {/* Payment Details */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-bold text-lg">
                    KSh {currentInvoice.total.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Phone Number:</span>
                  <span className="font-semibold">{mpesaForm.phoneNumber}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Invoice:</span>
                  <span className="font-semibold">
                    {currentInvoice.invoiceNumber}
                  </span>
                </div>
              </div>

              {/* Status Display */}
              {mpesaStatus === "pending" && (
                <div className="mb-6">
                  <div className="animate-spin w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Processing Payment
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Please check your phone for the M-Pesa prompt and enter your
                    PIN to complete the payment.
                  </p>
                </div>
              )}

              {mpesaStatus === "success" && (
                <div className="mb-6">
                  <CheckCircle
                    size={48}
                    className="text-green-500 mx-auto mb-4"
                  />
                  <h3 className="text-lg font-semibold text-green-800 mb-2">
                    Payment Successful!
                  </h3>
                  <p className="text-green-600 text-sm">
                    Your payment has been processed successfully. Thank you for
                    your purchase!
                  </p>
                </div>
              )}

              {mpesaStatus === "failed" && (
                <div className="mb-6">
                  <AlertCircle
                    size={48}
                    className="text-red-500 mx-auto mb-4"
                  />
                  <h3 className="text-lg font-semibold text-red-800 mb-2">
                    Payment Failed
                  </h3>
                  <p className="text-red-600 text-sm">
                    Your payment could not be processed. Please try again or
                    contact support.
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                {!mpesaStatus && (
                  <button
                    onClick={initiateMpesaPayment}
                    disabled={isProcessingPayment}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 disabled:opacity-50"
                  >
                    {isProcessingPayment
                      ? "Initiating Payment..."
                      : "Complete Payment"}
                  </button>
                )}

                {mpesaStatus === "failed" && (
                  <button
                    onClick={() => {
                      setMpesaStatus(null);
                      setIsProcessingPayment(false);
                    }}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
                  >
                    Try Again
                  </button>
                )}

                {mpesaStatus === "success" && (
                  <button
                    onClick={() => {
                      setShowMpesaModal(false);
                      setMpesaStatus(null);
                    }}
                    className="w-full bg-gray-800 hover:bg-yellow-500 text-white hover:text-gray-900 font-bold py-3 px-6 rounded-lg transition duration-300"
                  >
                    Continue Shopping
                  </button>
                )}

                <button
                  onClick={() => {
                    setShowMpesaModal(false);
                    setMpesaStatus(null);
                    setIsProcessingPayment(false);
                  }}
                  className="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-6 rounded-lg transition duration-300"
                >
                  {mpesaStatus === "success" ? "Close" : "Cancel"}
                </button>
              </div>

              {/* Help Text */}
              {mpesaStatus === "pending" && (
                <div className="mt-6 text-xs text-gray-500">
                  <p>• Check your phone for the M-Pesa notification</p>
                  <p>• Enter your M-Pesa PIN when prompted</p>
                  <p>• Payment will be confirmed automatically</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Order Confirmed Modal */}
      {showOrderConfirmed && confirmedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setShowOrderConfirmed(false)}
          ></div>
          <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
            <div className="text-center">
              <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Order Confirmed!
              </h2>
              <p className="text-gray-600 mb-4">
                Thank you for your purchase. Your order has been successfully
                placed.
              </p>

              <div className="bg-gray-100 rounded-lg p-4 mb-6">
                <h3 className="font-semibold mb-2">Order Details</h3>
                <p>
                  <strong>Order ID:</strong> {confirmedOrder.id}
                </p>
                <p>
                  <strong>Total:</strong> KSh {confirmedOrder.total.toFixed(2)}
                </p>
                <p>
                  <strong>Payment Method:</strong> M-Pesa
                </p>
              </div>

              <div className="bg-blue-100 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-center mb-2">
                  <Mail size={20} className="text-blue-600 mr-2" />
                  <span className="font-semibold text-blue-800">
                    Email Notification Sent
                  </span>
                </div>
                <p className="text-sm text-blue-700">
                  An order confirmation has been sent to the business owner at
                  eliaqmaa98@gmail.com. Your order will be processed within 1-3
                  business hours.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    setShowOrderConfirmed(false);
                    setIsCartOpen(false);
                  }}
                  className="w-full bg-gray-800 hover:bg-yellow-500 text-white hover:text-gray-900 font-bold py-2 px-4 rounded transition duration-300"
                >
                  Continue Shopping
                </button>
                {isLoggedIn && (
                  <button
                    onClick={() => {
                      setShowOrderConfirmed(false);
                      setShowOrders(true);
                    }}
                    className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded transition duration-300"
                  >
                    View My Orders
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order History Modal */}
      {showOrders && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setShowOrders(false)}
          ></div>
          <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full p-6 max-h-screen overflow-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">My Orders</h2>
              <button
                onClick={() => setShowOrders(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-12">
                <Package size={64} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
                <p className="text-gray-600 mb-6">
                  Looks like you haven't placed any orders yet.
                </p>
                <button
                  onClick={() => setShowOrders(false)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold px-6 py-2 rounded-lg transition duration-300"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order, index) => (
                  <div
                    key={index}
                    className="border rounded-lg overflow-hidden"
                  >
                    <div className="bg-gray-100 px-4 py-3 flex justify-between items-center">
                      <div>
                        <p className="font-semibold">{order.id}</p>
                        <p className="text-sm text-gray-600">
                          Ordered on {order.date}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            order.status === "Delivered"
                              ? "bg-green-100 text-green-800"
                              : order.status === "Processing"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="mb-4">
                        {order.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between items-center py-2 border-b last:border-b-0"
                          >
                            <div className="flex items-center">
                              <img
                                src={item.product.image}
                                alt={item.product.name}
                                className="w-12 h-12 object-cover rounded mr-3"
                              />
                              <div>
                                <p className="font-semibold">
                                  {item.product.name}
                                </p>
                                <p className="text-sm text-gray-600">
                                  Qty: {item.quantity}
                                </p>
                              </div>
                            </div>
                            <p className="font-semibold">
                              KSh{" "}
                              {(item.product.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t">
                        <p className="font-semibold">Total</p>
                        <p className="font-bold text-lg">
                          KSh {order.total.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Benefits Bar */}
      <section className="bg-gray-100 py-6 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-center">
              <Truck size={24} className="text-yellow-500 mr-3" />
              <div>
                <h3 className="font-semibold">Free Delivery</h3>
                <p className="text-sm text-gray-600">
                  On orders over KSh100,000
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <ShieldCheck size={24} className="text-yellow-500 mr-3" />
              <div>
                <h3 className="font-semibold">Secure Payment</h3>
                <p className="text-sm text-gray-600">
                  100% secure M-Pesa checkout
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <Clock size={24} className="text-yellow-500 mr-3" />
              <div>
                <h3 className="font-semibold">3-Day Returns</h3>
                <p className="text-sm text-gray-600">Easy return policy</p>
              </div>
            </div>
          </div>
        </div>
      </section>

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

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-yellow-500 hover:bg-yellow-600 text-gray-900 p-3 rounded-full shadow-lg transition duration-300 z-40"
        >
          <ChevronUp size={24} />
        </button>
      )}
    </div>
  );
}
