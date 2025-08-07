// app/refund-policy/page.tsx
import React from "react";

const RefundPolicyPage: React.FC = () => {
  return (
    <main className="max-w-4xl mx-auto px-6 py-12 mt-40">
      <h1 className="text-4xl font-bold mb-6 text-center">Refund Policy</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">1. Returns Eligibility</h2>
       <p className="text-gray-700 leading-relaxed">
  We accept returns within 14 days of delivery for most new, unused engine parts in their original packaging. All returned items must be in resellable condition, free of any signs of installation, wear, or damage. Returns must include all original components, hardware, and documentation provided with the item. Buyers are responsible for return shipping costs unless the return is due to our error (such as receiving the wrong item). A restocking fee may apply to certain returns, particularly for special-order or high-value components. We recommend contacting us before returning any item to confirm eligibility and to receive an RMA (Return Merchandise Authorization) number. Returns sent without an RMA or outside the 14-day window may be refused.
</p>



      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">2. Non-Returnable Items</h2>
        <p className="text-gray-700 leading-relaxed">
  Certain types of items are non-returnable due to their specific nature or usage restrictions. This includes custom or special-order engine parts that have been sourced or built to your exact specifications, as well as any electrical components or sensors, which cannot be returned once installed or connected due to safety and diagnostic integrity. Items that are marked as final sale or clearance are also not eligible for return. Additionally, any parts that show signs of installation, tampering, or damage caused by improper handling will not be accepted. It is important to double-check part compatibility, model numbers, and fitment before completing your purchase. If you are unsure whether an item qualifies for return, please contact our support team with the part number and details before placing your order. We make every effort to ensure clarity, and all non-returnable items will be clearly identified at the time of purchase.
</p>


      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">3. Refund Process</h2>
       <p className="text-gray-700 leading-relaxed">
  Once we receive your returned item—whether it’s an engine, transmission, swap kit, subframe, or any other part—our team will carefully inspect it to ensure it meets our return eligibility criteria. You will be notified via email regarding the approval or rejection of your refund based on the condition of the item. If approved, the refund will be processed to your original method of payment within 7 business days.
</p>


      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">4. Shipping Costs</h2>
        <p className="text-gray-700 leading-relaxed">
  Shipping costs are non-refundable. Whether you're returning an engine, transmission, swap kit, subframe, or any other part, you will be responsible for covering the return shipping costs associated with your item.
</p>

        

      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">5. Contact Us</h2>
        <p className="text-gray-700 leading-relaxed">
          If you have any questions about our refund policy, please contact us at <a href="mailto:support@yourdomain.com" className="text-blue-600 hover:underline">support@yourdomain.com</a>.
        </p>
      </section>
    </main>
  );
};

export default RefundPolicyPage;
