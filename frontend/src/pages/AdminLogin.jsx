import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../services/userServices';
import CustomAlert from '../components/CustomAlert';
import { useCustomAlert } from '../hooks/useCustomAlert';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { alert, showError, showSuccess, hideAlert } = useCustomAlert();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setError(''); // Clear error when user starts typing
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await adminLogin(formData);
      
      localStorage.setItem('adminUser', JSON.stringify(response.user));
      localStorage.setItem('isAdminLoggedIn', 'true');
      
      navigate('/admin/dashboard');
      
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="h-screen bg-slate-50 flex items-center justify-center p-4 overflow-hidden">
      <div className="max-w-6xl w-full h-full max-h-[90vh] grid grid-cols-1 lg:grid-cols-2 bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Left Side - Branding */}
        <div className="bg-slate-900 p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-10 right-10 w-32 h-32 border-2 border-amber-500 rounded-full"></div>
            <div className="absolute bottom-20 left-10 w-24 h-24 border-2 border-amber-500 rotate-45"></div>
            <div className="absolute top-1/2 left-1/2 w-40 h-40 border border-amber-500 rounded-full"></div>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                <svg className="w-6 h-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-white">EventHub</span>
            </div>

            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Admin
              <span className="block text-amber-500">Dashboard</span>
            </h1>
            
            <p className="text-slate-300 text-base lg:text-lg leading-relaxed mb-6">
              Manage your events, users, and analytics with our powerful admin tools. 
              Streamline your workflow and make data-driven decisions.
            </p>
          </div>

          <div className="relative z-10">
            <div className="flex items-center space-x-4 text-slate-300">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-amber-500 rounded-full mr-2"></div>
                <span>Secure Access</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-amber-500 rounded-full mr-2"></div>
                <span>Real-time Data</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="p-6 lg:p-12 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto">
            <div className="text-center mb-6">
              <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">Welcome Back</h2>
              <p className="text-slate-600">Sign in to your admin account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="h-8">
                {error && (
                  <div className="p-2 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-xs text-red-600">{error}</p>
                  </div>
                )}
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="off"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
                    placeholder="Enter your email"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="off"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
                    placeholder="Enter your password"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-slate-900 text-white py-2 px-4 rounded-lg font-semibold hover:bg-slate-800 focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Signing in...
                  </>
                ) : (
                  'Sign in to Dashboard'
                )}
              </button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-center mb-1">
                <svg className="w-4 h-4 text-amber-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xs font-semibold text-amber-800">Demo Access</h3>
              </div>
              <div className="text-xs text-amber-700 space-y-1">
                <p>Email: <code className="bg-white px-1 py-0.5 rounded border ml-1">john.Doe@gmail.com</code></p>
                <p>Password: <code className="bg-white px-1 py-0.5 rounded border ml-1">john123</code></p>
              </div>
            </div>

            {/* Back to Home */}
            <div className="mt-4 text-center">
              <button
                onClick={handleBackToHome}
                className="inline-flex items-center text-slate-600 hover:text-slate-900 transition-colors duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to EventHub
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Alert */}
      <CustomAlert
        isOpen={alert.isOpen}
        onClose={hideAlert}
        title={alert.title}
        message={alert.message}
        type={alert.type}
        confirmText={alert.confirmText}
        showIcon={alert.showIcon}
        showConfirm={alert.showConfirm}
      />
    </div>
  );
};

export default AdminLogin;