"use client";

import SidebarLayout from "@/Components/SidebarLayout";

const AccessibilityPage = () => {
  return (
    <SidebarLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Accessibility</h1>
          <p className="text-gray-600 mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Commitment</h2>
              <p className="text-gray-600 leading-relaxed">
                Staycation Haven is committed to providing an accessible website for all users, including those with disabilities. We follow WCAG 2.1 guidelines and continuously improve our digital accessibility.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Accessibility Features</h2>
              <p className="text-gray-600 leading-relaxed">
                Our website includes keyboard navigation, screen reader compatibility, high contrast colors, and responsive design for mobile devices.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Technical Standards</h2>
              <p className="text-gray-600 leading-relaxed">
                We use semantic HTML5, ARIA labels, and proper heading structure to ensure our content is accessible to assistive technologies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Getting Help</h2>
              <p className="text-gray-600 leading-relaxed">
                If you encounter any accessibility barriers while using our website, please contact our support team at accessibility@staycationhaven.ph
              </p>
            </section>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default AccessibilityPage;
