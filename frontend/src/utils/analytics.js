/**
 * Analytics bootstrap (architecture doc — Analytics Tracking).
 * No-ops unless tracking IDs are configured, so development stays clean.
 *   VITE_GA_ID      — Google Analytics 4 measurement id (G-XXXXXXX)
 *   VITE_CLARITY_ID — Microsoft Clarity project id
 */

export function initAnalytics() {
  const gaId = import.meta.env.VITE_GA_ID
  const clarityId = import.meta.env.VITE_CLARITY_ID

  if (gaId) {
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`
    document.head.appendChild(script)
    window.dataLayer = window.dataLayer || []
    function gtag() {
      window.dataLayer.push(arguments)
    }
    window.gtag = gtag
    gtag('js', new Date())
    gtag('config', gaId)
  }

  if (clarityId) {
    const script = document.createElement('script')
    script.textContent = `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${clarityId}");`
    document.head.appendChild(script)
  }
}
