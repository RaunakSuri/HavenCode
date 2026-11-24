import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router';
import { registerUser } from '../authSlice';
import { useEffect, useState } from 'react';

const signupSchema = z.object({
  firstName: z.string().min(3, 'First name must be at least 3 characters'),
  emailId: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

function SignupPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(signupSchema) });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = (data) => {
    dispatch(registerUser(data));
  };

  return (
    <div className="min-h-screen bg-[#0F131E] flex flex-col md:flex-row font-sans">
      {/* Left Brand Showcase Column */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0A0E19] via-[#0F131E] to-[#0B1120] p-12 flex-col justify-between relative overflow-hidden text-white border-r border-[#263049]">
        {/* Modern Dark ambient glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#3B82F6]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#22D3EE]/8 rounded-full blur-3xl pointer-events-none"></div>

        {/* Top: Brand Logo */}
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#3B82F6] to-[#22D3EE] flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.3)] font-black text-[#0A0E19] text-base">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" />
              </svg>
            </div>
            <span className="font-display font-bold text-2xl tracking-tight text-[#DFE2F2]">
              HavenCode
            </span>
          </Link>
        </div>

        {/* Center: Hero Typography & Feature Highlights */}
        <div className="relative z-10 max-w-lg my-auto py-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#262A36] border border-[#424754]/40 text-[#5DE6FF] mb-6">
            <span>🚀</span> Start Your Practice Journey
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-[#DFE2F2] leading-tight mb-4">
            Build your problem-solving skills.
          </h1>
          <p className="text-[#94A3B8] text-base leading-relaxed mb-8">
            Create an account to solve problems, track your progress, and pick up where you left off.
          </p>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#171B27]/80 backdrop-blur-md rounded-2xl p-4 border border-[#263049] shadow-soft">
              <div className="w-8 h-8 rounded-xl bg-[#3B82F6]/15 text-[#5DE6FF] flex items-center justify-center text-sm font-bold mb-2">
                📚
              </div>
              <h3 className="font-display font-bold text-sm text-[#DFE2F2]">Problem Library</h3>
              <p className="text-xs text-[#94A3B8] mt-1">Practice problems across topics and difficulty levels.</p>
            </div>
            <div className="bg-[#171B27]/80 backdrop-blur-md rounded-2xl p-4 border border-[#263049] shadow-soft">
              <div className="w-8 h-8 rounded-xl bg-[#3B82F6]/15 text-[#5DE6FF] flex items-center justify-center text-sm font-bold mb-2">
                📈
              </div>
              <h3 className="font-display font-bold text-[#DFE2F2] text-sm">Progress Tracking</h3>
              <p className="text-xs text-[#94A3B8] mt-1">See solved problems and track your progress over time.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Form Column */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 lg:p-16 bg-[#0F131E]">
        <div className="w-full max-w-md">
          {/* Mobile Brand Header */}
          <div className="lg:hidden flex justify-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#3B82F6] to-[#22D3EE] flex items-center justify-center shadow-[0_0_16px_rgba(34,211,238,0.3)] text-[#0A0E19] font-bold text-lg">
                H
              </div>
              <span className="font-display font-bold text-xl text-[#DFE2F2]">HavenCode</span>
            </Link>
          </div>

          {/* Form Card */}
          <div className="bg-[#171B27] rounded-3xl p-8 sm:p-10 border border-[#263049] shadow-soft">
            <div className="mb-6">
              <h2 className="font-display text-2xl font-extrabold text-[#DFE2F2] tracking-tight">
                Create Your Account
              </h2>
              <p className="text-sm text-[#94A3B8] mt-1">
                Start solving problems and tracking your progress.
              </p>
            </div>

            {/* Error Message
            {error && (
              <div className="mb-5 p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-400 text-xs font-medium">
                {typeof error === 'string' ? error : error.message || 'Registration failed.'}
              </div>
            )} */}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* First Name */}
              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
                  First Name
                </label>
                <input
                  type="text"
                  placeholder="Alex"
                  className={`w-full px-4 py-2.5 rounded-xl text-sm bg-[#0A0E19] border ${
                    errors.firstName ? 'border-rose-500/50' : 'border-[#263049]'
                  } focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 transition-all text-[#DFE2F2] placeholder:text-[#64748B]`}
                  {...register('firstName')}
                />
                {errors.firstName && (
                  <span className="text-rose-400 text-xs mt-1 block">
                    {errors.firstName.message}
                  </span>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="alex@example.com"
                  className={`w-full px-4 py-2.5 rounded-xl text-sm bg-[#0A0E19] border ${
                    errors.emailId ? 'border-rose-500/50' : 'border-[#263049]'
                  } focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 transition-all text-[#DFE2F2] placeholder:text-[#64748B]`}
                  {...register('emailId')}
                />
                {errors.emailId && (
                  <span className="text-rose-400 text-xs mt-1 block">
                    {errors.emailId.message}
                  </span>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
                  Password
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="At least 8 characters"
                    className={`w-full px-4 py-2.5 pr-14 rounded-xl text-sm bg-[#0A0E19] border ${
                      errors.password ? 'border-rose-500/50' : 'border-[#263049]'
                    } focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 transition-all text-[#DFE2F2] placeholder:text-[#64748B]`}
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-2 px-2.5 py-1 text-xs font-medium text-[#64748B] hover:text-[#DFE2F2] rounded-lg hover:bg-[#262A36] transition-colors"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                {errors.password && (
                  <span className="text-rose-400 text-xs mt-1 block">
                    {errors.password.message}
                  </span>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl font-bold text-sm text-[#0A0E19] bg-gradient-to-r from-[#3B82F6] to-[#22D3EE] shadow-[0_0_24px_-4px_rgba(34,211,238,0.4)] hover:shadow-[0_0_32px_0px_rgba(34,211,238,0.65)] hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-[#0A0E19] border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </div>

              {/* Toggle to Login */}
              <p className="text-center text-xs text-[#64748B] mt-5">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-semibold text-[#5DE6FF] hover:text-[#ADC6FF] hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
