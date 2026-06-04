const professionGroup = (profession = "") => {
  const value = profession.toLowerCase();
  if (["engineer", "developer", "architect", "data", "product", "designer"].some((term) => value.includes(term))) {
    return "technology";
  }
  if (["doctor", "dentist", "surgeon", "pharmacist", "health"].some((term) => value.includes(term))) {
    return "healthcare";
  }
  if (["finance", "analyst", "banker", "accountant", "consultant"].some((term) => value.includes(term))) {
    return "business";
  }
  if (["lawyer", "advocate", "legal"].some((term) => value.includes(term))) {
    return "legal";
  }
  if (["teacher", "professor", "research"].some((term) => value.includes(term))) {
    return "education";
  }
  return "other";
};

const normalize = (value = "") => String(value).trim().toLowerCase();

const hasCommonLanguage = (aLanguages = [], bLanguages = []) => {
  const aSet = new Set(aLanguages.map((language) => language.toLowerCase()));
  return bLanguages.some((language) => aSet.has(language.toLowerCase()));
};

const isDirectionalAgeCompatible = (customer, candidate) => {
  if (customer.gender === "Male") {
    return candidate.gender === "Female" && candidate.age < customer.age;
  }

  if (customer.gender === "Female") {
    return candidate.gender === "Male" && candidate.age > customer.age;
  }

  return false;
};

const isDirectionalHeightCompatible = (customer, candidate) => {
  if (customer.gender === "Male") {
    return candidate.gender === "Female" && candidate.height < customer.height;
  }

  if (customer.gender === "Female") {
    return candidate.gender === "Male" && candidate.height > customer.height;
  }

  return false;
};

const isDirectionalIncomeCompatible = (customer, candidate) => {
  if (customer.gender === "Male") {
    return candidate.gender === "Female" && candidate.income < customer.income;
  }

  if (customer.gender === "Female") {
    return candidate.gender === "Male" && candidate.income > customer.income;
  }

  return false;
};

const calculateTieBreaker = (customer, candidate) => {
  let score = 0;

  if (normalize(customer.education) === normalize(candidate.education) || normalize(customer.degree) === normalize(candidate.degree)) {
    score += 1;
  }

  if (professionGroup(customer.profession) === professionGroup(candidate.profession)) {
    score += 1;
  }

  return score;
};

const matchesSearch = (candidate, search = "") => {
  if (!search) return true;

  const value = normalize(search);
  const searchable = [
    candidate.firstName,
    candidate.lastName,
    candidate.city,
    candidate.state,
    candidate.religion,
    candidate.profession,
    candidate.education,
    candidate.degree,
    ...(candidate.languagesKnown || [])
  ]
    .map(normalize)
    .join(" ");

  return searchable.includes(value);
};

const calculateCompatibility = (customer, candidate) => {
  const breakdown = {
    age: isDirectionalAgeCompatible(customer, candidate) ? 20 : 0,
    height: isDirectionalHeightCompatible(customer, candidate) ? 15 : 0,
    income: isDirectionalIncomeCompatible(customer, candidate) ? 15 : 0,
    childrenPreference: customer.wantKids === candidate.wantKids ? 20 : 0,
    religion: customer.religion === candidate.religion ? 10 : 0,
    language: hasCommonLanguage(customer.languagesKnown, candidate.languagesKnown) ? 5 : 0,
    location: customer.city === candidate.city ? 5 : customer.state === candidate.state ? 3 : 0,
    relocationPreference: customer.openToRelocate === candidate.openToRelocate ? 5 : 0,
    petsPreference: customer.openToPets === candidate.openToPets ? 5 : 0
  };

  const score = Object.values(breakdown).reduce((sum, value) => sum + value, 0);

  return {
    score,
    percentage: score,
    breakdown
  };
};

const getRankedMatches = (customer, candidates, options = {}) => {
  const { search = "", minScore = 0 } = options;

  return candidates
    .filter((candidate) => String(candidate._id) !== String(customer._id) && candidate.gender !== customer.gender)
    .filter((candidate) => matchesSearch(candidate, search))
    .map((candidate) => {
      const compatibility = calculateCompatibility(customer, candidate);
      return {
        customer: candidate,
        score: compatibility.score,
        percentage: compatibility.percentage,
        breakdown: compatibility.breakdown,
        tieBreaker: calculateTieBreaker(customer, candidate)
      };
    })
    .filter((match) => match.score >= Number(minScore || 0))
    .sort((a, b) => b.score - a.score || b.tieBreaker - a.tieBreaker)
    .map(({ tieBreaker, ...match }) => match);
};

const getTopMatches = (customer, candidates, limit = 5, options = {}) => {
  return getRankedMatches(customer, candidates, options)
    .slice(0, limit)
};

const getMatchSummary = (customer, candidates, options = {}) => {
  const oppositeGenderCandidates = candidates.filter(
    (candidate) => String(candidate._id) !== String(customer._id) && candidate.gender !== customer.gender
  );
  const rankedMatches = getRankedMatches(customer, candidates, options);

  return {
    rankedMatches,
    totalProfilesEvaluated: oppositeGenderCandidates.length,
    totalMatchingProfiles: rankedMatches.length,
    compatibleProfiles: rankedMatches.filter((match) => match.score > 0).length
  };
};

module.exports = {
  calculateCompatibility,
  getTopMatches,
  getRankedMatches,
  getMatchSummary
};
