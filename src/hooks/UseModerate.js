import OpenAI from "openai";

const openai = new OpenAI({
  organization: import.meta.env.VITE_OPENAI_ORG_KEY,
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export default async function UseModerate(text) {
  const response = await openai.moderations.create({
    input: text,
  });

  return response.results[0].flagged;
}
