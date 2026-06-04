const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Customer = require("../models/Customer");
const User = require("../models/User");
const Match = require("../models/Match");
const env = require("../config/env");
const data = require("./profileData");

const pick = (items, index, offset = 0) => items[(index + offset) % items.length];
const numberInRange = (min, max, index, multiplier = 7) => min + ((index * multiplier) % (max - min + 1));

const dateFromAge = (age, index) => {
  const birthYear = new Date().getFullYear() - age;
  const month = index % 12;
  const day = (index % 27) + 1;
  return new Date(birthYear, month, day);
};

const buildLanguages = (index) => {
  const primary = pick(data.languages, index);
  const secondary = pick(data.languages, index, 3);
  const tertiary = index % 3 === 0 ? pick(data.languages, index, 6) : null;
  return [...new Set(["English", primary, secondary, tertiary].filter(Boolean))];
};

const emailPart = (value) => value.toLowerCase().replace(/[^a-z0-9]/g, "");

const createProfile = (index) => {
  const gender = index % 2 === 0 ? "Male" : "Female";
  const religion = pick(data.religions, index, 3);
  const firstName = pick(data.firstNamesByReligion[religion][gender], index);
  const lastName = pick(data.lastNamesByReligion[religion], index, gender === "Male" ? 2 : 5);
  const location = pick(data.locations, index, 2);
  const age = numberInRange(gender === "Male" ? 27 : 24, gender === "Male" ? 40 : 36, index, 5);
  const degree = pick(data.degrees, index, 4);
  const profession = pick(data.professions, index, 6);
  const company = pick(data.companies, index, 1);
  const income = numberInRange(650000, 4500000, index, 137000);
  const languagesKnown = buildLanguages(index);
  const email = `${emailPart(firstName)}.${emailPart(lastName)}.${index + 1}@example.com`;

  return {
    firstName,
    lastName,
    gender,
    dateOfBirth: dateFromAge(age, index),
    age,
    country: "India",
    city: location.city,
    state: location.state,
    height: gender === "Male" ? numberInRange(165, 188, index, 3) : numberInRange(152, 174, index, 4),
    email,
    phoneNumber: `+91${numberInRange(7000000000, 9999999999, index, 92837)}`,
    undergraduateCollege: pick(data.colleges, index, 8),
    degree,
    education: degree,
    income,
    currentCompany: company,
    company,
    designation: profession,
    profession,
    maritalStatus: index % 9 === 0 ? pick(data.maritalStatuses, index, 1) : "Never Married",
    languagesKnown,
    languages: languagesKnown,
    siblings: index % 4,
    caste: pick(data.castes, index, 2),
    religion,
    wantKids: pick(data.preferenceValues, index),
    childrenPreference: pick(data.preferenceValues, index),
    openToRelocate: pick(data.preferenceValues, index, 1),
    relocationPreference: pick(data.preferenceValues, index, 1),
    openToPets: pick(data.preferenceValues, index, 2),
    petsPreference: pick(data.preferenceValues, index, 2),
    statusTag: pick(data.statusTags, index),
    statusHistory: [
      {
        status: pick(data.statusTags, index),
        note: "Initial seeded status",
        changedBy: "System",
        changedAt: new Date()
      }
    ],
    bio: `${firstName} is a ${profession.toLowerCase()} based in ${location.city}, looking for a compatible partner with aligned values and lifestyle preferences.`
  };
};

const seededProfiles = Array.from({ length: 100 }, (_, index) => createProfile(index));

const seedCustomers = async ({ reset = false } = {}) => {
  if (reset) {
    await Promise.all([Customer.deleteMany({}), Match.deleteMany({}), User.deleteMany({})]);
  }

  const existingCustomers = await Customer.countDocuments();
  if (existingCustomers > 0) {
    console.log(`Skipping seed: ${existingCustomers} customers already exist`);
    return;
  }

  await Customer.insertMany(seededProfiles);
  await User.findOneAndUpdate(
    { email: env.dummyAuthEmail },
    {
      name: "Matchmaking Employee",
      email: env.dummyAuthEmail,
      password: env.dummyAuthPassword,
      role: "employee"
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  console.log("Seeded 100 customers and 1 dummy employee user");
};

const seed = async () => {
  await connectDB();

  await seedCustomers({ reset: true });
  await mongoose.connection.close();
};

if (require.main === module) {
  seed().catch(async (error) => {
    console.error("Seeding failed:", error);
    await mongoose.connection.close();
    process.exit(1);
  });
}

module.exports = { createProfile, seededProfiles, seedCustomers };
