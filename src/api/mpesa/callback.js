export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { Body } = req.body;
    const { stkCallback } = Body;
    
    const { 
      MerchantRequestID, 
      CheckoutRequestID, 
      ResultCode, 
      ResultDesc,
      CallbackMetadata 
    } = stkCallback;

    console.log('M-Pesa Callback received:', {
      MerchantRequestID,
      CheckoutRequestID,
      ResultCode,
      ResultDesc
    });

    if (ResultCode === 0) {
      // Payment successful
      const metadata = CallbackMetadata?.Item || [];
      const amount = metadata.find(item => item.Name === 'Amount')?.Value;
      const mpesaReceiptNumber = metadata.find(item => item.Name === 'MpesaReceiptNumber')?.Value;
      const transactionDate = metadata.find(item => item.Name === 'TransactionDate')?.Value;
      const phoneNumber = metadata.find(item => item.Name === 'PhoneNumber')?.Value;

      // Update your database with payment confirmation
      // You should:
      // 1. Find the order using CheckoutRequestID
      // 2. Update order status to 'paid'
      // 3. Save M-Pesa receipt number and transaction details
      // 4. Send confirmation email to customer
      // 5. Update inventory if needed

      console.log('Payment confirmed:', {
        amount,
        mpesaReceiptNumber,
        transactionDate,
        phoneNumber
      });

    } else {
      // Payment failed
      console.log('Payment failed:', ResultDesc);
      
      // Update your database to mark payment as failed
      // Send failure notification if needed
    }

    // Always respond with 200 to acknowledge receipt
    return res.status(200).json({ message: 'Callback processed' });

  } catch (error) {
    console.error('Callback processing error:', error);
    return res.status(200).json({ message: 'Callback processed with errors' });
  }
}