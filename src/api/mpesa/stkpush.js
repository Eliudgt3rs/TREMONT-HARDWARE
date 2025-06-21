/* eslint-disable no-undef */
// api/mpesa/stkpush.js 
import axios from 'axios';

// M-Pesa API Configuration
const MPESA_CONFIG = {
  // Sandbox URLs (change to production for live)
  authURL: 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
  stkPushURL: 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
  
  // Your app credentials (get these from Safaricom Developer Portal)
  consumerKey: process.env.MPESA_CONSUMER_KEY,
  consumerSecret: process.env.MPESA_CONSUMER_SECRET,
  businessShortCode: process.env.MPESA_BUSINESS_SHORTCODE || '174379', // Default sandbox shortcode
  passkey: process.env.MPESA_PASSKEY,
  callbackURL: process.env.MPESA_CALLBACK_URL,
};

// In-memory storage for tracking requests (use Redis/Database in production)
const pendingRequests = new Map();

// Generate M-Pesa access token
async function generateAccessToken() {
  try {
    // Check if credentials exist
    if (!MPESA_CONFIG.consumerKey || !MPESA_CONFIG.consumerSecret) {
      throw new Error('Missing M-Pesa consumer key or secret');
    }

    const auth = Buffer.from(`${MPESA_CONFIG.consumerKey}:${MPESA_CONFIG.consumerSecret}`).toString('base64');
    
    console.log('Requesting access token...');
    
    const response = await axios.get(MPESA_CONFIG.authURL, {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      timeout: 10000, // 10 second timeout
    });
    
    console.log('Access token generated successfully');
    return response.data.access_token;
  } catch (error) {
    console.error('Error generating access token:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    throw new Error(`Failed to generate access token: ${error.response?.data?.error_description || error.message}`);
  }
}

// Format phone number to M-Pesa format
function formatPhoneNumber(phoneNumber) {
  if (!phoneNumber) return null;
  
  // Remove any non-digit characters
  let cleanNumber = phoneNumber.replace(/\D/g, '');
  
  // Handle different phone number formats
  if (cleanNumber.startsWith('0')) {
    cleanNumber = '254' + cleanNumber.slice(1);
  } else if (cleanNumber.startsWith('+254')) {
    cleanNumber = cleanNumber.slice(4);
    cleanNumber = '254' + cleanNumber;
  } else if (cleanNumber.startsWith('254')) {
    // Already in correct format
  } else if (cleanNumber.length === 9) {
    cleanNumber = '254' + cleanNumber;
  }
  
  return cleanNumber;
}

// Generate timestamp for M-Pesa (YYYYMMDDHHMMSS)
function generateTimestamp() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');
  const second = String(now.getSeconds()).padStart(2, '0');
  
  return `${year}${month}${day}${hour}${minute}${second}`;
}

// Generate M-Pesa password
function generatePassword(businessShortCode, passkey, timestamp) {
  if (!businessShortCode || !passkey || !timestamp) {
    throw new Error('Missing required parameters for password generation');
  }
  
  const data = businessShortCode + passkey + timestamp;
  return Buffer.from(data).toString('base64');
}

// Main STK Push handler
export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    console.error('Invalid request method:', req.method);
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed. Use POST.' 
    });
  }

  try {
    console.log('STK Push request received:', req.body);

    const { phoneNumber, amount, accountReference, transactionDesc } = req.body;

    // Validate required fields
    if (!phoneNumber || !amount || !accountReference) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: phoneNumber, amount, accountReference'
      });
    }

    // Validate environment variables
    if (!MPESA_CONFIG.consumerKey || !MPESA_CONFIG.consumerSecret || !MPESA_CONFIG.passkey) {
      console.error('Missing M-Pesa configuration:', {
        hasConsumerKey: !!MPESA_CONFIG.consumerKey,
        hasConsumerSecret: !!MPESA_CONFIG.consumerSecret,
        hasPasskey: !!MPESA_CONFIG.passkey,
        hasCallbackURL: !!MPESA_CONFIG.callbackURL
      });
      return res.status(500).json({
        success: false,
        error: 'M-Pesa configuration incomplete. Check environment variables.'
      });
    }

    // Validate amount
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid amount. Must be a positive number.'
      });
    }

    // Format phone number
    const formattedPhone = formatPhoneNumber(phoneNumber);
    
    // Validate phone number format
    if (!formattedPhone || !formattedPhone.match(/^254\d{9}$/)) {
      return res.status(400).json({
        success: false,
        error: `Invalid phone number format. Use format: 254XXXXXXXXX. Got: ${formattedPhone}`
      });
    }

    console.log('Generating access token...');
    
    // Generate access token
    const accessToken = await generateAccessToken();
    
    // Generate timestamp and password
    const timestamp = generateTimestamp();
    const password = 'MTc0Mzc5YmZiMjc5ZjlhYTliZGJjZjE1OGU5N2RkNzFhNDY3Y2QyZTBjODkzMDU5YjEwZjc4ZTZiNzJhZGExZWQyYzkxOTIwMjUwNjE5MTcxNzIy';

    console.log('Generated credentials:', {
      timestamp,
      businessShortCode: MPESA_CONFIG.businessShortCode,
      hasPassword: !!password,
      hasAccessToken: !!accessToken
    });

    // Prepare STK Push request
    const stkPushPayload = {
      BusinessShortCode: MPESA_CONFIG.businessShortCode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.round(numAmount), // M-Pesa requires integer amount
      PartyA: formattedPhone,
      PartyB: MPESA_CONFIG.businessShortCode,
      PhoneNumber: formattedPhone,
      CallBackURL: MPESA_CONFIG.callbackURL || 'https://mydomain.com/api/mpesa/callback',
      AccountReference: accountReference,
      TransactionDesc: transactionDesc || 'Payment'
    };

    console.log('STK Push payload:', {
      ...stkPushPayload,
      Password: password // Don't log the actual password
    });

    // Send STK Push request
    const stkResponse = await axios.post(MPESA_CONFIG.stkPushURL, stkPushPayload, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      timeout: 15000, // 15 second timeout
    });

    console.log('STK Push response:', stkResponse.data);

    const { data } = stkResponse;

    // Check if request was successful
    if (data.ResponseCode === '0') {
      // Store request for status tracking
      const requestData = {
        checkoutRequestId: data.CheckoutRequestID,
        merchantRequestId: data.MerchantRequestID,
        phoneNumber: formattedPhone,
        amount: Math.round(numAmount),
        accountReference,
        status: 'pending',
        timestamp: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString() // 5 minutes expiry
      };

      pendingRequests.set(data.CheckoutRequestID, requestData);

      return res.status(200).json({
        success: true,
        message: 'STK Push sent successfully',
        checkoutRequestId: data.CheckoutRequestID,
        merchantRequestId: data.MerchantRequestID,
        customerMessage: data.CustomerMessage,
        responseCode: data.ResponseCode
      });
    } else {
      console.error('STK Push failed:', data);
      return res.status(400).json({
        success: false,
        error: data.errorMessage || 'STK Push failed',
        responseCode: data.ResponseCode,
        responseDescription: data.ResponseDescription
      });
    }

  } catch (error) {
    console.error('STK Push error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      stack: error.stack
    });
    
    // Handle specific M-Pesa errors
    if (error.response?.status === 401) {
      return res.status(401).json({
        success: false,
        error: 'Authentication failed. Check your M-Pesa credentials.',
        details: error.response.data
      });
    }
    
    if (error.response?.status === 400) {
      return res.status(400).json({
        success: false,
        error: error.response.data?.errorMessage || 'Invalid request parameters',
        details: error.response.data
      });
    }

    if (error.code === 'ECONNREFUSED') {
      return res.status(500).json({
        success: false,
        error: 'Cannot connect to M-Pesa API. Check network connection.'
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Internal server error. Please try again later.',
      details: error.message
    });
  }
}

// Environment variables validation function
export function validateConfig() {
  const required = [
    'MPESA_CONSUMER_KEY',
    'MPESA_CONSUMER_SECRET', 
    'MPESA_PASSKEY',
    'MPESA_CALLBACK_URL'
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing);
    return false;
  }
  
  return true;
}

// Helper functions 
export function getRequestStatus(checkoutRequestId) {
  const request = pendingRequests.get(checkoutRequestId);
  
  if (!request) {
    return null;
  }
  
  if (new Date() > new Date(request.expiresAt)) {
    pendingRequests.delete(checkoutRequestId);
    return { status: 'expired' };
  }
  
  return request;
}

export function updateRequestStatus(checkoutRequestId, status, additionalData = {}) {
  const request = pendingRequests.get(checkoutRequestId);
  
  if (request) {
    const updatedRequest = {
      ...request,
      status,
      ...additionalData,
      updatedAt: new Date().toISOString()
    };
    
    pendingRequests.set(checkoutRequestId, updatedRequest);
    return updatedRequest;
  }
  
  return null;
}

export function cleanupExpiredRequests() {
  const now = new Date();
  
  for (const [checkoutRequestId, request] of pendingRequests.entries()) {
    if (now > new Date(request.expiresAt)) {
      pendingRequests.delete(checkoutRequestId);
    }
  }
}