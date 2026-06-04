const Customer = require("../models/Customer");
const Match = require("../models/Match");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const { getMatchSummary } = require("../services/matchingService");
const geminiService = require("../services/geminiService");

const getCustomers = asyncHandler(async (req, res) => {
  const {
    search = "",
    city = "",
    state = "",
    gender = "",
    maritalStatus = "",
    statusTag = "",
    page = 1,
    limit = 10
  } = req.query;

  const query = {};

  if (search) {
    query.$or = [
      { firstName: { $regex: search, $options: "i" } },
      { lastName: { $regex: search, $options: "i" } },
      { city: { $regex: search, $options: "i" } },
      { profession: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } }
    ];
  }

  if (city) query.city = city;
  if (state) query.state = state;
  if (gender) query.gender = gender;
  if (maritalStatus) query.maritalStatus = maritalStatus;
  if (statusTag) query.statusTag = statusTag;

  const pageNumber = Math.max(Number(page), 1);
  const pageSize = Math.min(Math.max(Number(limit), 1), 50);
  const skip = (pageNumber - 1) * pageSize;

  const [customers, total, stats, filterOptions] = await Promise.all([
    Customer.find(query).sort({ createdAt: -1 }).skip(skip).limit(pageSize),
    Customer.countDocuments(query),
    Customer.aggregate([
      {
        $group: {
          _id: null,
          totalCustomers: { $sum: 1 },
          premiumCustomers: { $sum: { $cond: [{ $eq: ["$statusTag", "Premium"] }, 1, 0] } },
          verifiedCustomers: { $sum: { $cond: [{ $eq: ["$statusTag", "Verified"] }, 1, 0] } },
          averageAge: { $avg: "$age" }
        }
      }
    ]),
    Promise.all([
      Customer.distinct("city"),
      Customer.distinct("state"),
      Customer.distinct("maritalStatus"),
      Customer.distinct("statusTag")
    ])
  ]);

  sendSuccess(res, {
    customers,
    pagination: {
      total,
      page: pageNumber,
      limit: pageSize,
      pages: Math.ceil(total / pageSize)
    },
    stats: stats[0] || {
      totalCustomers: 0,
      premiumCustomers: 0,
      verifiedCustomers: 0,
      averageAge: 0
    },
    filterOptions: {
      cities: filterOptions[0].sort(),
      states: filterOptions[1].sort(),
      maritalStatuses: filterOptions[2].sort(),
      statusTags: filterOptions[3].sort()
    }
  });
});

const getCustomerById = asyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.params.id);

  if (!customer) {
    res.status(404);
    throw new Error("Customer not found");
  }

  sendSuccess(res, customer);
});

const updateCustomerStatus = asyncHandler(async (req, res) => {
  const { statusTag, note = "" } = req.body;
  const allowedStatuses = ["New", "Verified", "Premium", "Shortlisted", "Needs Review"];

  if (!allowedStatuses.includes(statusTag)) {
    res.status(400);
    throw new Error("Invalid customer status");
  }

  const customer = await Customer.findById(req.params.id);

  if (!customer) {
    res.status(404);
    throw new Error("Customer not found");
  }

  customer.statusTag = statusTag;
  customer.statusHistory.push({
    status: statusTag,
    note,
    changedBy: "Matchmaking Employee",
    changedAt: new Date()
  });

  await customer.save();

  sendSuccess(res, customer, "Customer status updated");
});

const getCustomerMatches = asyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.params.id);

  if (!customer) {
    res.status(404);
    throw new Error("Customer not found");
  }

  const { search = "", minScore = 0 } = req.query;
  const candidates = await Customer.find({ _id: { $ne: customer._id } });
  const summary = getMatchSummary(customer, candidates, { search, minScore });
  const matches = summary.rankedMatches.slice(0, 5);

  const enrichedMatches = await Promise.all(
    matches.map(async (match) => {
      const existing = await Match.findOne({
        customer: customer._id,
        matchedCustomer: match.customer._id
      });

      const explanation =
        existing?.explanation ||
        (await geminiService.explainMatch({
          customer,
          match: match.customer,
          score: match.score,
          breakdown: match.breakdown
        }));

      await Match.findOneAndUpdate(
        {
          customer: customer._id,
          matchedCustomer: match.customer._id
        },
        {
          score: match.score,
          breakdown: match.breakdown,
          explanation,
          status: existing?.status || "recommended"
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      return {
        ...match,
        explanation
      };
    })
  );

  sendSuccess(res, {
    customer,
    matches: enrichedMatches,
    summary: {
      totalProfilesEvaluated: summary.totalProfilesEvaluated,
      totalMatchingProfiles: summary.totalMatchingProfiles,
      compatibleProfiles: summary.compatibleProfiles,
      displayedProfiles: enrichedMatches.length
    }
  });
});

module.exports = {
  getCustomers,
  getCustomerById,
  updateCustomerStatus,
  getCustomerMatches
};
