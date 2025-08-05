import React from "react";

// Component that displays DriveCore Auto's Shipping Information
const ShippingInformation = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-gray-800 mt-40">
      {/* Page Title */}
      <h2 className="text-2xl font-semibold mb-6 border-b pb-2">
        📦 Shipping Information – DriveCore Auto
      </h2>

      {/* Important Note: Customer must provide a working phone number */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">☎ Important – Contact Information</h3>
        <p>
          Please ensure that you provide a valid and working phone number at the time of placing your order.
          This is essential for the carrier to schedule delivery or contact you if there are any issues with your shipment.
          Failure to provide a reachable phone number may result in delays or your shipment being returned to us at your expense.
        </p>
      </div>

      {/* Delivery Time & Processing Details */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">⏱ Delivery Times & Order Processing</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            We typically process and ship all in-stock orders <strong>within 1 business day</strong>.
            Orders placed over the weekend or during public holidays will be processed on the next working day.
          </li>
          <li>
            Our main warehouse is located in <strong>Belleville, New Jersey</strong>. If you are located in the Northeast or surrounding regions,
            your order will generally arrive within <strong>1–5 business days</strong> after dispatch.
          </li>
          <li>
            For customers located on the <strong>West Coast</strong> or farther regions, delivery may take longer,
            typically between <strong>5 to 15 business days</strong>, depending on distance, weather, and carrier schedules.
          </li>
        </ul>
      </div>

      {/* Shipping Cost Policy */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">🚚 Shipping Costs & Fees</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            Please note that <strong>we do not offer free shipping</strong>. All shipping rates are calculated based on the destination, size, and weight of the product.
            You will be responsible for all shipping charges.
          </li>
          <li>
            Some deliveries may require additional fees such as <strong>residential delivery fees</strong> or <strong>lift gate services</strong> (for heavy items).
            These fees are set by the freight carrier and are non-negotiable.
          </li>
          <li>
            To receive an accurate shipping cost before placing your order, please <strong>contact us</strong> by phone or email and provide your complete zip/postal code and the product you're interested in.
          </li>
        </ul>
      </div>

      {/* Puerto Rico Shipping Details */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">🇵🇷 Shipping to Puerto Rico</h3>
        <p>
          We ship to Puerto Rico using freight carriers. Please reach out to us to receive a custom shipping quote based on your exact location and product size.
          Customers in Puerto Rico are fully responsible for any applicable <strong>customs duties, import taxes, handling charges</strong>, or port-related fees.
        </p>
      </div>

      {/* What to Know Before Signing the Delivery */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">❗ What You MUST Know Before Signing for Delivery</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Before you sign the delivery slip</strong>, thoroughly inspect the <strong>outer packaging and box</strong> for any dents, holes, tears, crushed corners, or signs of water damage.
            Do this while the driver is still present.
          </li>
          <li>
            Please understand: <strong>you are not allowed to open the package</strong> before signing. The inspection must be external only.
            Once you sign, it indicates you accept the item in its current visible condition.
          </li>
          <li>
            If you see any visible signs of damage — even if you think it's minor — <strong>do not sign without noting the damage clearly on the delivery receipt</strong>.
            For example: “Box crushed on corner, possible internal damage.”
          </li>
          <li>
            <strong>Never sign 'Received in good condition'</strong> unless you are 100% sure there are no damages visible externally.
            Signing without comments waives your right to claim compensation from the freight carrier.
          </li>
          <li>
            DriveCore Auto <strong>is not responsible for shipping-related damages</strong>. Once the product leaves our facility,
            insurance coverage is managed by the freight carrier. If you fail to note issues at delivery, you forfeit the right to file a damage claim.
          </li>
        </ul>
      </div>

      {/* Overseas Shipping Information */}
      <div>
        <h3 className="text-lg font-semibold mb-2">🌍 International Shipping (Outside the U.S.)</h3>
        <p>
          For overseas customers, please email us your complete shipping address so we can generate a custom shipping quote.
          At this time, we only ship to the <strong>nearest international sea port</strong> in your country or region.
        </p>
        <p className="mt-2">
          Once the shipment arrives at the sea port, it becomes the customer’s responsibility to handle the <strong>final delivery</strong> to their destination.
          You are also fully responsible for any applicable <strong>customs clearance, import taxes, duties, and port fees</strong> imposed by your country.
        </p>
      </div>
    </div>
  );
};

export default ShippingInformation;
