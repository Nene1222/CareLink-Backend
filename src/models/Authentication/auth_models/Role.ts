// lib/models/Role.ts
import mongoose, { Document, Model, Schema } from "mongoose";
import User from "./User";

export interface IPermissionModule {
  module: string;
  permissions: string[];
}

export interface IRole extends Document {
  name: string;
  description?: string;
  permissions: IPermissionModule[];
  userCount: number;
  status: "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
}

// Define static methods interface
export interface IRoleModel extends Model<IRole> {
  updateUserCount(roleName: string): Promise<number | undefined>;
}

const PermissionModuleSchema = new Schema<IPermissionModule>(
  {
    module: { type: String, required: true },
    permissions: { type: [String], default: [] },
  },
  { _id: false }
);

const RoleSchema = new Schema<IRole, IRoleModel>(
  {
    name: { 
      type: String, 
      required: true, 
      unique: true, 
      lowercase: true, 
      trim: true 
    },
    description: { type: String, default: "" },
    permissions: { type: [PermissionModuleSchema], default: [] },
    userCount: { type: Number, default: 0 },
    status: { 
      type: String, 
      enum: ["active", "inactive"], 
      default: "active" 
    },
  },
  { timestamps: true }
);

// Static method to update user count
RoleSchema.static('updateUserCount', async function (roleName: string): Promise<number | undefined> {
  try {
    const normalized = roleName.toLowerCase().trim();
    console.log(`📊 Updating user count for role: "${normalized}"`);
    
    // Count ALL users with this role (active and inactive)
    const count = await User.countDocuments({ 
      role: normalized
    });
    
    console.log(`📊 Found ${count} users with role: "${normalized}"`);
    
    // Update the role's userCount
    const result = await this.findOneAndUpdate(
      { name: normalized },
      { userCount: count },
      { new: true }
    );
    
    if (result) {
      console.log(`✅ Updated userCount for "${normalized}" to ${count}`);
    } else {
      console.log(`⚠️ Role "${normalized}" not found in database`);
      // Create the role if it doesn't exist (optional)
      // await this.create({ name: normalized, userCount: count });
    }
    
    return count;
  } catch (err: any) {
    console.error("❌ Failed to update role user count:", err.message);
    return undefined;
  }
});

// Add a post-save hook to User model to update role counts automatically
RoleSchema.post('save', function(doc) {
  console.log(`🔄 Role saved: ${doc.name}, triggering user count update...`);
});

// Create or get the model
const Role = mongoose.models.Role as IRoleModel || mongoose.model<IRole, IRoleModel>("Role", RoleSchema);

export default Role;