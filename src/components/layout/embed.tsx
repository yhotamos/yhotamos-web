import Iframe from "react-iframe";
import Script from "next/script";

export const HatenaEmbed = ({ url }: { url: string }) => {
  const hatenaUrl = "https://hatenablog-parts.com/embed?url=" + url;
  return <Iframe url={hatenaUrl} className="w-full sm:w-xl border-solid rounded-md shadow hover:shadow-md transition" />;
};

export const TwitterEmbed = ({ username, theme, height }: { username: string; theme: string; height: number }) => {
  return (
    <div className="not-italic w-full sm:w-1/2 mx-auto">
      <h2 className="font-bold text-xl mb-3">Twitter</h2>
      <a className="twitter-timeline" data-theme={theme} data-height={height} href={`https://twitter.com/${username}`}>
        Tweets by {username}
      </a>
      <Script src="https://platform.twitter.com/widgets.js" strategy="lazyOnload" />
    </div>
  );
};
