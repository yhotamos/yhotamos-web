type RepositorySource = {
  login: string;
  type: "user" | "org";
};

export const repositorySources: RepositorySource[] = [
  { login: "yhotta240", type: "user" },
  { login: "yhotamos", type: "org" },
];
