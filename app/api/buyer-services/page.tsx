// app/buyer-services/page.tsx
import React from "react";

const BuyerServices: React.FC = () => {
  return (
    <main className="max-w-7xl mx-auto px-4 py-12 mt-40">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Buyer Services</h1>

      <section className="space-y-6 text-gray-700 leading-relaxed">
        <p>
          At DriveCore Auto, we are committed to providing exceptional buyer
          support to ensure your purchase experience is smooth and hassle-free.
          Whether you’re searching for the perfect engine, transmission, swap kit,
          or subframe, our team is here to guide you every step of the way.
        </p>

        <p>
          <strong>Product Consultation:</strong> Need help choosing the right part?
          Our experts are available to provide personalized advice tailored to your
          vehicle model and project requirements, ensuring you get exactly what you
          need.
        </p>

        <p>
          <strong>Compatibility Support:</strong> To prevent ordering errors, we offer
          compatibility checks. Provide your vehicle details and VIN to verify the
          perfect fit before you buy.
        </p>

        <p>
          <strong>Installation Guidance:</strong> We provide detailed installation
          instructions and helpful resources. While we don’t offer installation
          services directly, we can recommend trusted professionals for assistance.
        </p>

        <p>
          <strong>Order Tracking & Shipping:</strong> Stay updated with real-time order
          tracking. Our shipping process is transparent, and we provide detailed
          information on freight and delivery options to meet your needs.
        </p>

        <p>
          <strong>Returns, Exchanges & Warranty:</strong> We make returns and exchanges
          easy and transparent. All eligible products come with a warranty backed by
          our commitment to quality and customer satisfaction.
        </p>

        <p>
          <strong>After-Sales Support:</strong> Our customer service doesn’t end at
          checkout. If you have questions or require technical support after your
          purchase, our team is ready to assist.
        </p>

        <p>
          <strong>Custom Orders & Special Requests:</strong> Looking for a rare part or
          a custom swap solution? Contact us to discuss special orders and custom
          requests tailored to your unique needs.
        </p>
      </section>
    </main>
  );
};

export default BuyerServices;
