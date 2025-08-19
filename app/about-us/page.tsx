// app/about/page.tsximport React from "react";

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center justify-between gap-6 mt-20 md:mt-20 lg:mt-40">
        {/* Left: Company Name */}
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-5xl md:text-6xl font-extrabold text-rose-700 uppercase tracking-tight">
            DriveCore Auto
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-md">
            Trusted source for <span className="font-semibold">high-quality imported engines</span>, 
            blending Japanese engineering excellence with U.S. reliability. 
          </p>
        </div>

        {/* Right: About/Main Summary */}
        <div className="md:w-1/2 bg-gray-50 rounded-2xl shadow-md p-6 text-left">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Power. Precision. Performance.
          </h2>
          <p className="text-base text-gray-700 leading-relaxed">
            DriveCore Auto delivers reliable, performance-driven automotive engines and 
            components across the United States. Our products are sourced directly from 
            <strong> top manufacturers in Japan</strong> and undergo strict quality checks 
            to meet the demands of mechanics, enthusiasts, and everyday drivers.  
          </p>
        </div>
      </section>

      {/* Main About Content */}
      <main className="max-w-5xl mx-auto px-6 py-12">
       

        <div
  role="heading"
  aria-level={1}
   className="text-4xl font-bold text-gray-900 mb-10"
>
  About Us
</div>

        <div className="space-y-8 text-gray-700 leading-relaxed">
          {/* Introduction */}
          <section>
            <p>
              At <span className="font-semibold">DriveCore Auto</span>, we are
              committed to delivering <strong>high-quality, reliable, and
              performance-driven automotive engines</strong> to customers across
              the United States. Headquartered in the USA, we specialize in importing
              and distributing premium engines sourced directly from{" "}
              <strong>trusted manufacturers in Japan</strong>.
            </p>
          </section>

          {/* Mission */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Our Mission</h2>
            <p>
              Our mission is simple: to provide{" "}
              <strong>affordable, dependable, and expertly tested engines</strong>{" "}
              that extend the life of your vehicle and ensure top-level performance
              on the road. Every engine we supply undergoes a{" "}
              <strong>strict quality inspection process</strong> to meet both{" "}
              <strong>Japanese engineering standards</strong> and{" "}
              <strong>U.S. customer expectations</strong>.
            </p>
          </section>

          {/* Experience */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Our Experience</h2>
            <p>
              With years of experience in the automotive industry, DriveCore Auto has
              earned a reputation for <strong>trust, transparency, and customer
              satisfaction</strong>. Whether you are a professional mechanic, a car
              enthusiast, or simply looking to restore your vehicle’s performance, we
              are here to help you find the right solution.
            </p>
          </section>

          {/* Commitment */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Our Commitment</h2>
            <p>
              We take pride in being more than just an engine supplier — we are your{" "}
              <strong>trusted partner in reliability and performance</strong>.
            </p>
          </section>

          {/* Quality Assurance */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Quality Assurance</h2>
            <p>
              Every engine we source is carefully inspected and tested to ensure it
              meets <strong>the highest standards of performance and durability</strong>. 
              Our rigorous quality control process guarantees that our customers receive
              products that are <strong>safe, reliable, and long-lasting</strong>.
            </p>
          </section>

          {/* Customer Support */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Customer Support</h2>
            <p>
              At DriveCore Auto, customer satisfaction is our top priority. Our
              knowledgeable support team is always available to assist you in
              selecting the right engine, answering questions, and providing guidance
              for installation and maintenance.
            </p>
          </section>

          {/* Innovation */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Innovation & Reliability</h2>
            <p>
              We continuously strive to incorporate the latest technologies and
              innovations in the automotive industry. By combining Japanese engineering
              excellence with U.S. expertise, we deliver <strong>engines that are both
              advanced and dependable</strong>, ensuring your vehicle performs at its
              best.
            </p>
          </section>
        </div>
      </main>
    </>
  );
}
