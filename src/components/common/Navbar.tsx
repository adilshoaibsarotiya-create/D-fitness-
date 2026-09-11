import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowUpRight, Dumbbell, ShieldCheck, Sparkles } from 'lucide-react';
import { Logo } from './Logo';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Programs', path: '/programs' },
    { name: 'Trainers', path: '/trainers' },
    { name: 'Membership', path: '/membership' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Transformations', path: '/transformations' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Contact', path: '/contact' },
  ];

  const toolsLinks = [
    { name: 'BMI Calculator', path: '/bmi-calculator' },
    { name: 'Calorie Calculator', path: '/calorie-calculator' },
    { name: 'Workout Planner', path: '/workout-planner' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header
      id="main-navigation-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#050505]/95 backdrop-blur-md border-b border-[#FFD400]/15 py-3 shadow-2xl shadow-black/80'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex-shrink-0">
            <Logo size="md" />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-1 lg:space-x-2" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-3 py-1.5 text-sm font-medium transition-colors duration-200 rounded-md ${
                    active
                      ? 'text-[#FFD400] font-semibold'
                      : 'text-[#BDBDBD] hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.name}
                  {active && (
                    <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#FFD400] rounded-full yellow-glow" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action CTA & Calculators / Free Trial */}
          <div className="hidden lg:flex items-center space-x-3">
            <Link
              to="/free-trial"
              className="text-xs font-semibold uppercase tracking-wider text-[#FFD400] hover:text-white px-3 py-2 rounded-md border border-[#FFD400]/30 hover:border-[#FFD400] hover:bg-[#FFD400]/10 transition-all duration-200 flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FFD400]" />
              Free Trial
            </Link>

            <Link
              to="/membership"
              id="navbar-join-now-btn"
              className="button-shine bg-[#FFD400] hover:bg-[#FFE600] text-black font-heading font-bold text-sm tracking-wide px-5 py-2.5 rounded-md transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(255,212,0,0.5)] flex items-center gap-1.5"
            >
              JOIN NOW
              <ArrowUpRight className="w-4 h-4 text-black stroke-[2.5]" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center space-x-2">
            <Link
              to="/membership"
              className="text-xs font-heading font-bold bg-[#FFD400] text-black px-3 py-1.5 rounded"
            >
              JOIN
            </Link>
            <button
              type="button"
              id="mobile-nav-toggle-button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-[#BDBDBD] hover:text-white hover:bg-[#151515] focus:outline-none focus:ring-2 focus:ring-[#FFD400]"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-[#FFD400]" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation-drawer"
          className="lg:hidden fixed inset-x-0 top-[60px] bottom-0 bg-[#050505] border-t border-white/10 px-5 py-6 overflow-y-auto z-50 flex flex-col justify-between"
        >
          <div className="space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#BDBDBD]/60 px-3 py-1">
              Explore D FITNESS
            </div>
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center justify-between px-3 py-3 rounded-lg text-base font-medium transition-colors ${
                    active
                      ? 'bg-[#151515] text-[#FFD400] font-semibold border-l-4 border-[#FFD400]'
                      : 'text-white/90 hover:bg-[#151515] hover:text-white'
                  }`}
                >
                  <span>{link.name}</span>
                  {active && <span className="w-2 h-2 rounded-full bg-[#FFD400]" />}
                </Link>
              );
            })}

            <div className="pt-4 border-t border-white/10 mt-4">
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#BDBDBD]/60 px-3 py-1">
                Interactive Fitness Tools
              </div>
              {toolsLinks.map((tool) => (
                <Link
                  key={tool.path}
                  to={tool.path}
                  className="flex items-center gap-2 px-3 py-2.5 text-sm text-[#BDBDBD] hover:text-white hover:bg-[#151515] rounded-md"
                >
                  <Dumbbell className="w-4 h-4 text-[#FFD400]" />
                  <span>{tool.name}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-6 space-y-3">
            <Link
              to="/free-trial"
              className="w-full text-center block py-3 rounded-lg border border-[#FFD400] text-[#FFD400] font-semibold text-sm hover:bg-[#FFD400]/10 transition-colors"
            >
              BOOK FREE TRIAL
            </Link>
            <Link
              to="/membership"
              className="w-full text-center block py-3 rounded-lg bg-[#FFD400] text-black font-heading font-bold text-sm tracking-wider hover:bg-[#FFE600] transition-colors"
            >
              JOIN D FITNESS NOW
            </Link>

            <div className="flex items-center justify-between text-xs text-[#BDBDBD] pt-3 border-t border-white/10">
              <span>Godda, Jharkhand</span>
              <Link to="/admin" className="text-white/40 hover:text-white flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Staff Portal
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
