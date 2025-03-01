import { Wrapper } from "./Wrapper";
import { Footer } from "./Footer";
import React from "react";

export const ReturnRefundPolicy = () => {
  return (
    <>
      <Wrapper>
        <div className="container mx-auto p-4 mt-[80px] text-white">
          <h1 className="md:text-4xl font-extrabold mb-4 text-2xl">Return and Refund Policy</h1>
          <p className="text-gray-600 my-2">Effective Date: 29 December 2024</p>

          <p className="text-lg my-2">
            Thank you for using PARK-IT. We strive to provide the best services to our users. This Return and Refund Policy outlines the conditions under which refunds may be requested and processed.
          </p>

          <h3 className="md:text-3xl font-bold mt-4 text-xl">General Policy</h3>
          <p className="text-lg my-2">
            All sales and transactions made through PARK-IT are final and non-refundable unless otherwise stated in this policy.
            Refunds may be considered in specific cases such as service disruptions, erroneous charges, or cancellation of a booked parking spot under eligible conditions.
          </p>

          <h3 className="md:text-3xl font-bold mt-4 text-xl">Refund Eligibility</h3>
          <p className="text-lg my-2">You may be eligible for a refund under the following circumstances:</p>
          <h3 className="md:text-2xl font-semibold mt-4 text-lg">Service Disruption</h3>
          <ul className="list-disc ml-6 mb-4">
            <li>If the booked parking spot is unavailable due to technical or service issues on our platform.</li>
            <li>If there is an error in payment processing that results in overcharging.</li>
          </ul>
          <h3 className="md:text-2xl font-semibold mt-4 text-lg">Cancellations</h3>
          <p className="text-lg my-2">Refunds for cancellations will depend on the timing of the cancellation:</p>
          <ul className="list-disc ml-6 mb-4">
            <li>Before the booking start time: Full refund minus any applicable processing fees.</li>
            <li>After the booking start time: No refund.</li>
          </ul>
          <h3 className="md:text-2xl font-semibold mt-4 text-lg">Duplicate Transactions</h3>
          <p className="text-lg my-2">If a user is charged multiple times for the same booking, a refund will be issued for the duplicate charges.</p>

          <h3 className="md:text-3xl font-bold mt-4 text-xl">How to Request a Refund</h3>
          <p className="text-lg my-2">To request a refund, please follow these steps:</p>
          <ul className="list-disc ml-6 mb-4">
            <li>Contact our support team within 7 days of the transaction.</li>
            <li>Provide the following details:
              <ul className="list-disc ml-6">
                <li>Booking reference number.</li>
                <li>Transaction details.</li>
                <li>Reason for the refund request.</li>
              </ul>
            </li>
            <li>Submit your request via email to support@parkit.com or through our in-app support chat.</li>
          </ul>

          <h3 className="md:text-3xl font-bold mt-4 text-xl">Refund Processing</h3>
          <ul className="list-disc ml-6 mb-4">
            <li>Once your request is received, we will review it within 5-7 business days.</li>
            <li>If approved, the refund will be processed to the original payment method within 7-14 business days, depending on your financial institution.</li>
            <li>If your refund request is denied, you will be notified with an explanation.</li>
          </ul>

          <h3 className="md:text-3xl font-bold mt-4 text-xl">Non-Refundable Items</h3>
          <ul className="list-disc ml-6 mb-4">
            <li>Bookings canceled after the parking start time.</li>
            <li>Charges incurred due to user error or incorrect information provided during the booking process.</li>
            <li>Fees paid for premium services (if any), unless the service was not provided.</li>
          </ul>

          <h3 className="md:text-3xl font-bold mt-4 text-xl">Changes to This Policy</h3>
          <p className="text-lg my-2">
            We may update this Return and Refund Policy periodically. Any changes will be posted on this page with the updated effective date. Continued use of PARK-IT after changes are made constitutes acceptance of the revised policy.
          </p>

          <h3 className="md:text-3xl font-bold mt-4 text-xl">Contact Us</h3>
          <p className="text-lg my-2">
            If you have questions about this policy or need assistance with a refund, please contact us at:
          </p>
          <ul className="list-disc ml-6 mb-4">
            <li><strong>Email:</strong> <a href="mailto:support@parkit.com" className="text-blue-500">support@parkit.com</a></li>
            <li><strong>Phone:</strong> +1-234-567-890</li>
            <li><strong>Website:</strong> <a href="https://www.parkit.com" className="text-blue-500">www.parkit.com</a></li>
          </ul>
        </div>
      </Wrapper>
        <Footer />
    </>
  );
};
