"use client";

import React from 'react';
import Navbar from '@/components/Navbar';

const TermsOfService = () => {
  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Terms of Service</h1>
        <p className="text-sm text-gray-500 mb-4">Last updated: April 14, 2025</p>
        <p>Welcome to UoMe!</p>
        <p className="mt-4">By using uome.tech or any part of the UoMe project, you agree to these Terms of Service ("Terms"). Please read them carefully. If you do not agree, do not use our service.</p>
        <ol className="list-decimal ml-6 mt-4 space-y-4">
          <li>
            <strong>What is UoMe?</strong>
            <p>UoMe is a simple web application to track shared expenses and debts between friends. It is open source and freely available at <a href="https://github.com/JeronimoMendes/UoMe" className="text-blue-500 hover:underline">https://github.com/JeronimoMendes/UoMe</a>.</p>
          </li>
          <li>
            <strong>Your Responsibilities</strong>
            <p>You are responsible for the accuracy of the data you enter (e.g., amounts, names, and payment details).</p>
            <p>You agree not to use UoMe for any unlawful, harmful, or abusive activities.</p>
            <p>UoMe is not a payment platform and does not handle money transfers. It is only a tracking tool.</p>
          </li>
          <li>
            <strong>No Guarantees</strong>
            <p>UoMe is provided "as is" with no warranties.</p>
            <p>We do not guarantee the availability, security, or accuracy of the service at all times.</p>
            <p>Your data may be lost or unavailable at any time. Please use it at your own risk.</p>
          </li>
          <li>
            <strong>Privacy</strong>
            <p>Refer to our <a href="/privacy" className="text-blue-500 hover:underline">Privacy Policy</a> for more information.</p>
          </li>
          <li>
            <strong>Intellectual Property</strong>
            <p>UoMe is open source under the MIT License.</p>
            <p>You may use, copy, modify, and distribute it according to the terms of the license.</p>
          </li>
          <li>
            <strong>Changes to These Terms</strong>
            <p>We may update these Terms from time to time. Continued use of the service after changes means you agree to the updated Terms.</p>
          </li>
          <li>
            <strong>Contact</strong>
            <p>Have questions or found a bug? Feel free to reach out via GitHub Issues or contact us through the project page.</p>
          </li>
        </ol>
      </div>
    </>
  );
};

export default TermsOfService;
