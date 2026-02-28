import { db } from "./utils/db.js";
import { userProfiles } from "./utils/schema.js";

async function checkUsers() {
  try {
    const users = await db.select().from(userProfiles);
    console.log("Current users in database:");
    users.forEach((user) => {
      console.log(
        `- ID: ${user.id}, Clerk ID: ${user.clerkUserId}, Email: ${user.email}, Onboarded: ${user.hasOnboarded}`
      );
    });
  } catch (error) {
    console.error("Error checking users:", error);
  }
  process.exit();
}

checkUsers();
