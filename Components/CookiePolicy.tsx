"use client";

import SidebarLayout from "@/Components/SidebarLayout";

const CookiePolicyPage = () => {
  return (
    <SidebarLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Cookie Policy</h1>
          <p className="text-gray-600 mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">What Are Cookies</h2>
              <p className="text-gray-600 leading-relaxed">
                Cookies are small text files that websites store on your device to remember your preferences and improve your browsing experience.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">How We Use Cookies</h2>
              <p className="text-gray-600 leading-relaxed">
                We use cookies for authentication, session management, analytics, and personalization. They help us understand user behavior and improve our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Types of Cookies We Use</h2>
              <p className="text-gray-600 leading-relaxed">
                We use essential cookies for site functionality and analytical cookies to understand user behavior. All cookies are used in accordance with privacy regulations.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Managing Your Cookie Preferences</h2>
              <p className="text-gray-600 leading-relaxed">
                You can control cookies through your browser settings. Most browsers allow you to block or delete cookies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Third-Party Cookies</h2>
              <p className="text-gray-600 leading-relaxed">
                We may use third-party services that set cookies for analytics and advertising. These are governed by their respective privacy policies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-600 leading-relaxed">
                For questions about our cookie policy, contact our Data Protection Officer at privacy@staycationhaven.ph
              </p>
            </section>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default CookiePolicyPage;
