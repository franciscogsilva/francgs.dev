import data from "../data/site.json";

export const getSocialData = (name: string) => {
  return data.social.find((elemento) => elemento.title === name)!;
};
