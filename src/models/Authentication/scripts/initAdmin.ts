// lib/scripts/initAdmin.ts
import { createDefaultAdmin } from '../createDefaultAdmin';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ 
  path: path.resolve(process.cwd(), '.env.local') 
});

async function init() {
  try {
    console.log('🚀 Initializing default admin...');
    console.log('📧 Admin Email:', process.env.ADMIN_EMAIL);
    console.log('🔑 Admin Password:', process.env.ADMIN_PASSWORD ? '***' : 'Not set');
    
    const admin = await createDefaultAdmin();
    
    if (admin) {
      console.log('✅ Admin user initialized successfully!');
      console.log('📋 Admin Details:');
      console.log('   - ID:', admin._id);
      console.log('   - Email:', admin.email);
      console.log('   - Role:', admin.role);
      console.log('   - Username:', admin.username);
      console.log('\n⚠️  IMPORTANT:');
      console.log('   - Save these credentials securely');
      console.log('   - Change the password after first login');
      console.log('   - Store .env file securely');
      console.log('\n🔑 Default password:', process.env.ADMIN_PASSWORD || 'Admin@123');
    } else {
      console.log('ℹ️  Admin already exists in database');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to initialize admin:', error);
    process.exit(1);
  }
}

// Only run if called directly
if (require.main === module) {
  init();
}

// For module import
export default init;