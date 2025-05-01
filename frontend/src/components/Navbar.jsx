import { FileVideo, VideoIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'


const Navbar = () => {
    return (
        <div>
            <header className="flex flex-wrap lg:justify-start lg:flex-nowrap z-50 w-full py-7 bg-white dark:bg-neutral-900 shadow-md dark:shadow-neutral-800">
                <nav className="relative max-w-7xl w-full flex flex-wrap lg:grid lg:grid-cols-12 basis-full items-center px-4 md:px-8 lg:px-8 mx-auto">
                    <div className="lg:col-span-3 items-center flex ">
                        {/* Logo */}
                        <div className="size-14">
                            <img src="./SAHYOGI LOGO.gif" alt="Logo"  />
                            
                            </div>

                        <Link
                            className="flex-none rounded-xl text-3xl inline-block font-semibold focus:outline-hidden focus:opacity-80"
                            href="/"
                            aria-label="Preline"
                    

                        >
                            <h1>SAHYOGI</h1>
                            
                        </Link>
                        {/* End Logo */}
                        <div className="ms-1 sm:ms-2"></div>
                    </div>
                    {/* Button Group */}
                    <div className="flex items-center gap-x-1 lg:gap-x-2 ms-auto py-2 lg:ps-6 lg:order-3 lg:col-span-3">
                        <Link
                            href="/signup"
                            className="py-2 px-3 inline-flex items-center gap-x-2 text-lg font-medium text-nowrap rounded-xl bg-lime-400 border border-lime-500 text-black  hover:bg-lime-500 focus:outline-hidden focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:hover:bg-green/10 dark:text-black dark:hover:text-black dark:focus:text-green-700"
                        >
                            Register to Sahyogi
                        </Link>
                        <Link
                            href="/login"
                            className="py-2 px-3 inline-flex items-center gap-x-2 text-lg font-medium text-nowrap rounded-xl border border-transparent bg-lime-400 text-black hover:bg-lime-500 focus:outline-hidden focus:bg-lime-500 transition disabled:opacity-50 disabled:pointer-events-none"
                        >
                            Login to Sahyogi
                        </Link>
                        <div className="lg:hidden">
                            <button
                                type="button"
                                className="hs-collapse-toggle size-9.5 flex justify-center items-center text-lg font-semibold rounded-xl border border-gray-200 text-black hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:border-neutral-700 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                                id="hs-navbar-hcail-collapse"
                                aria-expanded="false"
                                aria-controls="hs-navbar-hcail"
                                aria-label="Toggle navigation"
                                data-hs-collapse="#hs-navbar-hcail"
                            >
                                <svg
                                    className="hs-collapse-open:hidden shrink-0 size-4"
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
                                    <line x1={3} x2={21} y1={6} y2={6} />
                                    <line x1={3} x2={21} y1={12} y2={12} />
                                    <line x1={3} x2={21} y1={18} y2={18} />
                                </svg>
                                <svg
                                    className="hs-collapse-open:block hidden shrink-0 size-4"
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
                                    <path d="M18 6 6 18" />
                                    <path d="m6 6 12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    {/* End Button Group */}
                    {/* Collapse */}
                    <div
                        id="hs-navbar-hcail"
                        className="hs-collapse hidden overflow-hidden transition-all duration-300 basis-full grow lg:block lg:w-auto lg:basis-auto lg:order-2 lg:col-span-6"
                        aria-labelledby="hs-navbar-hcail-collapse"
                    >
                        <div className="flex flex-col gap-y-4 gap-x-0 mt-5 lg:flex-row lg:justify-center lg:items-center lg:gap-y-0 lg:gap-x-7 lg:mt-0">
                            <div>
                                <Link
                                    className="relative inline-block text-black text-lg focus:outline-hidden before:absolute before:bottom-0.5 before:start-0 before:-z-1 before:w-full before:h-1 before:bg-lime-400 dark:text-black"
                                    href="#"
                                    aria-current="page"
                                >
                                    Work
                                </Link>
                            </div>
                            <div>
                                <Link
                                    className="inline-block text-black text-lg hover:text-gray-600 focus:outline-hidden focus:text-gray-600 dark:text-black dark:hover:text-neutral-300 dark:focus:text-neutral-300"
                                    href="/explore"
                                >
                                    Explore
                                </Link>
                            </div>
                            <div>
                                <Link
                                    className="inline-block text-black text-lg hover:text-gray-600 focus:outline-hidden focus:text-gray-600 dark:text-black dark:hover:text-neutral-300 dark:focus:text-neutral-300"
                                    href="/about"
                                >
                                    About Us
                                </Link>
                            </div>
                            <div>
                                <Link
                                    className="inline-block text-black text-lg hover:text-gray-600 focus:outline-hidden focus:text-gray-600 dark:text-black dark:hover:text-neutral-300 dark:focus:text-neutral-300"
                                    href="/contact"
                                >
                                    Contact
                                </Link>
                            </div>
                            <div>
                                <Link
                                    className="inline-block text-black text-lg hover:text-gray-600 focus:outline-hidden focus:text-gray-600 dark:text-black dark:hover:text-neutral-300 dark:focus:text-neutral-300"
                                    href="/awareness"
                                >
                                    Awareness
                                </Link>
                            </div>
                            <div>
                                <Link
                                    className="inline-block text-black text-lg hover:text-gray-600 focus:outline-hidden focus:text-gray-600 dark:text-black dark:hover:text-neutral-300 dark:focus:text-neutral-300"
                                    href="/feedback"
                                >
                                Feedback
                                </Link>
                            </div>
                        </div>
                    </div>
                    {/* End Collapse */}
                </nav>
            </header>
        </div>
    )
}

export default Navbar