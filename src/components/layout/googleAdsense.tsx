import Script from "next/script";

const ADS_ID = process.env.NEXT_PUBLIC_ADS_ID;

export const GoogleAdsense = () => {
  if (!ADS_ID) {
    return null;
  }

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADS_ID}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
};
