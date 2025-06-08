'use client'
import Features from '@/components/Landing/Features/Features'
import Footer from '@/components/Landing/Footer/Footer'
import Hero from '@/components/Landing/Hero/Hero'
import Navbar from '@/components/Landing/Navbar/Navbar'

export default function LandingPage () {
   return (
      <div className="landing-page">
         <Navbar />
         <Hero />
         <Features />
         <Footer />
      </div>
   )
}