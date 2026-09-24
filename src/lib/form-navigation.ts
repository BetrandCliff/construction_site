export function returnToPreviousSection(router: { back: () => void; replace: (href: string) => void }, fallback: string) {
  const referrer = document.referrer;
  if (window.history.length > 1 && referrer && new URL(referrer).origin === window.location.origin) router.back();
  else router.replace(fallback);
}
