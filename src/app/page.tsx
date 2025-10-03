'use client';

import React, { useState, useEffect } from 'react';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { useTheme } from '@/components/theme-provider';
import { 
  Moon, Sun, TrendingUp, Shield, Award, 
  BarChart3, Clock, ChevronRight, Menu, X,
  Sparkles,Option, Target, Zap, Globe,
  ArrowRight, Play, Twitter, Linkedin, Github,
  Mail,
  Instagram
} from 'lucide-react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    setIsVisible(true);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 via-zinc-950 to-black text-gray-100' 
        : 'bg-gradient-to-br from-blue-50 via-white to-cyan-50 text-gray-900'
    }`}>

      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? isDark 
            ? 'bg-gray-900/95 backdrop-blur-xl border-b border-gray-800 shadow-2xl' 
            : 'bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-lg'
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">

            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className={`relative w-12 h-12 rounded-2xl flex items-center justify-center font-serif text-xl font-bold transition-all duration-500 group-hover:scale-110 ${
                isDark 
                  ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white ' 
                  : 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white '
              }`}>
                <Option className="w-5 h-5" />
              </div>
              <div className="transition-transform duration-300 group-hover:translate-x-1">
                <h1 className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                 NOSUM
                </h1>
                <p className={`text-xs tracking-widest font-medium ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  AI INVESTMENTS
                </p>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              {['Features', 'Methodology', 'Insights'].map((item) => (
                <a 
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className={`relative text-sm font-medium tracking-wide transition-all duration-300 hover:scale-105 ${
                    isDark 
                      ? 'text-gray-300 hover:text-white' 
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  {item}
                  <span className={`absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 hover:w-full ${
                    isDark ? 'bg-blue-500' : 'bg-blue-600'
                  }`} />
                </a>
              ))}
              
              <button
                onClick={toggleTheme}
                className={`p-3 rounded-2xl transition-all duration-300 hover:scale-110 ${
                  isDark 
                    ? 'bg-gray-800 hover:bg-gray-700 ' 
                    : 'bg-white hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              <SignedOut>
                <SignInButton mode="modal">
                  <button className={`px-8 py-3 rounded-2xl font-medium transition-all duration-300 hover:scale-105 ${
                    isDark
                      ? 'bg-purple-600'
                      : 'bg-blue-500  text-white'
                  }`}>
                    Get Started
                  </button>
                </SignInButton>
              </SignedOut>

              <SignedIn>
                <Link 
                  href="/dashboard"
                  className={`px-8 py-3 rounded-2xl font-medium transition-all duration-300 hover:scale-105 ${
                    isDark
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 '
                      : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white '
                  }`}
                >
                  Dashboard
                </Link>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-3 rounded-2xl transition-all duration-300 ${
                isDark ? 'bg-gray-800' : 'bg-white border border-gray-200'
              }`}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className={`md:hidden border-t backdrop-blur-xl ${
            isDark 
              ? 'bg-gray-900/95 border-gray-800' 
              : 'bg-white/95 border-gray-200'
          }`}>
            <div className="px-6 py-6 space-y-4">
              {['Features', 'Methodology', 'Insights'].map((item) => (
                <a 
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="block text-lg font-medium py-3 transition-all duration-300 hover:translate-x-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              <div className="pt-4 border-t border-gray-700">
                <SignedOut>
                  <SignInButton mode="modal">
                    <button className={`w-full px-6 py-4 rounded-2xl font-medium transition-all duration-300 ${
                      isDark
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600'
                        : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                    }`}>
                      Get Started
                    </button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <Link 
                    href="/dashboard"
                    className={`block w-full px-6 py-4 text-center rounded-2xl font-medium transition-all duration-300 ${
                      isDark
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600'
                        : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                </SignedIn>
              </div>
            </div>
          </div>
        )}
      </nav>

      <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className={`absolute inset-0 ${
            isDark 
              ? 'bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-transparent' 
              : 'bg-gradient-to-br from-blue-200/50 via-cyan-200/50 to-transparent'
          }`} />
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
         
            <div className={`transition-all duration-700 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>

              <div className={`inline-flex items-center space-x-3 -mt-8 px-6 py-3 rounded-full mb-8 backdrop-blur-lg border transition-all duration-500 hover:scale-105 ${
                isDark 
                  ? 'bg-gray-800/50 border-gray-700 text-blue-400' 
                  : 'bg-white/50 border-gray-300 text-blue-600'
              }`}>
                <Zap className="w-5 h-5 animate-pulse" />
                <span className="text-sm font-semibold tracking-wider">
                  NEXT-GEN AI PLATFORM
                </span>
              </div>

              <h1 className="font-bold -mt-6 text-6xl lg:text-7xl xl:text-8xl leading-tight mb-6">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                  Smart
                </span>
                <br />
                <span className={isDark ? 'text-gray-100' : 'text-gray-900'}>
                  Investing
                </span>
                <br />
                <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                  Reimagined
                </span>
              </h1>

              <p className={`text-xl lg:text-2xl font-light leading-relaxed mb-12 ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Harness the power of artificial intelligence to make informed investment decisions with confidence and precision.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 items-center">
                <SignedOut>
                  <SignInButton mode="modal">
                    <button className={`group px-10 py-5 text-lg font-semibold rounded-2xl transition-all duration-500 hover:scale-105 shadow-2xl flex items-center space-x-3 ${
                      isDark
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-blue-500/50'
                        : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-blue-500/50'
                    }`}>
                      <span>Start Free Trial</span>
                      <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                    </button>
                  </SignInButton>
                </SignedOut>
                
                <SignedIn>
                  <Link 
                    href="/dashboard"
                    className={`group px-10 py-5 text-lg font-semibold rounded-2xl transition-all duration-500 hover:scale-105 flex items-center space-x-3 ${
                      isDark
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-blue-500/50'
                        : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-blue-500/50'
                    }`}
                  >
                    <span>Go to Dashboard</span>
                    <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                  </Link>
                </SignedIn>

                <button className={`group px-10 py-5 text-lg font-semibold rounded-2xl border-2 transition-all duration-500 hover:scale-105 flex items-center space-x-3 ${
                  isDark
                    ? 'border-gray-700 text-gray-300 hover:border-blue-500 hover:text-blue-400'
                    : 'border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600'
                }`}>
                  <Play size={20} className="group-hover:scale-110 transition-transform" />
                  <span>Watch Demo</span>
                </button>
              </div>
            </div>

          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-24">
            {[
              { label: 'AI Models', value: '50+' },
              { label: 'Data Points', value: '10M+' },
              { label: 'Accuracy', value: '94%' },
              { label: 'Users', value: '25K+' }
            ].map((stat, i) => (
              <div 
                key={i}
                className={`text-center p-6 rounded-2xl backdrop-blur-lg border transition-all duration-500 hover:scale-105 ${
                  isDark 
                    ? 'bg-gray-800/50 border-gray-700 hover:border-blue-500' 
                    : 'bg-white/50 border-gray-200 hover:border-blue-400'
                }`}
              >
                <div className={`font-bold text-3xl lg:text-4xl mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}>
                  {stat.value}
                </div>
                <div className={`text-sm font-semibold tracking-wider ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className={`py-24 ${
        isDark ? 'bg-gray-900/50' : 'bg-white/50'
      }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="font-bold text-5xl lg:text-6xl mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Powerful
              </span>{' '}
              Features
            </h2>
            <p className={`text-xl max-w-2xl mx-auto ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Advanced tools and insights to transform your investment strategy
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Target className="w-10 h-10" />,
                title: 'Predictive Analytics',
                description: 'Machine learning models analyze market patterns to forecast trends with exceptional accuracy.'
              },
              {
                icon: <Shield className="w-10 h-10" />,
                title: 'Risk Intelligence',
                description: 'Comprehensive risk assessment with real-time monitoring and alert systems.'
              },
              {
                icon: <Globe className="w-10 h-10" />,
                title: 'Global Markets',
                description: 'Access and analyze data from global markets with multi-currency support.'
              },
              {
                icon: <BarChart3 className="w-10 h-10" />,
                title: 'Portfolio Insights',
                description: 'Deep analytics on your portfolio performance with actionable recommendations.'
              },
              {
                icon: <Option className="w-10 h-10" />,
                title: 'AI Assistant',
                description: '24/7 AI-powered investment assistant to guide your decisions.'
              },
              {
                icon: <Zap className="w-10 h-10" />,
                title: 'Real-Time Alerts',
                description: 'Instant notifications on market movements and opportunities.'
              }
            ].map((feature, i) => (
              <div 
                key={i}
                className={`group p-8 rounded-3xl backdrop-blur-lg border-2 transition-all duration-500 hover:scale-105 cursor-pointer ${
                  isDark 
                    ? 'bg-gray-800/30 border-gray-700 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/20' 
                    : 'bg-white/50 border-gray-200 hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-500/20'
                }`}
              >
                <div className={`mb-6 p-4 rounded-2xl w-fit transition-all duration-500 group-hover:scale-110 ${
                  isDark 
                    ? 'bg-blue-500/20 text-blue-400 group-hover:bg-blue-500/30' 
                    : 'bg-blue-100 text-blue-600 group-hover:bg-blue-200'
                }`}>
                  {feature.icon}
                </div>
                <h3 className="font-bold text-2xl mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text">
                  {feature.title}
                </h3>
                <p className={`text-lg leading-relaxed ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="methodology" className={`py-24 ${
        isDark ? 'bg-gradient-to-br from-gray-900 to-black' : 'bg-gradient-to-br from-gray-50 to-white'
      }`}>
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="font-bold text-5xl lg:text-6xl mb-6">
              How It{' '}
              <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                Works
              </span>
            </h2>
            <p className={`text-xl ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Our proven process for delivering accurate market insights
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              {[
                {
                  number: '01',
                  title: 'Data Collection',
                  description: 'Aggregate real-time data from global markets, news, and economic indicators.'
                },
                {
                  number: '02',
                  title: 'AI Analysis',
                  description: 'Advanced machine learning models process data to identify patterns and trends.'
                },
                {
                  number: '03',
                  title: 'Risk Assessment',
                  description: 'Comprehensive evaluation of market risks and opportunity factors.'
                },
                {
                  number: '04',
                  title: 'Smart Insights',
                  description: 'Actionable recommendations tailored to your investment goals.'
                }
              ].map((step, i) => (
                <div 
                  key={i}
                  className={`group flex items-start space-x-6 p-6 rounded-2xl backdrop-blur-lg border transition-all duration-500 hover:scale-105 cursor-pointer ${
                    isDark 
                      ? 'bg-gray-800/30 border-gray-700 hover:border-cyan-500' 
                      : 'bg-white/50 border-gray-200 hover:border-cyan-400'
                  }`}
                >
                  <div className={`flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-xl transition-all duration-500 group-hover:scale-110 ${
                    isDark 
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' 
                      : 'bg-cyan-100 text-cyan-600'
                  }`}>
                    {step.number}
                  </div>
                  <div>
                    <h3 className="font-bold text-2xl mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-cyan-600 group-hover:to-blue-600 group-hover:bg-clip-text">
                      {step.title}
                    </h3>
                    <p className={`text-lg leading-relaxed ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className={`p-8 rounded-3xl backdrop-blur-lg border-2 ${
              isDark 
                ? 'bg-gray-800/30 border-cyan-500/30' 
                : 'bg-white/50 border-cyan-400/30'
            }`}>
              <div className={`p-8 rounded-2xl ${
                isDark ? 'bg-gray-800/50' : 'bg-cyan-50'
              }`}>
                <div className="text-center mb-8">
                  <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                    isDark ? 'bg-cyan-500/20' : 'bg-cyan-100'
                  }`}>
                    <Option className={`w-10 h-10 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
                  </div>
                  <h3 className="font-bold text-2xl mb-2">AI-Powered Accuracy</h3>
                  <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                    Our models continuously learn and improve
                  </p>
                </div>
                <div className="space-y-4">
                  {['Market Trend Analysis', 'Risk Prediction', 'Portfolio Optimization', 'Real-time Alerts'].map((item, i) => (
                    <div key={i} className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        isDark ? 'bg-cyan-500' : 'bg-cyan-600'
                      }`} />
                      <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={`py-24 ${
        isDark 
          ? 'bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-cyan-900/20' 
          : 'bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50'
      }`}>
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <div className={`p-12 rounded-3xl backdrop-blur-lg border-2 ${
            isDark 
              ? 'bg-gray-900/50 border-gray-700' 
              : 'bg-white/50 border-gray-200'
          }`}>
            <h2 className="font-bold text-5xl lg:text-6xl mb-6">
              Ready to{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Transform
              </span>
              <br />
              Your Investing?
            </h2>
            <p className={`text-2xl mb-10 ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Join thousands of investors using AI to make smarter decisions
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className={`group px-12 py-6 text-xl font-bold rounded-2xl transition-all duration-500 hover:scale-105 shadow-2xl flex items-center space-x-3 ${
                    isDark
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-blue-500/50'
                      : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-blue-500/50'
                  }`}>
                    <span>Start Free Trial</span>
                    <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                  </button>
                </SignInButton>
              </SignedOut>

              <SignedIn>
                <Link 
                  href="/dashboard"
                  className={`group px-12 py-6 text-xl font-bold rounded-2xl transition-all duration-500 hover:scale-105 flex items-center space-x-3 ${
                    isDark
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600'
                      : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white '
                  }`}
                >
                  <span>Open Dashboard</span>
                  <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                </Link>
              </SignedIn>

              <button className={`px-12 py-6 text-xl font-bold rounded-2xl border-2 transition-all duration-500 hover:scale-105 ${
                isDark
                  ? 'border-gray-600 text-gray-300 hover:border-purple-500 hover:text-purple-400'
                  : 'border-gray-300 text-gray-700 hover:border-purple-500 hover:text-purple-600'
              }`}>
                Schedule Demo
              </button>
            </div>

            <SignedOut>
              <p className={`text-sm mt-8 ${
                isDark ? 'text-gray-500' : 'text-gray-400'
              }`}>
                No credit card required • 14-day free trial • Cancel anytime
              </p>
            </SignedOut>
          </div>
        </div>
      </section>

      <footer className={`py-16 ${
        isDark ? 'bg-gray-900' : 'bg-white'
      }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-8 lg:space-y-0">
            <div className="flex items-center space-x-4 group cursor-pointer">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-2xl transition-all duration-500 group-hover:scale-110 ${
                isDark 
                  ? 'bg-gradient-to-br from-blue-600 to-purple-600 ' 
                  : 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white'
              }`}>
                <Option className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                 NOSUM
                </h3>
                <p className={`text-sm font-medium tracking-wider ${
                  isDark ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  AI INVESTMENTS
                </p>
              </div>
            </div>

            <div className={`text-lg font-medium ${
              isDark ? 'text-gray-600' : 'text-gray-800'
            }`}>
             Built with ❤️ By Mritunjay Thakur.
            </div>

            <div className="flex space-x-4">
              {[
               
                { icon: <Linkedin size={20} />, name: 'LinkedIn', link :'https://www.linkedin.com/in/mritunjay-thakur-jay' },
                { icon: <Github size={20} />, name: 'GitHub', link :'https://github.com/mritunjay-thakur/' },
                 { icon: <Instagram size={20} />, name: 'Instagram', link : 'https://www.instagram.com/___jaythakur___/' },
                 { icon: <Mail size={20} />, name: 'Gmail', link : 'mailto:mritunjaythakur903@gmail.com' },
              ].map((social, index) => (
                <a
                  key={social.name}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer" 
                  className={`p-4 rounded-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center ${
                    isDark 
                      ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900'
                  } group relative`}
                >
                  {social.icon}
                  <span className={`absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                    isDark ? 'bg-gray-700 text-white' : 'bg-gray-800 text-white'
                  }`}>
                    {social.name}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}