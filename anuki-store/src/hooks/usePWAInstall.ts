import { useState, useEffect, useCallback } from 'react';
import { pwaInstallManager } from '../utils/pwaInstallManager';

export function usePWAInstall() {
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Initial state
    setCanInstall(pwaInstallManager.canInstall());
    setIsInstalled(pwaInstallManager.getIsInstalled());

    // Subscription
    const unsubscribe = pwaInstallManager.subscribe(() => {
      setCanInstall(pwaInstallManager.canInstall());
      setIsInstalled(pwaInstallManager.getIsInstalled());
    });

    return unsubscribe;
  }, []);

  const installApp = useCallback(async () => {
    return await pwaInstallManager.promptInstall();
  }, []);

  return { canInstall, isInstalled, installApp };
}
