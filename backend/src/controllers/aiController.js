const Customer = require("../models/Customer");
const Match = require("../models/Match");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const { calculateCompatibility } = require("../services/matchingService");
const geminiService = require("../services/geminiService");

const loadPair = async (customerId, matchedCustomerId) => {
  const [customer, match] = await Promise.all([
    Customer.findById(customerId),
    Customer.findById(matchedCustomerId)
  ]);

  if (!customer || !match) {
    const error = new Error("Customer or matched profile not found");
    error.statusCode = 404;
    throw error;
  }

  return { customer, match };
};

const explainMatch = asyncHandler(async (req, res) => {
  const { customerId, matchedCustomerId } = req.body;

  if (!customerId || !matchedCustomerId) {
    res.status(400);
    throw new Error("customerId and matchedCustomerId are required");
  }

  const { customer, match } = await loadPair(customerId, matchedCustomerId);
  const compatibility = calculateCompatibility(customer, match);
  const explanation = await geminiService.explainMatch({
    customer,
    match,
    score: compatibility.score,
    breakdown: compatibility.breakdown
  });

  await Match.findOneAndUpdate(
    { customer: customer._id, matchedCustomer: match._id },
    {
      score: compatibility.score,
      breakdown: compatibility.breakdown,
      explanation
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  sendSuccess(res, {
    explanation,
    score: compatibility.score,
    breakdown: compatibility.breakdown
  });
});

const generateIntro = asyncHandler(async (req, res) => {
  const { customerId, matchedCustomerId } = req.body;

  if (!customerId || !matchedCustomerId) {
    res.status(400);
    throw new Error("customerId and matchedCustomerId are required");
  }

  const { customer, match } = await loadPair(customerId, matchedCustomerId);
  const compatibility = calculateCompatibility(customer, match);
  const introMessage = await geminiService.generateIntro({
    customer,
    match,
    score: compatibility.score
  });

  await Match.findOneAndUpdate(
    { customer: customer._id, matchedCustomer: match._id },
    {
      score: compatibility.score,
      breakdown: compatibility.breakdown,
      introMessage
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  sendSuccess(res, {
    introMessage,
    score: compatibility.score
  });
});

module.exports = {
  explainMatch,
  generateIntro
};
