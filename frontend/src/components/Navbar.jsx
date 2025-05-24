"use client"
import { FileVideo, VideoIcon } from 'lucide-react'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [userType, setUserType] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Check authentication status when component mounts
        const token = localStorage.getItem('token');
        const storedUserType = localStorage.getItem('userType');
        
        if (token && storedUserType) {
            setIsLoggedIn(true);
            setUserType(storedUserType);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
        setIsLoggedIn(false);
        setUserType(null);
        window.location.href = '/';
    };

    const getProfileLink = () => {
        switch(userType) {
            case 'ngo':
                return '/ngo/profile';
            case 'socialworker':
                return '/social-worker/profile';
            case 'admin':
                return '/admin/profile';
            default:
                return '/user/profile';
        }
    };

    return (
        <header className="z-50 w-full py-8 bg-white dark:bg-neutral-900 shadow-md dark:shadow-neutral-800">
            <nav className="max-w-7xl mx-auto flex flex-wrap items-center justify-between px-4 md:px-8">
                {/* Logo and Brand */}
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 flex-shrink-0">
                        <img src="/SAHYOGI LOGO.gif" alt="Logo" className="w-full h-full object-contain" />
                    </div>
                    <Link
                        className="text-2xl sm:text-3xl font-semibold focus:outline-none"
                        href="/"
                        aria-label="Sahyogi Home"
                    >
                        SAHYOGI
                    </Link>
                </div>

                {/* Hamburger for mobile */}
                <button
                    className="lg:hidden p-2 rounded-xl border border-gray-200 text-black hover:bg-gray-100 focus:outline-none dark:text-white dark:border-neutral-700 dark:hover:bg-neutral-700"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle navigation"
                >
                    {menuOpen ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <line x1={3} x2={21} y1={6} y2={6} />
                            <line x1={3} x2={21} y1={12} y2={12} />
                            <line x1={3} x2={21} y1={18} y2={18} />
                        </svg>
                    )}
                </button>

                {/* Desktop Nav Links */}
                <div className="hidden lg:flex flex-1 items-center justify-center gap-x-7">
                    <Link className="text-black text-lg hover:text-gray-600 dark:text-black dark:hover:text-neutral-300" href="/explore">Explore</Link>
                    <Link className="text-black text-lg hover:text-gray-600 dark:text-black dark:hover:text-neutral-300" href="/about">About</Link>
                    <Link className="text-black text-lg hover:text-gray-600 dark:text-black dark:hover:text-neutral-300" href="/contact">Contact</Link>
                    <Link className="text-black text-lg hover:text-gray-600 dark:text-black dark:hover:text-neutral-300" href="/feedback">Feedback</Link>
                </div>

                {/* Desktop Button Group */}
                <div className="hidden lg:flex items-center gap-x-2">
                    {!isLoggedIn ? (
                        <>
                            <Link
                                href="/signup"
                                className="py-2 px-3 text-lg font-medium rounded-xl bg-lime-400 border border-lime-500 text-black hover:bg-lime-500 focus:outline-none"
                            >
                                Register
                            </Link>
                            <Link
                                href="/login"
                                className="py-2 px-3 text-lg font-medium rounded-xl bg-lime-400 text-black hover:bg-lime-500 focus:outline-none"
                            >
                                Login
                            </Link>
                            <Link
                                href="/define"
                                className="py-2 px-3 text-lg font-medium rounded-xl bg-lime-400 text-black hover:bg-lime-500 focus:outline-none"
                            >
                                Become a Sahyogi
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link
                                href={getProfileLink()}
                                className="py-2 px-3 text-lg font-medium rounded-xl bg-lime-400 text-black hover:bg-lime-500 focus:outline-none"
                            >
                                Profile
                            </Link>
                            {userType === 'ngo' && (
                                <Link
                                    href="/ngo/add-post"
                                    className="py-2 px-3 text-lg font-medium rounded-xl bg-lime-400 text-black hover:bg-lime-500 focus:outline-none"
                                >
                                    Add Post
                                </Link>
                            )}
                            {userType === 'socialworker' && (
                                <Link
                                    href="/social-worker/add-post"
                                    className="py-2 px-3 text-lg font-medium rounded-xl bg-lime-400 text-black hover:bg-lime-500 focus:outline-none"
                                >
                                    Add Post
                                </Link>
                            )}
                            {userType === 'admin' && (
                                <Link
                                    href="/admin/dashboard"
                                    className="py-2 px-3 text-lg font-medium rounded-xl bg-lime-400 text-black hover:bg-lime-500 focus:outline-none"
                                >
                                    Dashboard
                                </Link>
                            )}
                            <button
                                onClick={handleLogout}
                                className="py-2 px-3 text-lg font-medium rounded-xl bg-red-400 text-black hover:bg-red-500 focus:outline-none"
                            >
                                Logout
                            </button>
                        </>
                    )}
                </div>

                {/* Mobile Menu */}
                {menuOpen && (
                    <div className="w-full mt-4 flex flex-col gap-4 lg:hidden animate-fade-in">
                        <div className="flex flex-col gap-2">
                            <Link className="text-black text-lg hover:text-gray-600 dark:text-black dark:hover:text-neutral-300" href="/explore" onClick={() => setMenuOpen(false)}>Explore</Link>
                            <Link className="text-black text-lg hover:text-gray-600 dark:text-black dark:hover:text-neutral-300" href="/about" onClick={() => setMenuOpen(false)}>About</Link>
                            <Link className="text-black text-lg hover:text-gray-600 dark:text-black dark:hover:text-neutral-300" href="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
                            <Link className="text-black text-lg hover:text-gray-600 dark:text-black dark:hover:text-neutral-300" href="/feedback" onClick={() => setMenuOpen(false)}>Feedback</Link>
                        </div>
                        <div className="flex flex-col gap-2 mt-2">
                            {!isLoggedIn ? (
                                <>
                                    <Link
                                        href="/signup"
                                        className="py-2 px-3 text-lg font-medium rounded-xl bg-lime-400 border border-lime-500 text-black hover:bg-lime-500 focus:outline-none"
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        Register
                                    </Link>
                                    <Link
                                        href="/login"
                                        className="py-2 px-3 text-lg font-medium rounded-xl bg-lime-400 text-black hover:bg-lime-500 focus:outline-none"
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href="/define"
                                        className="py-2 px-3 text-lg font-medium rounded-xl bg-lime-400 text-black hover:bg-lime-500 focus:outline-none"
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        Become a Sahyogi
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href={getProfileLink()}
                                        className="py-2 px-3 text-lg font-medium rounded-xl bg-lime-400 text-black hover:bg-lime-500 focus:outline-none"
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        Profile
                                    </Link>
                                    {userType === 'ngo' && (
                                        <Link
                                            href="/ngo/add-post"
                                            className="py-2 px-3 text-lg font-medium rounded-xl bg-lime-400 text-black hover:bg-lime-500 focus:outline-none"
                                            onClick={() => setMenuOpen(false)}
                                        >
                                            Add Post
                                        </Link>
                                    )}
                                    {userType === 'socialworker' && (
                                        <Link
                                            href="/social-worker/add-post"
                                            className="py-2 px-3 text-lg font-medium rounded-xl bg-lime-400 text-black hover:bg-lime-500 focus:outline-none"
                                            onClick={() => setMenuOpen(false)}
                                        >
                                            Add Post
                                        </Link>
                                    )}
                                    {userType === 'admin' && (
                                        <Link
                                            href="/admin/dashboard"
                                            className="py-2 px-3 text-lg font-medium rounded-xl bg-lime-400 text-black hover:bg-lime-500 focus:outline-none"
                                            onClick={() => setMenuOpen(false)}
                                        >
                                            Dashboard
                                        </Link>
                                    )}
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setMenuOpen(false);
                                        }}
                                        className="py-2 px-3 text-lg font-medium rounded-xl bg-red-400 text-black hover:bg-red-500 focus:outline-none"
                                    >
                                        Logout
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </nav>
        </header>
    )
}

export default Navbar