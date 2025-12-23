import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Mail,
  Calendar
} from 'lucide-react';

const Profile: React.FC = () => {
  const { state } = useAuth();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <User className="w-8 h-8 text-blue-600" />
          Profile
        </h1>
        <p className="text-gray-600 mt-2">
          View your account information
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Overview Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              {/* Avatar */}
              <div className="relative inline-block mb-4">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                  <User className="w-12 h-12 text-white" />
                </div>
              </div>

              {/* User Info */}
              <h2 className="text-xl font-semibold text-gray-900 mb-1">
                {state.user?.name}
              </h2>
              <p className="text-gray-600 mb-4">{state.user?.email}</p>

              {/* Account Stats */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">0</div>
                    <div className="text-sm text-gray-600">Patients</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">0</div>
                    <div className="text-sm text-gray-600">Appointments</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Account Information</h3>

            <div className="space-y-6">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <User className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-900">{state.user?.name}</span>
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-900">{state.user?.email}</span>
                </div>
              </div>

              {/* Account Information */}
              <div className="pt-6 border-t border-gray-200">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Account Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-600">Member Since</div>
                      <div className="font-medium text-gray-900">
                        {new Date().toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;