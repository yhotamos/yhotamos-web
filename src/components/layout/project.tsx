import { HatenaEmbed } from "./embed";

export function Project({
  title,
  repos,
  limit = 5,
}: {
  title?: string;
  repos: string[];
  limit?: number;
}) {
  return (
    <div className="w-full">
      {title && <h1 className="font-bold text-xl mb-3">{title}</h1>}
      <div className="grid gap-3">
        {repos.map((repo: any, index) => {
          if (index < limit) {
            console.log(repo.url);
            return <HatenaEmbed url={repo.html_url} key={index} />;
          }
        })}
      </div>
    </div>
  );
}
