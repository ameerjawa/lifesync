import React, { useState } from 'react';
import { AuthModal } from '../components/AuthModal';
import { TrialStartForm } from '../components/trial/TrialStartForm';
import { Navbar } from '../components/landing/Navbar';
import { Hero } from '../components/landing/Hero';
import { Features } from '../components/landing/Features';
import { Testimonials } from '../components/landing/Testimonials';
import { Integrations } from '../components/landing/Integrations';
import { Pricing } from '../components/landing/Pricing';
import { Footer } from '../components/landing/Footer';

function LandingPage() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');
  const [showTrialForm, setShowTrialForm] = useState(false);

  const handleAuthClick = (mode: 'signin' | 'signup') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar
        onSignIn={() => handleAuthClick('signin')}
        onSignUp={() => handleAuthClick('signup')}
      />

      <Hero onStartTrial={() => setShowTrialForm(true)} />
      <Features />
       <Pricing
        onStartTrial={() => setShowTrialForm(true)}
        onSignUp={() => handleAuthClick('signup')}
      />
      <Testimonials />
      <Integrations />
     
      <Footer />

      {/* Trial Form Modal */}
      {showTrialForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <TrialStartForm />
            <button
              onClick={() => setShowTrialForm(false)}
              className="mt-4 w-full px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              Maybe later
            </button>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
      />
    </div>
  );
}

export default LandingPage;