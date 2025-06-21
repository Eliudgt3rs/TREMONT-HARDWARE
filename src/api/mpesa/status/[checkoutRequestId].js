// api/mpesa/status/[checkoutRequestId].js
import { getRequestStatus } from '../stkpush.js';

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed. Use GET.' 
    });
  }

  try {
    const { checkoutRequestId } = req.query;

    if (!checkoutRequestId) {
      return res.status(400).json({
        success: false,
        error: 'Missing checkoutRequestId parameter'
      });
    }

    // Get request status from storage
    const requestData = getRequestStatus(checkoutRequestId);

    if (!requestData) {
      return res.status(404).json({
        success: false,
        error: 'Payment request not found or has expired'
      });
    }

    return res.status(200).json({
      success: true,
      status: requestData.status,
      checkoutRequestId: requestData.checkoutRequestId,
      merchantRequestId: requestData.merchantRequestId,
      phoneNumber: requestData.phoneNumber,
      amount: requestData.amount,
      accountReference: requestData.accountReference,
      timestamp: requestData.timestamp,
      updatedAt: requestData.updatedAt
    });

  } catch (error) {
    console.error('Status check error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}