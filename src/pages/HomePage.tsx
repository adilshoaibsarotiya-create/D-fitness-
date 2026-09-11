import React, { useEffect } from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { ShortAbout } from '../components/home/ShortAbout';
import { WhyChooseUs } from '../components/home/WhyChooseUs';
import { FeaturedPrograms } from '../components/home/FeaturedPrograms';
import { FeaturedTrainers } from '../components/home/FeaturedTrainers';
import { HomeTransformations } from '../components/home/HomeTransformations';
import { HomeTestimonials } from '../components/home/HomeTestimonials';
import { HomeCta } from '../components/home/HomeCta';

export const HomePage: React.FC = () => {
  useEffect(() => {
    document.title = "D FITNESS | Godda's Premium Fitness Destination";
    window.scrollTo(0, 0);
  }, []);

  return (
    <main id="home-main-content">
      {/* 1. Hero */}
      <HeroSection />

      {/* 2. Short About */}
      <ShortAbout />

      {/* 3. Why Choose D FITNESS */}
      <WhyChooseUs />

      {/* 4. Featured Programs */}
      <FeaturedPrograms />

      {/* 5. Featured Trainers */}
      <FeaturedTrainers />

      {/* 6. Transformation Preview */}
      <HomeTransformations />

      {/* 7. Testimonials */}
      <HomeTestimonials />

      {/* 8. CTA */}
      <HomeCta />
    </main>
  );
};
