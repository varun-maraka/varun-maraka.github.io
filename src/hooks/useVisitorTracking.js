import { useEffect } from 'react';

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby9OrPJJzvzbL1Qq5Qvb0UDgJNcHFcbfmZF4o4ZZDWECD0yoFTmoCgpbOgjmhpopBom/exec';
let _trackingCalled = false;

function getOrCreateDeviceId() {
  let deviceId = localStorage.getItem('_did');
  if (!deviceId) {
    deviceId = 'dev_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem('_did', deviceId);
  }
  return deviceId;
}

function hasCalledToday() {
  const lastCall = localStorage.getItem('_tdate');
  const today = new Date().toISOString().split('T')[0];
  return lastCall === today;
}

function markCalledToday() {
  const today = new Date().toISOString().split('T')[0];
  localStorage.setItem('_tdate', today);
}

function parseUserAgent() {
  const ua = navigator.userAgent;

  let browser = 'Unknown';
  if (/Edg\//.test(ua)) browser = 'Edge';
  else if (/OPR\/|Opera/.test(ua)) browser = 'Opera';
  else if (/Chrome\//.test(ua)) browser = 'Chrome';
  else if (/Firefox\//.test(ua)) browser = 'Firefox';
  else if (/Safari\//.test(ua)) browser = 'Safari';

  let os = 'Unknown';
  if (/Windows NT/.test(ua)) os = 'Windows';
  else if (/Mac OS X/.test(ua)) os = 'macOS';
  else if (/Android/.test(ua)) os = 'Android';
  else if (/iPhone|iPad|iPod/.test(ua)) os = 'iOS';
  else if (/Linux/.test(ua)) os = 'Linux';

  let device = 'Desktop';
  if (/Mobi|Android/i.test(ua)) device = 'Mobile';
  else if (/Tablet|iPad/i.test(ua)) device = 'Tablet';

  return { browser, os, device };
}

export default function useVisitorTracking() {
  useEffect(() => {
    if (_trackingCalled || hasCalledToday()) return;
    _trackingCalled = true;

    const deviceId = getOrCreateDeviceId();
    const { browser, os, device } = parseUserAgent();

    fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(({ ip }) =>
        fetch(`https://ipapi.co/${ip}/json/`)
          .then(res => res.json())
          .then(geo => {
            const payload = {
              deviceId,
              ip,
              country: geo.country_name || '',
              city: geo.city || '',
              browser,
              os,
              device,
              pageUrl: window.location.href,
            };

            return fetch(APPS_SCRIPT_URL, {
              method: 'POST',
              mode: 'no-cors',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            });
          })
      )
      .then(() => markCalledToday())
      .catch(err => console.error('Visitor tracking failed:', err));
  }, []);
}
