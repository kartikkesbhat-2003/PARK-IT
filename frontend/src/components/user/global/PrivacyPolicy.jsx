import React from "react";
import { Wrapper } from "./Wrapper";
import { Footer } from "./Footer";
import { Link } from "react-router-dom";

export const PrivacyPolicy = () => {
  return (
    <section className="w-full ">
      <Wrapper className="w-full my-6 flex flex-col text-white">
        <h1 className="md:text-4xl font-extrabold mb-4 text-2xl">Privacy Policy</h1>
        <p className="text-gray-600 my-2">Effective Date: 29 December 2024</p>

        <div className="flex flex-col border-b border-black/[0.1] pb-4 mb-4">
          <p className="text-lg my-2">
            Welcome to PARK-IT! This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application and website. By accessing or using PARK-IT, you agree to the terms of this Privacy Policy.
          </p>
        </div>

        <div className="flex flex-col border-b border-black/[0.1] pb-4 mb-4">
          <h2 className="md:text-3xl font-bold mt-4 text-xl">Information We Collect</h2>
          <h3 className="md:text-2xl font-bold mt-2 text-lg">Personal Information</h3>
          <p className="text-lg my-2">Name, email address, phone number, and payment information when you create an account or complete a transaction.</p>
          <p className="text-lg my-2">Vehicle details if applicable.</p>
          <h3 className="md:text-2xl font-bold mt-2 text-lg">Non-Personal Information</h3>
          <p className="text-lg my-2">Browser type, operating system, IP address, and device information.</p>
          <p className="text-lg my-2">Usage data, including pages visited, time spent on the app, and interaction details.</p>
          <h3 className="md:text-2xl font-bold mt-2 text-lg">Location Data</h3>
          <p className="text-lg my-2">Your location may be collected to suggest nearby parking spaces. You can control this through your device settings.</p>
        </div>

        <div className="flex flex-col border-b border-black/[0.1] pb-4 mb-4">
          <h3 className="md:text-3xl font-medium mt-4 text-xl">How We Use Your Information</h3>
          <p className="text-lg my-2">We use your information for the following purposes:</p>
          <ul className="text-lg my-2 flex flex-col gap-2">
            <li><span className="mr-2">&#9679;</span>To provide and manage the services of PARK-IT.</li>
            <li><span className="mr-2">&#9679;</span>To process payments and facilitate transactions.</li>
            <li><span className="mr-2">&#9679;</span>To personalize user experiences and enhance app functionality.</li>
            <li><span className="mr-2">&#9679;</span>To communicate with you about updates, offers, or service-related announcements.</li>
            <li><span className="mr-2">&#9679;</span>To ensure security, prevent fraud, and comply with legal obligations.</li>
          </ul>
        </div>

        <div className="flex flex-col border-b border-black/[0.1] pb-4 mb-4">
          <h2 className="md:text-3xl font-bold mt-4 text-xl">Sharing Your Information</h2>
          <p className="text-lg my-2">We do not sell, rent, or trade your personal information. We may share your information in the following circumstances:</p>
          <h3 className="md:text-2xl font-bold mt-2 text-lg">With Service Providers</h3>
          <p className="text-lg my-2">Third-party payment processors to handle transactions securely.</p>
          <p className="text-lg my-2">Hosting providers and analytics tools to maintain and improve our platform.</p>
          <h3 className="md:text-2xl font-bold mt-2 text-lg">Legal Compliance</h3>
          <p className="text-lg my-2">If required by law, court order, or governmental authority.</p>
          <h3 className="md:text-2xl font-bold mt-2 text-lg">Business Transfers</h3>
          <p className="text-lg my-2">In case of a merger, acquisition, or sale of assets, your information may be transferred to the new entity.</p>
        </div>

        <div className="flex flex-col border-b border-black/[0.1] pb-4 mb-4">
          <h2 className="md:text-3xl font-bold mt-4 text-xl">Data Security</h2>
          <p className="text-lg my-2">We implement industry-standard security measures to protect your information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure.</p>
        </div>

        <div className="flex flex-col border-b border-black/[0.1] pb-4 mb-4">
          <h2 className="md:text-3xl font-bold mt-4 text-xl">Your Rights</h2>
          <p className="text-lg my-2">You have the following rights regarding your information:</p>
          <ul className="text-lg flex flex-col gap-2 mb-2">
            <li><span className="mr-2">&#9679;</span>Access and Portability: Request access to your personal data or a copy in a machine-readable format.</li>
            <li><span className="mr-2">&#9679;</span>Correction: Request correction of inaccurate or incomplete data.</li>
            <li><span className="mr-2">&#9679;</span>Deletion: Request deletion of your personal data, subject to legal obligations.</li>
            <li><span className="mr-2">&#9679;</span>Opt-out: Opt-out of receiving promotional communications.</li>
          </ul>
          <p className="text-lg my-2">To exercise your rights, contact us at support@parkit.com.</p>
        </div>

        <div className="flex flex-col border-b border-black/[0.1] pb-4 mb-4">
          <h2 className="md:text-3xl font-bold mt-4 text-xl">Cookies and Tracking Technologies</h2>
          <p className="text-lg my-2">PARK-IT uses cookies and similar technologies to enhance user experience and gather analytics. By using the app, you consent to the use of cookies.</p>
          <p className="text-lg my-2">You can manage cookie preferences through your browser or device settings.</p>
        </div>

        <div className="flex flex-col border-b border-black/[0.1] pb-4 mb-4">
          <h2 className="md:text-3xl font-bold mt-4 text-xl">Third-Party Links</h2>
          <p className="text-lg my-2">PARK-IT may contain links to third-party websites. We are not responsible for the privacy practices or content of those websites.</p>
        </div>

        <div className="flex flex-col border-b border-black/[0.1] pb-4 mb-4">
          <h2 className="md:text-3xl font-bold mt-4 text-xl">Changes to This Privacy Policy</h2>
          <p className="text-lg my-2">We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date. Continued use of the app after changes indicates acceptance of the revised policy.</p>
        </div>

        <div className="flex flex-col mb-4">
          <h2 className="md:text-3xl font-bold mt-4 text-xl">Contact Us</h2>
          <p className="text-lg my-2">If you have any questions about this Privacy Policy or our data practices, please contact us at:</p>
          <ul className="text-lg flex flex-col gap-2">
            <li>By email: <span className="underline underline-offset-2 text-blue-600">support@parkit.com</span></li>
            <li>By phone: +1-234-567-890</li>
            <li>Website: <Link href="https://www.parkit.com" className="text-blue-600 underline underline-offset-2">www.parkit.com</Link></li>
          </ul>
        </div>
      </Wrapper>
      <Footer />
    </section>
  );
};

