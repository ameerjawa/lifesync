import React from 'react';
import { usePermissions } from '../lib/permissions';
import { GuestPrompt } from './GuestPrompt';
import { UpgradePrompt } from './trial/UpgradePrompt';

interface FeatureGuardProps {
  feature: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function FeatureGuard({ feature, children, fallback }: FeatureGuardProps) {
  const [showPrompt, setShowPrompt] = React.useState(false);
  const { checkFeatureAccess, isGuest, plan } = usePermissions();

  // Check if user has access to the feature
  const hasAccess = checkFeatureAccess(feature);

  // Show prompt for guest users
  if (isGuest && !hasAccess) {
    return (
      <>
        {fallback}
        {showPrompt && (
          <GuestPrompt
            onClose={() => setShowPrompt(false)}
            message="This feature is only available to registered users. Sign up now to unlock all features!"
          />
        )}
      </>
    );
  }

  // Show upgrade prompt for free users
  if (!isGuest && plan === 'free' && !hasAccess) {
    return (
      <>
        {fallback}
        {showPrompt && (
          <UpgradePrompt
            onClose={() => setShowPrompt(false)}
            feature={feature}
          />
        )}
      </>
    );
  }

  // Show feature for users with access
  if (hasAccess) {
    return <>{children}</>;
  }

  // Show fallback for users without access
  return <>{fallback}</>;
}