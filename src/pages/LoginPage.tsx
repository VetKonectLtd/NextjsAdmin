import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/use-auth-store';
import { Button } from '@/components/ui/button';
import FormInput from '@/components/ui/form-input';
import { Loader2 } from 'lucide-react';
import LogoIcon from '@/assets/logo.svg?react';

export function LoginPage() {
  const [staffId, setStaffId] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, error } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login({ staff_id: staffId, password });
      navigate(from, { replace: true });
    } catch {
      // Error is handled by the store and global toast
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md px-6">
        {/* Logo / Branding */}
        <div className="text-center mb-8 flex flex-col items-center">
          <LogoIcon className="w-16 h-16 mb-3" />
          <h1 className="text-3xl font-bold text-green-600">Vet Konnect</h1>
          <p className="text-gray-500 mt-2">Admin Dashboard</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Welcome back</h2>
            <p className="text-gray-500 text-sm mt-1">
              Enter your credentials to access your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <FormInput
              label="Staff ID"
              value={staffId}
              onChange={(e) => setStaffId(e.target.value)}
              required
              disabled={isSubmitting}
              autoComplete="username"
            />

            <FormInput
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isSubmitting}
              autoComplete="current-password"
            />

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-green-500 hover:bg-green-600 text-white py-6 text-base font-semibold transition-colors"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-400 text-sm mt-6">
          © {new Date().getFullYear()} VetKonnect. All rights reserved.
        </p>
      </div>
    </div>
  );
}
