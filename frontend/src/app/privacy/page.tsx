'use client';

import React from 'react';
import Navbar from '@/components/Navbar';

const PrivacyPolicy = () => {
  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-4">Last updated: April 14, 2025</p>
        <p>UoMe (“we”, “our”, “us”) respects your privacy. This Privacy Policy explains what information we collect, how we use it, and the choices you have when using <a href="https://uome.tech" className="text-blue-500 hover:underline">https://uome.tech</a> (“the Service”).</p>
        <ol className="list-decimal ml-6 mt-4 space-y-4">
          <li>
            <strong>What We Collect</strong>
            <p>To provide the core functionality of UoMe, we collect and store data you actively input into the app, such as:</p>
            <ul className="list-disc ml-6 mt-2 space-y-2">
              <li>Group names</li>
              <li>Participant names or nicknames</li>
              <li>Expense details (e.g., amounts, descriptions, payers, and debt splits)</li>
              <li>Timestamps related to expenses or activity</li>
              <li>Any other information you choose to enter into the app</li>
            </ul>
          </li>
          <li>
            <strong>How We Use Your Data</strong>
            <p>We only use your data to:</p>
            <ul className="list-disc ml-6 mt-2 space-y-2">
              <li>Provide and maintain the core features of the app</li>
              <li>Store and retrieve group and expense information</li>
              <li>Improve the app based on aggregate usage patterns (if analytics are used—see below)</li>
            </ul>
            <p>We do not use your data for marketing, profiling, or advertising.</p>
          </li>
          <li>
            <strong>Where Your Data Is Stored</strong>
            <p>Depending on how you use the app, your data may be stored:</p>
            <ul className="list-disc ml-6 mt-2 space-y-2">
              <li>Locally in your browser using localStorage or IndexedDB</li>
              <li>In our backend servers (if applicable) to persist group data or allow sharing between devices</li>
            </ul>
            <p>If data is stored on a server, we aim to keep it minimal, secure, and only for the purpose of delivering the app’s core features.</p>
          </li>
          <li>
            <strong>Analytics</strong>
            <p>We may use privacy-friendly analytics tools (such as Plausible or Umami) to understand general usage trends. These tools do not track individual users and do not collect personal information.</p>
          </li>
          <li>
            <strong>Data Sharing</strong>
            <p>We do not sell, rent, or share your data with third parties. Your data is only used for the operation of the app and is never shared for commercial purposes.</p>
          </li>
          <li>
            <strong>Security</strong>
            <p>We take reasonable technical and organizational measures to protect your data. However, no system is 100% secure. Please use UoMe responsibly and avoid inputting any sensitive information into the app.</p>
          </li>
          <li>
            <strong>Your Rights</strong>
            <p>If your data is stored on our backend (e.g. to support group sharing), you may have the right to:</p>
            <ul className="list-disc ml-6 mt-2 space-y-2">
              <li>Request deletion of your data</li>
              <li>Request a copy of your stored data</li>
            </ul>
            <p>Contact us using the information below to make a request.</p>
          </li>
          <li>
            <strong>Changes to This Policy</strong>
            <p>We may update this Privacy Policy from time to time. The latest version will always be available at uome.tech. Continued use of the Service after changes means you accept the updated policy.</p>
          </li>
          <li>
            <strong>Contact</strong>
            <p>For any privacy-related questions, requests, or concerns, please reach out via our GitHub repository or the contact information provided on the website.</p>
          </li>
        </ol>
      </div>
    </>
  );
};

export default PrivacyPolicy;
