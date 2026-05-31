import { useEffect } from 'react';

const FIREBASE_FUNCTION_URL = 'https://us-central1-visitor-tracker-for-githubio.cloudfunctions.net/trackVisitor';
let _trackingCalled = false;

function getOrCreateDeviceId() {
  let deviceId = localStorage.getItem('_did');
  if (!deviceId) {
    deviceId = Math.random().toString(36).slice(2) + Date.now().toString(36);
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


export default function useVisitorTracking() {
  useEffect(() => {
    if (_trackingCalled || hasCalledToday()) return;
    _trackingCalled = true;

    const deviceId = getOrCreateDeviceId();

    fetch(FIREBASE_FUNCTION_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ _did: deviceId, pageUrl: window.location.href }),
    })
      .then(() => markCalledToday())
      .catch(err => console.error('Visitor tracking failed:', err));
  }, []);
}
