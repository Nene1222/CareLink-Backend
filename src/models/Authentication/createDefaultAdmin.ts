// lib/createDefaultAdmin.ts
import dbConnect from "./dbConnect";
import User from "./models/User";

export async function createDefaultAdmin() {
  try {
    await dbConnect();

    const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123";
    const adminName = process.env.ADMIN_NAME || "Super Admin";

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail.toLowerCase() });
    
    if (!existingAdmin) {
      // Create admin user - DON'T hash the password manually!
      // The User model's pre-save hook will handle it
      const adminUser = new User({
        username: adminName,
        email: adminEmail.toLowerCase(),
        password: adminPassword, // Raw password - User model will hash it
        role: "admin",
        isActive: true,
        isVerified: true,
        lastLogin: new Date(),
      });

      await adminUser.save();
      console.log("✅ Default admin user created successfully");
      return adminUser;
    } else {
      console.log("ℹ️  Admin user already exists");
      return existingAdmin;
    }
  } catch (error) {
    console.error("❌ Error creating default admin:", error);
    throw error;
  }
}

// Call this function when needed (e.g., in server startup)
export async function initializeAdmin() {
  if (process.env.NODE_ENV === "development" || process.env.CREATE_ADMIN === "true") {
    await createDefaultAdmin();
  }
}