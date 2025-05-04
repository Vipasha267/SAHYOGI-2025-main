import Link from 'next/link'
import React from 'react'

const Home = () => {
  return (
    <div>
       <>
          {/* Hero */}
          <div className="relative overflow-hidden">
            {/* Gradients */}
            <div
              aria-hidden="true"
              className="flex absolute -top-96 start-1/2 transform -translate-x-1/2"
            >
              <div className="bg-linear-to-r from-lime-700/50 to-lime-700 blur-3xl w-100 h-175 rotate-[-60deg] transform -translate-x-40 dark:from-lime-500/50 dark:to-lime-900" />
              <div className="bg-linear-to-tl from-lime-700 via-lime-700 to-lime-500 blur-3xl w-[1440px] h-200 rounded-fulls origin-top-left -rotate-12 -translate-x-60 dark:from-lime-900/70 dark:via-lime-900/70 dark:to-lime-900/70" />
            </div>
            {/* End Gradients */}
            <div className="relative z-10">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
                <div className="text-center mx-auto">
                  <p className="inline-block text-sm font-medium bg-clip-text bg-linear-to-l from-black-700 to-black-700 text-black dark:from-black-700 dark:to-black-700">
                  </p>
                  <div className="flex flex-wrap md:-m-2 -m-1">
                    <div className="flex flex-wrap w-1/2">
                      <div className="md:p-2 p-1 w-1/2">
                        <img
                          alt="gallery"
                          className="w-full object-cover h-full object-center block rounded-lg"
                          src="https://cdn.cdnparenting.com/articles/2023/08/21141904/Essay-On-Old-Age-Home.webp"
                        />
                      </div>
                      <div className="md:p-2 p-1 w-1/2">
                        <img
                          alt="gallery"
                          className="w-full object-cover h-full object-center block rounded-lg"
                          src="https://idsb.tmgrup.com.tr/ly/uploads/images/2020/12/07/77440.jpg"
                        />
                      </div>
                      <div className="md:p-2 p-1 w-full">
                        <img
                          alt="gallery"
                          className="w-full h-full object-cover object-center block rounded-lg"
                          src="https://yale-threesixty.transforms.svdcdn.com/production/IndiaDehli_Trees_GettyImages-984331388_web.jpg?w=1500&h=1500&q=80&auto=format&fit=clip&dm=1740245307&s=b94f0001e88f55054b5887e944d92d37"
                        />
                      </div>
                    </div>
                    <div className="flex flex-wrap w-1/2">
                      <div className="md:p-2 p-1 w-full">
                        <img
                          alt="gallery"
                          className="w-full h-full object-cover object-center block rounded-lg"
                          src="https://www.smilefoundationindia.org/blog/wp-content/uploads/2022/11/142875012_4213934451963824_4908626115809418460_o-1024x768.jpg"
                        />
                      </div>
                      <div className="md:p-2 p-1 w-1/2">
                        <img
                          alt="gallery"
                          className="w-full object-cover h-full object-center block rounded-lg"
                          src="https://media.istockphoto.com/id/1273504606/photo/indian-woman-holding-her-baby-in-her-arms.jpg?s=612x612&w=0&k=20&c=KEqOos5ffgaFQ-iTR4Lp0MCetzj8AuJF7QHhdwm_j_M="
                        />
                      </div>
                      <div className="md:p-2 p-1 w-1/2">
                        <img
                          alt="gallery"
                          className="w-full object-cover h-full object-center block rounded-lg"
                          src="https://static.toiimg.com/thumb/msid-118857512,width-400,height-225,resizemode-72/118857512.jpg"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Title */}
                  <div className="mt-5 max-w-2xl">
                    <h1 className="block font-semibold text-black-800 text-4xl md:text-5xl lg:text-6xl dark:text-neutral-200">

                    </h1>
                  </div>
                  {/* End Title */}
                  <div className="mt-5 max-w-3xl">
                    <p className="text-lg text-black">
                      A helping hand towards our unsung Social workers.Will mold and consolidate our tomorrow by
                      working in present, helping each other makes us social and working together to help each other makes us
                      social workers.
                    </p>
                  </div>
                  {/* Buttons */}
                  <div className="mt-8 gap-3 flex justify-center">
                    <a
                      className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-lime-500 text-black hover:bg-lime-700 focus:outline-hidden focus:bg-lime-700 disabled:opacity-50 disabled:pointer-events-none"
                      href="#"
                    >
                      Get started
                      <svg
                        className="shrink-0 size-4"
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </a>
                    <a
                      className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                      href="#"
                    >


                    </a>
                  </div>
                  {/* End Buttons */}
                </div>
              </div>
            </div>
          </div>
          {/* End Hero */}
        </>
    </div>
  )
}

export default Home