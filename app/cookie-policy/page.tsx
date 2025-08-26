// app/privacy-policy/page.tsx
import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Privacy Policy | DriveCore Auto",
  description:
    "Learn how DriveCore Auto collects, uses, and protects your personal information when you shop for engines, transmissions, swaps, subframes, and accessories.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-5xl mx-auto px-6 mt-20 lg:mt-40 pb-24 text-gray-800">
      {/* Page title (not an <h1> to avoid global.css overrides) */}
      <div
        role="heading"
        aria-level={1}
        className="text-4xl font-bold text-gray-900 mb-8"
      >
        Privacy Policy
      </div>

      <p className="text-sm text-gray-500 mb-10">
        Last updated: <span className="font-medium">[Insert Date]</span>
      </p>

      {/* Intro */}
      <section className="space-y-4 mb-10">
        <p>
          At <span className="font-semibold">DriveCore Auto</span> (“we,” “us,”
          or “our”), your privacy matters. This Privacy Policy explains how we
          collect, use, disclose, and safeguard your information when you visit
          our website or purchase products such as engines, transmissions,
          engine swaps, subframes, and accessories (the “Services”).
        </p>
        <p>
          By using our Services, you agree to the practices described below. If
          you do not agree with this policy, please do not use the website.
        </p>
      </section>

      {/* Table of contents */}
      <nav className="mb-10">
        <ul className="list-disc pl-6 space-y-2 text-sm">
          <li><a href="#info-we-collect" className="underline">Information We Collect</a></li>
          <li><a href="#how-we-use" className="underline">How We Use Your Information</a></li>
          <li><a href="#sharing" className="underline">Sharing Your Information</a></li>
          <li><a href="#security" className="underline">Data Security</a></li>
          <li><a href="#your-rights" className="underline">Your Rights</a></li>
          <li><a href="#retention" className="underline">Data Retention</a></li>
          <li><a href="#third-parties" className="underline">Third-Party Links</a></li>
          <li><a href="#children" className="underline">Children’s Privacy</a></li>
          <li><a href="#changes" className="underline">Changes to This Policy</a></li>
          <li><a href="#contact" className="underline">Contact Us</a></li>
        </ul>
      </nav>

      {/* Sections */}
      <section id="info-we-collect" className="space-y-4 mb-10">
        <div role="heading" aria-level={2} className="text-2xl font-semibold text-gray-900">
          Information We Collect
        </div>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <span className="font-medium">Personal Information</span>: name, email,
            phone number, billing/shipping address, and order details.
          </li>
          <li>
            <span className="font-medium">Payment Information</span>: processed
            securely by third-party processors; we do not store full card data.
          </li>
          <li>
            <span className="font-medium">Technical Data</span>: IP address, device,
            browser type, pages viewed, and usage analytics.
          </li>
          <li>
            <span className="font-medium">Communications</span>: messages, support
            requests, and preferences (e.g., newsletter opt-ins).
          </li>
        </ul>
      </section>

      <section id="how-we-use" className="space-y-4 mb-10">
        <div role="heading" aria-level={2} className="text-2xl font-semibold text-gray-900">
          How We Use Your Information
        </div>
        <ul className="list-disc pl-6 space-y-2">
          <li>Process and fulfill orders (including shipping and delivery updates).</li>
          <li>Provide customer support and handle returns/refunds where applicable.</li>
          <li>Improve site performance, usability, and product offerings.</li>
          <li>Send service communications and, if opted in, marketing emails.</li>
          <li>Detect, prevent, and address fraud or security issues.</li>
        </ul>
      </section>

      <section id="sharing" className="space-y-4 mb-10">
        <div role="heading" aria-level={2} className="text-2xl font-semibold text-gray-900">
          Sharing Your Information
        </div>
        <p>
          We do <span className="font-semibold">not sell</span> your personal data.
          We may share limited information with:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Payment processors, shipping carriers, and IT/analytics vendors.</li>
          <li>Service providers under contract who help us operate our business.</li>
          <li>Law enforcement or authorities when required by law or to protect rights.</li>
        </ul>
      </section>

      <section id="security" className="space-y-4 mb-10">
        <div role="heading" aria-level={2} className="text-2xl font-semibold text-gray-900">
          Data Security
        </div>
        <p>
          We use commercially reasonable administrative, technical, and physical safeguards
          to protect your information. However, no method of transmission over the Internet
          is 100% secure.
        </p>
      </section>

      <section id="your-rights" className="space-y-4 mb-10">
        <div role="heading" aria-level={2} className="text-2xl font-semibold text-gray-900">
          Your Rights
        </div>
        <p>
          Depending on your location, you may have rights to access, correct, delete,
          or restrict processing of your data, and to opt out of marketing. To exercise
          these rights, contact us using the details below.
        </p>
      </section>

      <section id="retention" className="space-y-4 mb-10">
        <div role="heading" aria-level={2} className="text-2xl font-semibold text-gray-900">
          Data Retention
        </div>
        <p>
          We retain personal information only as long as necessary to fulfill the purposes
          described in this policy or as required by law (e.g., tax, accounting, compliance).
        </p>
      </section>

      <section id="third-parties" className="space-y-4 mb-10">
        <div role="heading" aria-level={2} className="text-2xl font-semibold text-gray-900">
          Third-Party Links
        </div>
        <p>
          Our site may contain links to third-party websites. We are not responsible for
          their content or privacy practices. Review their policies before providing data.
        </p>
      </section>

      <section id="children" className="space-y-4 mb-10">
        <div role="heading" aria-level={2} className="text-2xl font-semibold text-gray-900">
          Children’s Privacy
        </div>
        <p>
          Our Services are not directed to children under 13, and we do not knowingly
          collect personal information from children.
        </p>
      </section>

      <section id="changes" className="space-y-4 mb-10">
        <div role="heading" aria-level={2} className="text-2xl font-semibold text-gray-900">
          Changes to This Policy
        </div>
        <p>
          We may update this Privacy Policy periodically. We’ll post any changes on this
          page and update the “Last updated” date above.
        </p>
      </section>

      
    </main>
  );
}
