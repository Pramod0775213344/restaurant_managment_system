import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcryptjs";
import readline from "readline";
import { prisma } from "../src/lib/prisma";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const askQuestion = (query: string): Promise<string> => {
  return new Promise((resolve) => rl.question(query, resolve));
};

async function main() {
  console.log("======================================");
  console.log("   FlowPilot - Create Admin Account   ");
  console.log("======================================");

  try {
    const inputName = await askQuestion("Enter Name [Super Admin]: ");
    const name = inputName.trim() || "Super Admin";

    const inputEmail = await askQuestion("Enter Email [admin@gmail.com]: ");
    const email = inputEmail.trim() || "admin@gmail.com";

    const inputPassword = await askQuestion("Enter Password [admin123]: ");
    const password = inputPassword.trim() || "admin123";

    if (password.trim().length < 6) {
      console.error("\nError: Password must be at least 6 characters.");
      process.exit(1);
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check existing user
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      console.error(`\nError: User with email "${normalizedEmail}" already exists!`);
      process.exit(1);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Ensure Admin role exists
    const adminRole = await prisma.role.upsert({
      where: { name: "Admin" },
      update: {},
      create: { name: "Admin" },
    });

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        password_hash: hashedPassword,
        role_id: adminRole.id,
        is_active: true,
        must_change_password: true,
      },
    });

    console.log("\nAdmin user created successfully!");
    console.log("--------------------------------------");
    console.log(`ID:        ${user.id}`);
    console.log(`Name:      ${user.name}`);
    console.log(`Email:     ${user.email}`);
    console.log(`Role:      Admin (ID: ${adminRole.id})`);
    console.log(`Must Change Password: Yes`);
    console.log("--------------------------------------\n");
  } catch (error) {
    console.error("\nFailed to create admin user:", error);
    process.exit(1);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

main();
