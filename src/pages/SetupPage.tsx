import React from 'react';
import { Navigate } from 'react-router-dom';
import { useTrialStore } from '../store/trialStore';
import { SetupWizard } from '../components/trial/SetupWizard';
import { AIPlanGenerator } from '../components/trial/AIPlanGenerator';

function SetupPage() {
  const { isTrialActive, setupProgress } = useTrialStore();

  // If not in trial, redirect
  if (!isTrialActive) {
    return <Navigate to="/" replace />;
  }

  // Show AI plan generator after setup is complete
  if (setupProgress === 100) {
    return <AIPlanGenerator />;
  }

  return <SetupWizard />;
}

export default SetupPage;