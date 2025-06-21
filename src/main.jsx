import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.js'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AboutPage from './about.tsx'
import ProductsPage from './tf.tsx'
import ServicesPage from './services.tsx'
import ContactPage from './contact.tsx'



const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/about', element: <AboutPage /> },
  { path: '/products', element: <ProductsPage /> },
  { path: '/services', element: <ServicesPage /> },
  { path: '/contacts', element: <ContactPage /> },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
