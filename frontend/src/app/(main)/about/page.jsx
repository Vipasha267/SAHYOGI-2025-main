import React from 'react'

const About = () => {
  return (
    <div>
      <>
  <meta charSet="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <div className="bg-white">
    <header className="bg-lime-500 text-black text-center py-12">
      <h1 className="text-4xl font-bold mt-16">About Us</h1>
    </header>
    <div className="container mx-auto mt-10">
      <div className="grid grid-cols-2">
        <section className="text-center py-12 px-4">
          <h2 className="text-2xl font-bold">Our Mission</h2>
          <p className="mt-4 text-gray-700 max-w-2xl mx-auto">
            our mission is to help mold and consolidate the tomorrow by starting
            today.
          </p>
          <img
            src="https://img.freepik.com/free-vector/social-team-helping-charity-sharing-hope_74855-6660.jpg"
            alt=""
          />
        </section>
        <section className="bg-lime-500 text-black py-12 px-4">
          <h2 className="text-2xl font-bold text-center">Our Vision</h2>
          <p className="mt-4 text-center max-w-2xl mx-auto">
            To give Sahyog to Sahyogi, give help to helpers.
          </p>
        </section>
      </div>
      <section className="text-center py-12 px-4">
        <h2 className="text-2xl font-bold">social working</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mt-8">
          <div className="p-4 shadow-lg rounded-lg bg-green-100 hover:bg-green-200 transition-colors">
            <h3 className="text-xl font-bold">Old age people</h3>
          </div>
          <div className="p-4 shadow-lg rounded-lg bg-green-100 hover:bg-green-200 transition-colors">
            <h3 className="text-xl font-bold">Stray animals</h3>
          </div>
          <div className="p-4 shadow-lg rounded-lg bg-green-100 hover:bg-green-200 transition-colors">
            <h3 className="text-xl font-bold">Poor people</h3>
          </div>
          <div className="p-4 shadow-lg rounded-lg bg-green-100 hover:bg-green-200 transition-colors">
            <h3 className="text-xl font-bold">orphanage children</h3>
          </div>
        </div>
      </section>
      <section className="text-center py-12 px-4">
        <h2 className="text-2xl font-bold">
          committed to our responsibilities
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mt-8">
          <div className="p-4 shadow-lg rounded-lg bg-green-100 hover:bg-green-200 transition-colors">
            <h3 className="text-xl font-bold">provide help</h3>
          </div>
          <div className="p-4 shadow-lg rounded-lg bg-green-100 hover:bg-green-200 transition-colors">
            <h3 className="text-xl font-bold">Informed Staff</h3>
          </div>
          <div className="p-4 shadow-lg rounded-lg bg-green-100 hover:bg-green-200 transition-colors">
            <h3 className="text-xl font-bold">Total security</h3>
          </div>
          <div className="p-4 shadow-lg rounded-lg bg-green-100 hover:bg-green-200 transition-colors">
            <h3 className="text-xl font-bold">social awareness</h3>
          </div>
        </div>
      </section>
    </div>
  </div>
  <footer className="bg-lime-500 text-black text-center py-8">
    <p>© Copyright [SAHYOGI] . All rights reserved. Made with love</p>
  </footer>
</>

    </div>
  )
}

export default About;