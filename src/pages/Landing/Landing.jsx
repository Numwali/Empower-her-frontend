import React from 'react'
import NavBar from './NavBar'
import Footer from './Footer'
import heroImage from "../../assets/images/k-cover.png"
import profileImage from "../../assets/images/profile.png"
import { Link } from 'react-router-dom'

const Landing = () => {
    return (
        <div className="min-h-screen flex flex-col overflow-x-hidden">
            <NavBar />

            {/* Hero Section */}
            <section id='/' className="relative pt-20 pb-16 md:pt-28 md:pb-24 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-Muted/40 to-white z-0"></div>
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center opacity-10"
                    style={{ backgroundImage: "url('./src/assets/images/img.png')" }}
                ></div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                        <div className="md:w-1/2 space-y-6">
                            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-primary leading-tight mt-8 max-w-full break-words">
                                Begin Your Journey to <span className="text-Secondary">Mental Wellness</span>
                            </h1>
                            <p className="text-base sm:text-lg text-primary/80 max-w-lg">
                                A safe, supportive space for women across Rwanda and Africa to heal, grow, and empower themselves
                                through mental health resources.
                            </p>
                            <div className="pt-2">
                                <Link to={'/login'} className="bg-Secondary hover:bg-primary text-white px-4 sm:px-6 py-2 rounded-full text-sm sm:text-base transition-all duration-300 shadow-md hover:shadow-lg inline-block">
                                    Join Now – Start Your Wellness Journey
                                </Link>
                            </div>
                        </div>
                        <div className="md:w-1/2 mt-8 md:mt-0 max-w-full">
                            <div className="relative h-[250px] sm:h-[300px] md:h-[400px] w-full rounded-2xl overflow-hidden shadow-xl transform md:translate-x-4 md:translate-y-4">
                                <div className="absolute -bottom-6 -right-6 w-24 h-24 md:w-32 md:h-32 bg-Accent rounded-full opacity-50"></div>
                                <div className="absolute -top-6 -left-6 w-16 h-16 md:w-22 md:h-22 bg-Muted rounded-full opacity-50"></div>
                                <img
                                    src={heroImage}
                                    alt="Diverse women supporting each other"
                                    className="object-cover h-full w-full rounded-2xl"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
                        <path
                            fill="#ffffff"
                            fillOpacity="1"
                            d="M0,96L80,112C160,128,320,160,480,160C640,160,800,128,960,122.7C1120,117,1280,139,1360,149.3L1440,160L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
                        ></path>
                    </svg>
                </div>
            </section>

            {/* Features Section */}
            <section id='About-us' className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-3">
                            How EmpowerHer Supports Your Wellness
                        </h2>
                        <p className="text-primary/70 max-w-2xl mx-auto text-sm sm:text-base">
                            Our platform provides tools and resources specifically designed for women's mental health needs
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                        {/* Feature 1 */}
                        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-t-4 border-Accent">
                            <div className="w-14 h-14 bg-Accent/20 rounded-full flex items-center justify-center mb-4">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-7 w-7 text-Accent"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-primary mb-2">Guided Meditation</h3>
                            <p className="text-primary/70 text-sm">
                                Access culturally relevant meditation Sessions designed to reduce stress and build emotional resilience.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-t-4 border-Secondary">
                            <div className="w-14 h-14 bg-Secondary/20 rounded-full flex items-center justify-center mb-4">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-7 w-7 text-Secondary"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-primary mb-2">Therapist Connections</h3>
                            <p className="text-primary/70 text-sm">
                                Connect with professional therapists who understand your cultural context and specific needs.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-t-4 border-primary">
                            <div className="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-7 w-7 text-primary"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-primary mb-2">Community Support</h3>
                            <p className="text-primary/70 text-sm">
                                Join a safe community of women sharing experiences and supporting each other through similar journeys.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id='How-It-Works' className="py-16 bg-gradient-to-br from-white to-Muted/10">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-3">How It Works</h2>
                        <p className="text-primary/70 max-w-2xl mx-auto text-sm sm:text-base">
                            Your journey to mental wellness is just a few steps away
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {/* Step 1 */}
                        <div className="text-center">
                            <div className="w-16 h-16 bg-Muted rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                                1
                            </div>
                            <h3 className="text-lg font-semibold text-primary mb-2">Sign Up</h3>
                            <p className="text-primary/70 text-sm">Create your account and complete your profile</p>
                        </div>

                        {/* Step 2 */}
                        <div className="text-center">
                            <div className="w-16 h-16 bg-Accent rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                                2
                            </div>
                            <h3 className="text-lg font-semibold text-primary mb-2">Explore Resources</h3>
                            <p className="text-primary/70 text-sm">Browse meditation guides and educational content</p>
                        </div>

                        {/* Step 3 */}
                        <div className="text-center">
                            <div className="w-16 h-16 bg-Secondary rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                                3
                            </div>
                            <h3 className="text-lg font-semibold text-primary mb-2">Connect</h3>
                            <p className="text-primary/70 text-sm">Find a therapist or join community discussions</p>
                        </div>

                        {/* Step 4 */}
                        <div className="text-center">
                            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                                4
                            </div>
                            <h3 className="text-lg font-semibold text-primary mb-2">Begin Healing</h3>
                            <p className="text-primary/70 text-sm">Start your journey to improved mental wellness</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section id='Stories' className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-3">Stories from Our Community</h2>
                        <p className="text-primary/70 max-w-2xl mx-auto text-sm sm:text-base">
                            Hear from women whose lives have been transformed through EmpowerHer
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Testimonial 1 */}
                        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 relative">
                            <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M12 22H6V16H12V22ZM12 10H6V4H12V10ZM24 22H18V16H24V22ZM24 10H18V4H24V10ZM36 22H30V16H36V22ZM36 10H30V4H36V10Z"
                                        fill='Muted'
                                        fillOpacity="0.3"
                                    />
                                </svg>
                            </div>
                            <div className="flex items-center mb-4">
                                <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                                    <img
                                        src={profileImage}
                                        alt="User"
                                        width={48}
                                        height={48}
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-base text-primary">Amina K.</h4>
                                    <p className="text-xs text-primary/60">Kigali, Rwanda</p>
                                </div>
                            </div>
                            <p className="text-primary/80 italic text-sm">
                                "EmpowerHer gave me the tools to understand my anxiety and connect with others who share similar
                                experiences. The guided meditations have become part of my daily routine."
                            </p>
                        </div>

                        {/* Testimonial 2 */}
                        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 relative">
                            <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M12 22H6V16H12V22ZM12 10H6V4H12V10ZM24 22H18V16H24V22ZM24 10H18V4H24V10ZM36 22H30V16H36V22ZM36 10H30V4H36V10Z"
                                        fill="#65acf0"
                                        fillOpacity="0.3"
                                    />
                                </svg>
                            </div>
                            <div className="flex items-center mb-4">
                                <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                                    <img
                                        src={profileImage}
                                        alt="User"
                                        width={48}
                                        height={48}
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-base text-primary">Grace M.</h4>
                                    <p className="text-xs text-primary/60">Nairobi, Kenya</p>
                                </div>
                            </div>
                            <p className="text-primary/80 italic text-sm">
                                "Finding a therapist who understands my cultural background made all the difference. I finally feel
                                heard and supported in my mental health journey."
                            </p>
                        </div>

                        {/* Testimonial 3 */}
                        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 relative">
                            <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M12 22H6V16H12V22ZM12 10H6V4H12V10ZM24 22H18V16H24V22ZM24 10H18V4H24V10ZM36 22H30V16H36V22ZM36 10H30V4H36V10Z"
                                        fill="#2685f0"
                                        fillOpacity="0.3"
                                    />
                                </svg>
                            </div>
                            <div className="flex items-center mb-4">
                                <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                                    <img
                                        src={profileImage}
                                        alt="User"
                                        width={48}
                                        height={48}
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-base text-primary">Fatima B.</h4>
                                    <p className="text-xs text-primary/60">Lagos, Nigeria</p>
                                </div>
                            </div>
                            <p className="text-primary/80 italic text-sm">
                                "The community here is unlike any other. We lift each other up and break the stigma around mental health
                                together. It's truly empowering."
                            </p>
                        </div>

                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-r from-primary to-Secondary text-white" id="cta">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to Start Your Wellness Journey?</h2>
                    <p className="max-w-2xl mx-auto mb-8 text-white/80 text-sm sm:text-base">
                        Join thousands of women across Africa who are taking control of their mental health and emotional
                        well-being.
                    </p>
                    <div className="flex flex-col items-center sm:flex-row gap-4 justify-center">
                        <Link to="/register" className="bg-white w-48 text-primary hover:bg-Muted hover:text-primary px-6 py-2 rounded-full text-sm sm:text-base transition-all duration-300 text-center">
                            Sign Up Now
                        </Link>
                        <a href="#about" className="bg-transparent w-48 border border-white text-white hover:bg-white/10 px-6 py-2 rounded-full text-sm sm:text-base transition-all duration-300 text-center">
                            Learn More
                        </a>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}

export default Landing