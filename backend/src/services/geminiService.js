const { GoogleGenerativeAI } = require("@google/generative-ai");
const env = require("../config/env");

const modelName = "gemini-1.5-flash";

const buildProfileSummary = (profile) => {
  return `${profile.firstName} ${profile.lastName}, ${profile.age}, ${profile.city}, ${profile.state}, ${profile.profession}, ${profile.degree}, ${profile.religion}, languages: ${(profile.languagesKnown || []).join(", ")}, kids: ${profile.wantKids}, relocation: ${profile.openToRelocate}, pets: ${profile.openToPets}`;
};

const fallbackExplanation = (customer, match, score) => {
  return `${customer.firstName} and ${match.firstName} have a ${score}% compatibility score because their lifestyle preferences, language overlap, location flexibility, and family expectations align well. Their professional and educational profiles also create a strong foundation for a meaningful introduction.`;
};

const fallbackIntro = (customer, match) => {
  return `Hi ${customer.firstName} and ${match.firstName}, we found a thoughtful match based on shared values, compatible lifestyle preferences, and complementary professional backgrounds. We believe this introduction is worth exploring and would be happy to help you take the next step.`;
};

const generateText = async (prompt) => {
  if (!env.geminiApiKey) {
    return "";
  }

  const genAI = new GoogleGenerativeAI(env.geminiApiKey);
  const model = genAI.getGenerativeModel({ model: modelName });
  const result = await model.generateContent(prompt);
  return result.response.text().trim();
};

const explainMatch = async ({ customer, match, score, breakdown }) => {
  const prompt = `
Write a concise, professional internal matchmaking explanation in 2 sentences.
Avoid sensitive or judgmental language. Mention practical compatibility factors only.

Profile A: ${buildProfileSummary(customer)}
Profile B: ${buildProfileSummary(match)}
Compatibility score: ${score}%
Breakdown: ${JSON.stringify(breakdown)}
`;

  try {
    const text = await generateText(prompt);
    return text || fallbackExplanation(customer, match, score);
  } catch (error) {
    return fallbackExplanation(customer, match, score);
  }
};

const generateIntro = async ({ customer, match, score }) => {
  const prompt = `
Write a warm personalized introduction message for two Indian matrimonial customers.
Keep it under 90 words, professional, respectful, and suitable for an employee to send.

Profile A: ${buildProfileSummary(customer)}
Profile B: ${buildProfileSummary(match)}
Compatibility score: ${score}%
`;

  try {
    const text = await generateText(prompt);
    return text || fallbackIntro(customer, match);
  } catch (error) {
    return fallbackIntro(customer, match);
  }
};

module.exports = {
  explainMatch,
  generateIntro
};
