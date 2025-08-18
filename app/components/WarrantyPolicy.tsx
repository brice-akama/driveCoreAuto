"use client";

import { useLanguage } from "@/app/context/LanguageContext";

export default function WarrantyPolicy() {
  const { translate } = useLanguage();

  return (
    <div className="py-8 text-gray-800 mt-20 lg:mt-40 px-12 lg:px-20 ">
      <h1 className="text-3xl font-bold text-center mb-6">
        {translate("Warranty Policy")}
      </h1>

      <p className="text-center mb-8">
        {translate(
          "DiveCore Auto, based in the United States, is dedicated to supplying quality used Japanese engines and transmissions. Our warranty policy clearly defines the scope of coverage and limitations to ensure transparency, so you can make informed decisions with confidence and understand what we stand behind."
        )}
      </p>

      <hr className="my-6 border-gray-300" />

      {/* Warranty Coverage */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">
          {translate("Warranty Coverage")}
        </h2>
        <p className="text-red-600 font-semibold mb-2">
          {translate(
            "IMPORTANT: Please note that shipping and labor costs are not covered by this warranty. Customers are responsible for all associated fees related to installation and transport."
          )}
        </p>
        <p>
          {translate(
            "Our warranty strictly covers the internal mechanical performance of the engine or transmission. This means we protect against manufacturing defects or damages that occurred before shipment but do not cover issues caused by misuse, improper installation, or external factors. The warranty periods vary based on the type of engine or transmission to reflect their different usage and risk profiles."
          )}
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-4">
          <li>{translate("90-Day Warranty: Applies to standard or non-performance engines. This warranty period begins on the date printed on your invoice and provides peace of mind against early mechanical failures.")}</li>
          <li>{translate("30-Day Start-Up Warranty: Applies to performance engines such as turbocharged, supercharged, VTEC, VVTI, VVL, and MIVEC variants. Given the higher stress these engines experience, this limited warranty covers defects identified during initial operation only.")}</li>
          <li>{translate("No Warranty on Rotary Engines: Due to the historically high failure rate and specialized nature of rotary engines, all such units are sold strictly “as-is” without any warranty.")}</li>
          <li>{translate("30-Day Unlimited Mileage Warranty (Transmissions): Applies to standard, non-performance transmissions. This warranty protects the internal components against defects regardless of mileage during the warranty period.")}</li>
          <li>{translate("30-Day Start-Up Warranty (Performance Transmissions): Covers only internal defects discovered during initial startup and operation.")}</li>
        </ul>

        <p className="mt-4">
          {translate("The warranty exclusively covers the internal parts of the engine block and transmission, including pistons, crankshaft, cylinder heads, camshafts, gears, and housings. It explicitly excludes any external parts or components attached to the engine or transmission assembly.")}
        </p>

        <p className="mt-4 font-semibold">{translate("Non-covered parts include but are not limited to:")}</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>{translate("Clutches, flywheels, and torque converters, which are considered wear items and depend on installation quality.")}</li>
          <li>{translate("Electrical components such as distributors, coil packs, alternators, and starters that have separate failure modes.")}</li>
          <li>{translate("Accessory pumps including air conditioning and power steering pumps, as well as sensors and solenoids which are often vehicle-specific.")}</li>
          <li>{translate("Manifolds, fuel injectors, valve covers, oil pans, and other external engine hardware that can be damaged during shipping or installation.")}</li>
        </ul>
      </section>

      {/* Installation Requirements */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">
          {translate("Installation Requirements")}
        </h2>
        <p>
          {translate(
            "To maintain warranty eligibility, the engine or transmission must be installed by a certified professional mechanic or a reputable auto repair shop. This is vital because proper installation techniques significantly impact the product’s performance and longevity."
          )}
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li>{translate("We do not offer technical support for installation. The responsibility for correct installation lies entirely with the installer.")}</li>
          <li>{translate("If your engine or transmission is installed by an uncertified individual or if improper installation is suspected, the warranty will be considered void.")}</li>
        </ul>
        <p className="mt-2">
          {translate(
            "This policy is designed to protect both the customer and DiveCore Auto by ensuring that products are handled correctly, minimizing the risk of damage due to installation errors and ensuring a fair claims process."
          )}
        </p>
      </section>

      {/* Warranty Exclusions */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">
          {translate("Warranty Exclusions")}
        </h2>
        <p>
          {translate("The warranty will be null and void and DiveCore Auto will disclaim all responsibility for any issues or damages caused by the following:")}
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li>{translate("Improper or incorrect installation, including misalignment or use of incompatible parts.")}</li>
          <li>{translate("Engines that have been subjected to racing, redlining, or other forms of aggressive or competitive use beyond manufacturer specifications.")}</li>
          <li>{translate("Failures due to insufficient oil pressure, oil starvation, or the use of contaminated or substandard lubricants.")}</li>
          <li>{translate("Damage caused by overheating resulting from poor cooling system maintenance, lack of coolant, or blocked radiator flow.")}</li>
          <li>{translate("Modifications involving forced induction systems (turbochargers, superchargers, nitrous oxide) that were not part of the original engine design.")}</li>
          <li>{translate("Aftermarket ECU tuning, performance chips, or any changes to the engine management system that affect factory settings.")}</li>
          <li>{translate("Neglecting to replace timing belts, chains, or tensioners as recommended prior to installation, leading to mechanical failure.")}</li>
          <li>{translate("Disassembly or tampering with internal components such as cylinder heads, pistons, or crankshafts, which compromises factory warranties.")}</li>
          <li>{translate("Failures of peripheral systems, including fuel pumps, radiators, emission control equipment, or cooling system parts.")}</li>
          <li>{translate("Damage or issues that are cosmetic in nature, such as scratches, dents, broken plastics, or rust.")}</li>
          <li>{translate("Engines or transmissions that fail to meet emissions or smog testing requirements.")}</li>
        </ul>
      </section>

      {/* Return & Refund Policy */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">
          {translate("Return & Refund Policy")}
        </h2>
        <p>
          {translate(
            "We urge all customers to verify compatibility and fitment prior to purchase to avoid inconvenience. Due to the specialized nature of used automotive parts, our return and refund policies are carefully structured:"
          )}
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li>{translate("No refunds or exchanges are granted for engines or transmissions unless a verified defect exists covered by this warranty.")}</li>
          <li>{translate("Deposits become non-refundable after 7 business days from the date they are made.")}</li>
          <li>{translate("Returned checks will incur a mandatory administrative fee of $35.00 to cover processing costs.")}</li>
          <li>{translate("Any refused or returned orders are subject to a 25% restocking fee in addition to all inbound and outbound shipping charges.")}</li>
          <li>{translate("DiveCore Auto assumes no responsibility for damages or losses that occur during transit once the shipment has left our warehouse.")}</li>
        </ul>
      </section>

      {/* Contact Section */}
      <section>
        <h2 className="text-xl font-semibold mb-2">{translate("Contact")}</h2>
        <ul className="space-y-1">
          <li>
            <strong>{translate("Email:")}</strong>{" "}
            <a href="mailto:support@divecoreauto.com" className="text-blue-600 underline">
              support@divecoreauto.com
            </a>
          </li>
          <li>
            <strong>{translate("Phone:")}</strong> (123) 456-7890
          </li>
          <li>
            <strong>{translate("Website:")}</strong>{" "}
            <a href="https://www.divecoreauto.com" className="text-blue-600 underline">
              www.divecoreauto.com
            </a>
          </li>
        </ul>
        <p className="mt-4 text-sm italic">
          {translate(
            "DiveCore Auto reserves the right to modify or update this warranty policy at any time without prior notice. The most current version is always available on your invoice and on our official website."
          )}
        </p>
      </section>
    </div>
  );
}
