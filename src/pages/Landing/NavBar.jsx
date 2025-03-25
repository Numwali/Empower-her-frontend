import { Button } from 'bootstrap'
import React from 'react'
import { useState, useEffect } from "react"
import { Link } from 'react-router-dom'
import { Link as ScrollLink } from 'react-scroll';

const NavBar = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 5) {
                setIsScrolled(true)
            } else {
                setIsScrolled(false)
            }
        }

        window.addEventListener("scroll", handleScroll)
        return () => {
            window.removeEventListener("scroll", handleScroll)
        }
    }, [])

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full ${isScrolled ? "bg-white shadow-md py-3" : "md:bg-white bg-transparent py-3 md:py-6"
                }`}
        >
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link to="/" className="flex items-center">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-Secondary rounded-full flex items-center justify-center mr-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 md:h-6 md:w-6 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                />
                            </svg>
                        </div>
                        <span className={`font-bold text-lg md:text-xl text-primary`}>EmpowerHer</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <ScrollLink
                            to="/"
                            spy={true}
                            smooth={true}
                            offset={-70}
                            duration={500}
                            className="text-sm font-medium hover:text-Secondary transition-colors text-primary cursor-pointer"
                        >
                            Home
                        </ScrollLink>
                        <ScrollLink
                            to="About-us"
                            spy={true}
                            smooth={true}
                            offset={-70}
                            duration={500}
                            className="text-sm font-medium hover:text-Secondary transition-colors text-primary cursor-pointer"
                        >
                            About
                        </ScrollLink>
                        <ScrollLink
                            to="How-It-Works"
                            spy={true}
                            smooth={true}
                            offset={-70}
                            duration={500}
                            className="text-sm font-medium hover:text-Secondary transition-colors text-primary cursor-pointer"
                        >
                            How It Works
                        </ScrollLink>
                        <ScrollLink
                            to="Stories"
                            spy={true}
                            smooth={true}
                            offset={-70}
                            duration={500}
                            className="text-sm font-medium hover:text-Secondary transition-colors text-primary cursor-pointer"
                        >
                            Stories
                        </ScrollLink>
                    </nav>

                    {/* Auth Buttons */}
                    <div className="hidden md:flex items-center space-x-4">
                        <button
                            className="text-sm border font-black border-primary text-primary hover:bg-primary hover:text-white p-2"
                        >
                            <Link to={'/login'} className='hover:text-white'> Log In</Link>
                        </button>
                        <button className="bg-Secondary hover:bg-primary hover:text-white text-white text-sm p-2">
                            <Link to={'/register'} className='text-white'> Join Now</Link>
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button className="md:hidden" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
                        {!isOpen ? (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 md:h-6 md:w-6 text-primary"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 md:h-6 md:w-6 text-primary"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white shadow-lg max-w-full overflow-hidden">
                    <div className="container mx-auto px-4 py-4">
                        <nav className="flex flex-col space-y-4">
                            <ScrollLink
                                to="/"
                                spy={true}
                                smooth={true}
                                offset={-70}
                                duration={500}
                                className="text-primary hover:text-Secondary transition-colors text-sm font-medium cursor-pointer"
                                onClick={() => setIsOpen(false)}
                            >
                                Home
                            </ScrollLink>
                            <ScrollLink
                                to="About-us"
                                spy={true}
                                smooth={true}
                                offset={-70}
                                duration={500}
                                className="text-primary hover:text-Secondary transition-colors text-sm font-medium cursor-pointer"
                                onClick={() => setIsOpen(false)}
                            >
                                About
                            </ScrollLink>
                            <ScrollLink
                                to="How-It-Works"
                                spy={true}
                                smooth={true}
                                offset={-70}
                                duration={500}
                                className="text-primary hover:text-Secondary transition-colors text-sm font-medium cursor-pointer"
                                onClick={() => setIsOpen(false)}
                            >
                                How it Works
                            </ScrollLink>
                            <ScrollLink
                                to="Stories"
                                spy={true}
                                smooth={true}
                                offset={-70}
                                duration={500}
                                className="text-primary hover:text-Secondary transition-colors text-sm font-medium cursor-pointer"
                                onClick={() => setIsOpen(false)}
                            >
                                Stories
                            </ScrollLink>
                            <div className="pt-4 flex flex-col space-y-2">
                                <Link to="/login" className="border border-primary text-primary w-full p-2 text-center">
                                    Log In
                                </Link>
                                <Link to="/register" className="bg-Secondary hover:bg-primary hover:text-white text-white w-full p-2 text-center">
                                    Join Now
                                </Link>
                            </div>
                        </nav>
                    </div>
                </div>
            )}

        </header>
    )
}

export default NavBar