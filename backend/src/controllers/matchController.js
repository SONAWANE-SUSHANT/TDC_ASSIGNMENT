const Customer = require("../models/Customer");
const Match = require("../models/Match");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const { calculateCompatibility } = require("../services/matchingService");
const geminiService = require("../services/geminiService");

const sendMatch = asyncHandler(async (req, res) => {
  const { customerId, matchedCustomerId, introMessage = "" } = req.body;

  if (!customerId || !matchedCustomerId) {
    res.status(400);
    throw new Error("customerId and matchedCustomerId are required");
  }

  const [customer, matchedCustomer] = await Promise.all([
    Customer.findById(customerId),
    Customer.findById(matchedCustomerId)
  ]);

  if (!customer || !matchedCustomer) {
    res.status(404);
    throw new Error("Customer or matched profile not found");
  }

  const compatibility = calculateCompatibility(customer, matchedCustomer);
  const finalIntro =
    introMessage ||
    (await geminiService.generateIntro({
      customer,
      match: matchedCustomer,
      score: compatibility.score
    }));

  const match = await Match.findOneAndUpdate(
    {
      customer: customer._id,
      matchedCustomer: matchedCustomer._id
    },
    {
      $set: {
        score: compatibility.score,
        breakdown: compatibility.breakdown,
        introMessage: finalIntro,
        status: "sent",
        sentAt: new Date(),
        sentBy: "Matchmaking Employee"
      },
      $push: {
        actionHistory: {
          action: "sent",
          note: "Match introduction sent",
          performedBy: "Matchmaking Employee",
          performedAt: new Date()
        }
      }
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  )
    .populate("customer")
    .populate("matchedCustomer");

  sendSuccess(res, match, "Match sent successfully");
});

const getMatchHistory = asyncHandler(async (req, res) => {
  const { status = "sent", page = 1, limit = 10, search = "" } = req.query;
  const pageNumber = Math.max(Number(page), 1);
  const pageSize = Math.min(Math.max(Number(limit), 1), 50);
  const skip = (pageNumber - 1) * pageSize;

  const baseQuery = status ? { status } : {};
  let query = baseQuery;

  if (search) {
    const customers = await Customer.find({
      $or: [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ]
    }).select("_id");

    const ids = customers.map((customer) => customer._id);
    query = {
      ...baseQuery,
      $or: [{ customer: { $in: ids } }, { matchedCustomer: { $in: ids } }]
    };
  }

  const [matches, total, stats] = await Promise.all([
    Match.find(query)
      .populate("customer")
      .populate("matchedCustomer")
      .sort({ sentAt: -1, updatedAt: -1 })
      .skip(skip)
      .limit(pageSize),
    Match.countDocuments(query),
    Match.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ])
  ]);

  sendSuccess(res, {
    matches,
    pagination: {
      total,
      page: pageNumber,
      limit: pageSize,
      pages: Math.ceil(total / pageSize)
    },
    stats: stats.reduce((acc, item) => ({ ...acc, [item._id]: item.count }), {})
  });
});

const updateMatchStatus = asyncHandler(async (req, res) => {
  const { status, note = "" } = req.body;
  const allowedStatuses = ["sent", "accepted", "declined"];

  if (!allowedStatuses.includes(status)) {
    res.status(400);
    throw new Error("Invalid match status");
  }

  const match = await Match.findByIdAndUpdate(
    req.params.id,
    {
      $set: { status },
      $push: {
        actionHistory: {
          action: status,
          note,
          performedBy: "Matchmaking Employee",
          performedAt: new Date()
        }
      }
    },
    { new: true }
  );

  if (!match) {
    res.status(404);
    throw new Error("Match not found");
  }

  sendSuccess(res, match, "Match status updated");
});

module.exports = { sendMatch, getMatchHistory, updateMatchStatus };
