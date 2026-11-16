import React, { useEffect, useState } from 'react';
import { Download, RefreshCw, Share, PlusSquare, WifiOff, CheckCircle2, X } from 'lucide-react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={install}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
      >
        <Download className="w-3.5 h-3.5" />
        დააყენე აპი
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          დაყენება iPhone-ზე
        </button>

        {showIOSGuide && (
          <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/50 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ios-install-title"
          >
            <div className="w-full max-w-sm rounded-2xl bg-white border border-slate-200 p-6 shadow-xl space-y-4">
              <div className="flex items-start justify-between gap-3">
                <h3 id="ios-install-title" className="text-base font-bold text-slate-900">
                  დააყენე აპლიკაცია iPhone / iPad-ზე
                </h3>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  aria-label="დახურვა"
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <ol className="space-y-3 text-sm text-slate-700">
                <li className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-700 font-mono-num text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </span>
                  <span>
                    Safari-ს ქვედა პანელზე დააჭირე{' '}
                    <strong className="inline-flex items-center gap-1 text-slate-900">
                      <Share className="w-3.5 h-3.5 text-blue-600" /> Share
                    </strong>{' '}
                    ღილაკს.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-700 font-mono-num text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </span>
                  <span>
                    ჩამოსქროლე ქვემოთ და აირჩიე{' '}
                    <strong className="inline-flex items-center gap-1 text-slate-900">
                      <PlusSquare className="w-3.5 h-3.5 text-blue-600" /> Add to Home Screen
                    </strong>{' '}
                    (მთავარ ეკრანზე დამატება).
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-700 font-mono-num text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </span>
                  <span>
                    დააჭირე <strong className="text-slate-900">Add</strong> — აპლიკაცია გამოჩნდება მთავარ ეკრანზე!
                  </span>
                </li>
              </ol>

              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                გასაგებია
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};

export const PWAUpdatePrompt: React.FC = () => {
  const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null);

  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_swUrl, registration) {
      if (registration) {
        setSwRegistration(registration);
      }
    },
    onRegisterError(error) {
      console.error('SW registration error:', error);
    },
  });

  // Periodic & visibility-based update checks
  useEffect(() => {
    if (!swRegistration) return;

    const checkForUpdates = () => {
      swRegistration.update().catch(() => {});
    };

    const intervalId = window.setInterval(checkForUpdates, 60 * 60 * 1000);
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        checkForUpdates();
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [swRegistration]);

  useEffect(() => {
    if (!offlineReady) return;
    const timer = window.setTimeout(() => setOfflineReady(false), 4500);
    return () => window.clearTimeout(timer);
  }, [offlineReady, setOfflineReady]);

  if (!needRefresh && !offlineReady) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 left-4 sm:left-auto z-50 max-w-sm ml-auto">
      {needRefresh ? (
        <div className="bg-white border border-blue-200 rounded-2xl p-4 shadow-lg flex flex-col gap-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="text-sm font-bold text-slate-900">
                ხელმისაწვდომია ახალი ვერსია
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                განაახლე აპლიკაცია უახლესი ფუნქციებისა და სურათების მისაღებად.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setNeedRefresh(false)}
              aria-label="დახურვა"
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => updateServiceWorker(true)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              განახლება ახლავე
            </button>
            <button
              type="button"
              onClick={() => setNeedRefresh(false)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              მოგვიანებით
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-emerald-200 rounded-xl px-4 py-3 shadow-lg flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-900">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            აპლიკაცია მზადაა ოფლაინ მუშაობისთვის
          </div>
          <button
            type="button"
            onClick={() => setOfflineReady(false)}
            aria-label="დახურვა"
            className="text-slate-400 hover:text-slate-700 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-40 inline-flex items-center gap-2 rounded-xl bg-amber-50 border border-amber-200 px-3.5 py-2 text-xs font-semibold text-amber-950 shadow-md">
      <WifiOff className="w-3.5 h-3.5 text-amber-700 shrink-0" />
      <span>ოფლაინ რეჟიმი — იყენებ დაქეშილ ვერსიას</span>
    </div>
  );
};
