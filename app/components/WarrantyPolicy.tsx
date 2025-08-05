export default function WarrantyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 text-gray-800 mt-40">
      <h1 className="text-3xl font-bold text-center mb-6">DiveCore Auto - Warranty Policy</h1>

      <p className="text-center mb-8">
        DiveCore Auto, based in the United States, is dedicated to supplying quality used Japanese engines and transmissions.
        Our warranty policy clearly defines the scope of coverage and limitations to ensure transparency, so you can
        make informed decisions with confidence and understand what we stand behind.
      </p>

      <hr className="my-6 border-gray-300" />

      {/* Warranty Coverage */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Warranty Coverage</h2>
        <p className="text-red-600 font-semibold mb-2">
          IMPORTANT: Please note that <strong>shipping and labor costs are not covered</strong> by this warranty.
          Customers are responsible for all associated fees related to installation and transport.
        </p>
        <p>
          Our warranty strictly covers the <strong>internal mechanical performance</strong> of the engine or transmission.
          This means we protect against manufacturing defects or damages that occurred before shipment but
          <strong>do not cover issues caused by misuse, improper installation, or external factors</strong>.
          The warranty periods vary based on the type of engine or transmission to reflect their different usage and risk profiles.
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-4">
          <li>
            <strong>90-Day Warranty:</strong> Applies to standard or non-performance engines.
            This warranty period begins on the date printed on your invoice and provides peace of mind against early mechanical failures.
          </li>
          <li>
            <strong>30-Day Start-Up Warranty:</strong> Applies to performance engines such as turbocharged, supercharged, VTEC, VVTI, VVL, and MIVEC variants.
            Given the higher stress these engines experience, this limited warranty covers defects identified during initial operation only.
          </li>
          <li>
            <strong>No Warranty on Rotary Engines:</strong> Due to the historically high failure rate and specialized nature of rotary engines,
            all such units are sold strictly “as-is” without any warranty.
          </li>
          <li>
            <strong>30-Day Unlimited Mileage Warranty (Transmissions):</strong> Applies to standard, non-performance transmissions.
            This warranty protects the internal components against defects regardless of mileage during the warranty period.
          </li>
          <li>
            <strong>30-Day Start-Up Warranty (Performance Transmissions):</strong> Covers only internal defects discovered during initial startup and operation.
          </li>
        </ul>

        <p className="mt-4">
          The warranty exclusively covers the <strong>internal parts</strong> of the engine block and transmission, including pistons, crankshaft, cylinder heads, camshafts, gears, and housings.
          It explicitly excludes any external parts or components attached to the engine or transmission assembly.
        </p>

        <p className="mt-4 font-semibold">Non-covered parts include but are not limited to:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Clutches, flywheels, and torque converters, which are considered wear items and depend on installation quality.</li>
          <li>Electrical components such as distributors, coil packs, alternators, and starters that have separate failure modes.</li>
          <li>Accessory pumps including air conditioning and power steering pumps, as well as sensors and solenoids which are often vehicle-specific.</li>
          <li>Manifolds, fuel injectors, valve covers, oil pans, and other external engine hardware that can be damaged during shipping or installation.</li>
        </ul>
      </section>

      {/* Installation Requirements */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Installation Requirements</h2>
        <p>
          To maintain warranty eligibility, the engine or transmission <strong>must be installed by a certified professional mechanic or a reputable auto repair shop</strong>.
          This is vital because proper installation techniques significantly impact the product’s performance and longevity.
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li>
            We do <strong>not offer technical support for installation</strong>. The responsibility for correct installation lies entirely with the installer.
          </li>
          <li>
            If your engine or transmission is installed by an uncertified individual or if improper installation is suspected, the warranty will be considered void.
          </li>
        </ul>
        <p className="mt-2">
          This policy is designed to protect both the customer and DiveCore Auto by ensuring that products are handled correctly,
          minimizing the risk of damage due to installation errors and ensuring a fair claims process.
        </p>
      </section>

      {/* Warranty Exclusions */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Warranty Exclusions</h2>
        <p>
          The warranty will be null and void and DiveCore Auto will disclaim all responsibility for any issues or damages caused by the following:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li>Improper or incorrect installation, including misalignment or use of incompatible parts.</li>
          <li>Engines that have been subjected to racing, redlining, or other forms of aggressive or competitive use beyond manufacturer specifications.</li>
          <li>Failures due to insufficient oil pressure, oil starvation, or the use of contaminated or substandard lubricants.</li>
          <li>Damage caused by overheating resulting from poor cooling system maintenance, lack of coolant, or blocked radiator flow.</li>
          <li>Modifications involving forced induction systems (turbochargers, superchargers, nitrous oxide) that were not part of the original engine design.</li>
          <li>Aftermarket ECU tuning, performance chips, or any changes to the engine management system that affect factory settings.</li>
          <li>Neglecting to replace timing belts, chains, or tensioners as recommended prior to installation, leading to mechanical failure.</li>
          <li>Disassembly or tampering with internal components such as cylinder heads, pistons, or crankshafts, which compromises factory warranties.</li>
          <li>Failures of peripheral systems, including fuel pumps, radiators, emission control equipment, or cooling system parts.</li>
          <li>Damage or issues that are cosmetic in nature, such as scratches, dents, broken plastics, or rust.</li>
          <li>Engines or transmissions that fail to meet emissions or smog testing requirements.</li>
        </ul>
      </section>

      {/* Return & Refund Policy */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Return & Refund Policy</h2>
        <p>
          We urge all customers to verify compatibility and fitment prior to purchase to avoid inconvenience.
          Due to the specialized nature of used automotive parts, our return and refund policies are carefully structured:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li>No refunds or exchanges are granted for engines or transmissions unless a verified defect exists covered by this warranty.</li>
          <li>Deposits become non-refundable after 7 business days from the date they are made.</li>
          <li>Returned checks will incur a mandatory administrative fee of <strong>$35.00</strong> to cover processing costs.</li>
          <li>Any refused or returned orders are subject to a <strong>25% restocking fee</strong> in addition to all inbound and outbound shipping charges.</li>
          <li>DiveCore Auto assumes no responsibility for damages or losses that occur during transit once the shipment has left our warehouse.</li>
        </ul>
      </section>

      {/* Product Disclosure */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">General Product Disclosure</h2>
        <p>
          All engines and transmissions supplied by DiveCore Auto are used and imported from Japan.
          It is common for these units to show minor cosmetic wear that does not impact mechanical function.
        </p>
        <ul className="list-disc pl-5 mt-2 space-y-2">
          <li>Visible scratches, minor dents, or broken plastic covers are normal and do not indicate mechanical defects.</li>
          <li>Plastic or rubber accessories may be missing or damaged due to handling or shipping and must be replaced by the installer.</li>
          <li><strong>Warranty coverage is strictly limited to internal mechanical defects and performance issues.</strong></li>
        </ul>
      </section>

      {/* Warranty Claim Procedure */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Defective Engine Claim Procedure</h2>
        <p>
          In the event you suspect a defect covered by this warranty, please follow the procedure below to ensure your claim can be evaluated promptly:
        </p>
        <ol className="list-decimal pl-5 mt-2 space-y-3">
          <li>
            Obtain a detailed <strong>written diagnostic report</strong> from a certified mechanic.
            This report must describe the defect clearly and confirm that it relates to internal mechanical failure.
          </li>
          <li>
            Provide clear photographs showing the defect area, engine serial numbers, and any relevant labels.
          </li>
          <li>
            Include a copy of the mechanic’s certification or license along with full contact information.
          </li>
          <li>
            Email the complete documentation to <a href="mailto:support@divecoreauto.com" className="text-blue-600 underline">support@divecoreauto.com</a>.
          </li>
        </ol>
        <p className="mt-4">
          After reviewing the materials, DiveCore Auto will determine if repair, replacement, or refund is appropriate.
          Only the defective internal parts covered under warranty are eligible.
          Please ensure all original parts are returned to us for inspection.
        </p>
      </section>

      {/* Contact Section */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Contact</h2>
        <ul className="space-y-1">
          <li>
            <strong>Email:</strong> <a href="mailto:support@divecoreauto.com" className="text-blue-600 underline">support@divecoreauto.com</a>
          </li>
          <li>
            <strong>Phone:</strong> (123) 456-7890
          </li>
          <li>
            <strong>Website:</strong> <a href="https://www.divecoreauto.com" className="text-blue-600 underline">www.divecoreauto.com</a>
          </li>
        </ul>
        <p className="mt-4 text-sm italic">
          DiveCore Auto reserves the right to modify or update this warranty policy at any time without prior notice.
          The most current version is always available on your invoice and on our official website.
        </p>
      </section>
    </div>
  );
}
