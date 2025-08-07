"use client";

import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "What is an engine code and why is it important?",
    answer:
      "An engine code uniquely identifies the specifications of an engine model. It helps with finding compatible parts and understanding performance.",
  },
  {
    question: "How do I find my engine code?",
    answer:
      "The engine code is usually found stamped on the engine block or in your vehicle’s documentation.",
  },
  {
    question: "Can I use parts from a different engine code?",
    answer:
      "It depends. Some parts are interchangeable, but many are specific to the engine code. Always verify compatibility before purchasing.",
  },
  {
    question: "How often should I service my engine?",
    answer:
      "Regular maintenance varies by engine type and usage but typically every 5,000 to 10,000 miles.",
  },
  {
    question: "Do you ship worldwide?",
    answer: "Yes, we ship to most countries with reliable courier options.",
  },
    {
        question: "What is your return policy?",
        answer:
        "We accept returns within 30 days of purchase, provided the item is in its original condition and packaging.",
    },
    {
        question: "How can I contact customer support?",
        answer:
        "You can reach our customer support via email at support@drivecoreauto.com or call us at +1-800-555-0199 during business hours. We are here to help you with any inquiries or issues you may have.  Expect a response within 24-48 hours.",
    },



];

export default function FAQs() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function toggleFAQ(index: number) {
    setOpenIndex(openIndex === index ? null : index);
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-10 mt-40">
      <h1 className="text-3xl font-bold mb-8 text-center mt-10">Frequently Asked Questions</h1>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-300 rounded shadow-sm"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full text-left px-6 py-4 flex justify-between items-center text-lg font-medium focus:outline-none"
            >
              <span>{faq.question}</span>
              <svg
                className={`w-6 h-6 transition-transform duration-300 ${
                  openIndex === index ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openIndex === index && (
              <div className="px-6 pb-4 text-gray-700">{faq.answer}</div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
