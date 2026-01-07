import React from 'react';

export const Impressum = () => {
  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-serif text-stone-800 mb-8">Impressum</h1>
      
      <div className="space-y-6 text-stone-600">
        <section>
          <h2 className="text-xl font-bold text-stone-800 mb-2">Company Information</h2>
          <p><strong>Company Name:</strong> [Your Company Name j.d.o.o./Obrt]</p>
          <p><strong>Address:</strong> [Your Address]</p>
          <p><strong>City:</strong> [City, Zip Code]</p>
          <p><strong>Country:</strong> Croatia</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-stone-800 mb-2">Contact</h2>
          <p><strong>Email:</strong> [Your Email]</p>
          <p><strong>Phone:</strong> [Your Phone]</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-stone-800 mb-2">Registration Details</h2>
          <p><strong>MBS:</strong> [Your MBS Number]</p>
          <p><strong>OIB:</strong> [Your OIB Number]</p>
          <p><strong>Court of Registration:</strong> Trgovački sud u [City]</p>
          <p><strong>Director:</strong> [Director Name]</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-stone-800 mb-2">Online Dispute Resolution</h2>
          <p>
            The European Commission provides a platform for online dispute resolution (OS): 
            <a href="http://ec.europa.eu/consumers/odr" className="text-amber-600 hover:underline ml-1" target="_blank" rel="noopener noreferrer">
              http://ec.europa.eu/consumers/odr
            </a>
          </p>
        </section>
      </div>
    </div>
  );
};

export default Impressum;
