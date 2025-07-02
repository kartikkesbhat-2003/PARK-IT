import Razorpay from "razorpay";
import crypto from "crypto";
import { env } from "../../config/env.config";

const razorpay = new Razorpay({
  key_id: env.RAZORPAY.keyId || "",
  key_secret: env.RAZORPAY.secret || "",
});

export const razorpayService = {
  createOrder: async (orderData: {
    amount: number;
    receipt: string;
    currency?: string;
    notes?: Record<string, string>;
  }) => {
    try {
      const amount = Math.round(orderData.amount * 100);

      const options = {
        amount,
        currency: orderData.currency || "INR",
        receipt: orderData.receipt,
        notes: orderData.notes || {},
      };

      const order = await razorpay.orders.create(options);
      return order;
    } catch (error) {
      console.error("Error creating Razorpay order:", error);
      throw error;
    }
  },

  verifyPaymentSignature: (
    orderId: string,
    paymentId: string,
    signature: string
  ): boolean => {
    try {
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
        .update(`${orderId}|${paymentId}`)
        .digest("hex");

      return expectedSignature === signature;
    } catch (error) {
      console.error("Error verifying payment signature:", error);
      return false;
    }
  },

  fetchPaymentDetails: async (paymentId: string) => {
    try {
      const payment = await razorpay.payments.fetch(paymentId);
      return payment;
    } catch (error) {
      console.error("Error fetching payment details:", error);
      throw error;
    }
  },
};
