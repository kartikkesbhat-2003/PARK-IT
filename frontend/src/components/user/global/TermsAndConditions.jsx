import React from "react";
import { Wrapper } from "./Wrapper";
import { Link } from "react-router-dom";
import { Footer } from "./Footer";

export const TermsAndConditionPage = () => {
  return (
    <section className="w-full">
      <Wrapper className="w-full my-6 flex flex-col text-white">
        <h2 className="md:text-4xl font-extrabold mb-4 text-2xl">
          Terms and Conditions
        </h2>
        <p className="text-gray-600 my-2">LAST UPDATED: 29 December 2024</p>

        <article className="flex flex-col border-b border-black/[0.1] pb-4 mb-4">
          <p className="text-lg my-2">Welcome to PARK-IT!</p>
          <p className="text-lg my-2">
            These terms and conditions outline the rules and regulations for the
            use of the PARK-IT application and website, located at{" "}
            <Link
              href="https://www.parkit.com/"
              className="text-blue-600 underline underline-offset-2"
              rel="noopener noreferrer"
            >
              https://www.parkit.com/
            </Link>
            .
          </p>
          <p className="text-lg my-2">
            By accessing this application or website, we assume you accept these
            terms and conditions. Do not continue to use PARK-IT if you do not
            agree to all of the terms and conditions stated on this page.
          </p>
          <p className="text-lg my-2">
            The following terminology applies to these Terms and Conditions,
            Privacy Policy, and Disclaimer Notice: "User," "You," and "Your"
            refer to the person using this application. "Company," "We," "Our,"
            and "Us" refer to PARK-IT. "Service" refers to the features and
            functionalities provided by PARK-IT.
          </p>
        </article>

        <article className="flex flex-col border-b border-black/[0.1] pb-4 mb-4">
          <h3 className="md:text-3xl font-medium mt-4 text-xl">Cookies</h3>
          <p className="text-lg my-2">
            We employ the use of cookies to enhance user experience. By
            accessing PARK-IT, you consent to the use of cookies in accordance
            with our Privacy Policy.
          </p>
        </article>

        <article className="flex flex-col border-b border-black/[0.1] pb-4 mb-4">
          <h3 className="md:text-3xl font-medium mt-4 text-xl">License</h3>
          <p className="text-lg my-2">
            Unless otherwise stated, PARK-IT and/or its licensors own the
            intellectual property rights for all material on this platform.
            These rights are reserved, and the material is made available for
            personal use only, subject to restrictions set in these terms and
            conditions.
          </p>
          <p className="text-lg my-2">You must not:</p>
          <ul className="text-lg my-2 flex flex-col gap-2">
            <li>
              <span className="mr-2">&#9679;</span>Republish material from
              PARK-IT.
            </li>
            <li>
              <span className="mr-2">&#9679;</span>Sell, rent, or sub-license
              material from PARK-IT.
            </li>
            <li>
              <span className="mr-2">&#9679;</span>Reproduce, duplicate, or copy
              material from PARK-IT.
            </li>
            <li>
              <span className="mr-2">&#9679;</span>Redistribute content from
              PARK-IT.
            </li>
          </ul>
        </article>

        <article className="flex flex-col border-b border-black/[0.1] pb-4 mb-4">
          <h3 className="md:text-3xl font-medium mt-4 text-xl">User Responsibilities</h3>
          <p className="text-lg my-2">
            Users are responsible for providing accurate details when listing or
            booking parking spaces. Any misuse, fraudulent behavior, or violation
            of terms will result in immediate suspension or termination of your
            account.
          </p>
          <p className="text-lg my-2">
            PARK-IT is not liable for any disputes between hosts and guests.
            Please ensure clear communication and documentation of agreements.
          </p>
        </article>

        <article className="flex flex-col border-b border-black/[0.1] pb-4 mb-4">
          <h3 className="md:text-3xl font-medium mt-4 text-xl">Payment Policy</h3>
          <p className="text-lg my-2">
            Payments for parking spaces are processed through secure third-party
            payment gateways. PARK-IT does not store or manage payment
            information. Please refer to our Privacy Policy for more details.
          </p>
        </article>

        <article className="flex flex-col border-b border-black/[0.1] pb-4 mb-4">
          <h3 className="md:text-3xl font-medium mt-4 text-xl">Dispute Resolution</h3>
          <p className="text-lg my-2">
            In the event of a dispute, PARK-IT will act as a mediator to ensure
            a fair resolution between the host and the guest. However, we are
            not liable for any nresolved disputes.
          </p>
        </article>
      </Wrapper>
      <Footer />
    </section>
  );
};
