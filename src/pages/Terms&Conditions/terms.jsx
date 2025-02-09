import React from 'react';

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-white">
      

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-3xl font-bold mb-8">Terms and Conditions of O.N.S Clothing</h1>

        <section className="mb-8">
          <p className="text-gray-600 mb-4">These Terms govern:</p>
          <ul className="list-disc ml-6 mb-4 text-gray-600">
            <li className="mb-2">the use of this Application, and,</li>
            <li className="mb-2">any other related Agreement or legal relationship with the Owner</li>
          </ul>
          <p className="text-gray-600 mb-4">
            in a legally binding way. Capitalized words are defined in the relevant dedicated section of this document.
          </p>
          <p className="text-gray-600 font-medium mb-8">
            The User must read this document carefully.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Information about this Application</h2>
          <div className="mb-6">
            <p className="text-gray-600 mb-2">This Application is provided by:</p>
            <div className="ml-4">
              <p className="font-medium">O.N.S Clothing</p>
              <p className="text-gray-600">201 Mulberry St, New York, NY 10012, US</p>
            </div>
          </div>
          <div className="mb-6">
            <p className="text-gray-600 mb-2">Owner contact email:</p>
            <p className="text-blue-600 hover:underline">
              <a href="mailto:support@onsclothing.com">support@onsclothing.com</a>
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Mobile Terms of Service</h2>
          <a 
            href="https://ons-clothing.com/pages/terms-of-service" 
            className="text-blue-600 hover:underline"
          >
            https://ons-clothing.com/pages/terms-of-service
          </a>
        </section>

        
      </main>
    </div>
  );
};

export default TermsAndConditions;