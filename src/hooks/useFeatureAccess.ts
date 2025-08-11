import { useCallback } from 'react';
import { usePermissions } from '../lib/permissions';
import { useGuestStore } from '../store/guestStore';
import { useToastStore } from '../store/toastStore';

export function useFeatureAccess() {
  const { checkFeatureAccess, getFeatureMessage } = usePermissions();
  const { setReturnPath } = useGuestStore();
  const { showError } = useToastStore();

  const handleFeatureAccess = useCallback((
    feature: string,
    action: () => void,
    returnPath?: string
  ) => {
    if (checkFeatureAccess(feature)) {
      action();
    } else {
      const message = getFeatureMessage(feature);
      showError(message);
      if (returnPath) {
        setReturnPath(returnPath);
      }
    }
  }, [checkFeatureAccess, getFeatureMessage, showError, setReturnPath]);

  return { handleFeatureAccess };
}