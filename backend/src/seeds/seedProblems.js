import "dotenv/config";
import mongoose from "mongoose";
import { useMongoose } from "../db/db.js";
import { Problem } from "../models/problem.model.js";
import { User } from "../models/user.model.js";
import { seedProblems } from "./problemData.js";

const REQUIRED_LANGUAGES = ["c++", "java", "python", "javascript"];
const FORBIDDEN_PLACEHOLDERS = [
  "...",
  "---",
  "TODO",
  "implement here",
  "write your solution",
];

function validateProblem(problem, index) {
  const prefix = `[Problem ${index + 1}: "${problem.title || "Untitled"}"]`;

  if (!problem.title || typeof problem.title !== "string") {
    throw new Error(`${prefix} Missing or invalid title.`);
  }
  if (!problem.description || typeof problem.description !== "string") {
    throw new Error(`${prefix} Missing or invalid description.`);
  }
  if (!["easy", "medium", "hard"].includes(problem.difficulty)) {
    throw new Error(`${prefix} Invalid difficulty: ${problem.difficulty}`);
  }
  if (!problem.visibleTestCases || problem.visibleTestCases.length === 0) {
    throw new Error(`${prefix} Must have at least 1 visible test case.`);
  }
  if (!problem.hiddenTestCases || problem.hiddenTestCases.length === 0) {
    throw new Error(`${prefix} Must have at least 1 hidden test case.`);
  }

  // Validate startCode
  if (!Array.isArray(problem.startCode) || problem.startCode.length !== 4) {
    throw new Error(`${prefix} startCode must contain all 4 supported languages.`);
  }
  for (const lang of REQUIRED_LANGUAGES) {
    const entry = problem.startCode.find((sc) => sc.language === lang);
    if (!entry || !entry.initialCode || entry.initialCode.trim().length === 0) {
      throw new Error(`${prefix} Missing or empty startCode for language: ${lang}`);
    }
  }

  // Validate referenceSolution
  if (!Array.isArray(problem.referenceSolution) || problem.referenceSolution.length !== 4) {
    throw new Error(`${prefix} referenceSolution must contain all 4 supported languages.`);
  }
  for (const lang of REQUIRED_LANGUAGES) {
    const entry = problem.referenceSolution.find((rs) => rs.language === lang);
    if (!entry || !entry.completeCode || entry.completeCode.trim().length === 0) {
      throw new Error(`${prefix} Missing or empty completeCode for referenceSolution: ${lang}`);
    }

    const code = entry.completeCode;
    for (const placeholder of FORBIDDEN_PLACEHOLDERS) {
      if (code.includes(placeholder)) {
        throw new Error(
          `${prefix} Reference solution for '${lang}' contains prohibited placeholder '${placeholder}'.`
        );
      }
    }
  }
}

async function seedDatabase() {
  console.log("=========================================");
  console.log("   HavenCode Database Problem Seeder     ");
  console.log("=========================================\n");

  try {
    // 1. Pre-validation of problem dataset
    console.log("🔍 Validating problem data integrity...");
    seedProblems.forEach((problem, index) => validateProblem(problem, index));
    console.log(`✅ Pre-validation passed for all ${seedProblems.length} problems.\n`);

    // 2. Connect to MongoDB
    console.log("🔌 Connecting to MongoDB...");
    await useMongoose();
    console.log("✅ MongoDB connected successfully.\n");

    // 3. Find problemCreator (admin user)
    let creator = await User.findOne({ role: "admin" });
    if (!creator) {
      creator = await User.findOne({});
    }

    if (!creator) {
      throw new Error(
        "No existing user found in the database. Please ensure at least one user exists to act as problemCreator."
      );
    }

    console.log(`👤 Using user '${creator.firstName} ${creator.lastName || ""}' (${creator.emailId}, ID: ${creator._id}) as problemCreator.\n`);

    // 4. Seed / Upsert problems
    let insertedCount = 0;
    let updatedCount = 0;

    for (const pData of seedProblems) {
      const existing = await Problem.findOne({ title: pData.title });
      const problemDoc = {
        ...pData,
        problemCreator: creator._id,
      };

      await Problem.findOneAndUpdate(
        { title: pData.title },
        problemDoc,
        { upsert: true, returnDocument: "after", runValidators: true }
      );

      if (existing) {
        console.log(`  🔄 Updated:  "${pData.title}" [${pData.difficulty.toUpperCase()} | ${pData.tags}]`);
        updatedCount++;
      } else {
        console.log(`  ➕ Inserted: "${pData.title}" [${pData.difficulty.toUpperCase()} | ${pData.tags}]`);
        insertedCount++;
      }
    }

    console.log("\n=========================================");
    console.log("           Seeding Summary               ");
    console.log("=========================================");
    console.log(`Total Problems in Seed : ${seedProblems.length}`);
    console.log(`Newly Inserted         : ${insertedCount}`);
    console.log(`Updated (Existing)     : ${updatedCount}`);

    const totalInDb = await Problem.countDocuments();
    console.log(`Total Problems in DB   : ${totalInDb}`);
    console.log("=========================================\n");
    console.log("🎉 Seeding completed successfully!");

  } catch (error) {
    console.error("\n❌ Seeding failed with error:", error.message || error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log("🔌 MongoDB disconnected.");
  }
}

seedDatabase();
