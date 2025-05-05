import { Formik, Form, Field, ErrorMessage } from "formik";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import * as Yup from "yup";
import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import ThemeSwitch from "../components/ThemeSwitch";
import { Eye, EyeOff, Lock, User, Copy } from "lucide-react";
import { toast } from "sonner"; 

const LoginForm = () => {
  const { login, isAuthenticated } = useAuth();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);

  // Credentials to copy
  const credentials = [
    { label: "Phone", value: "1234567890" },
    { label: "Password", value: "Admin@123456" }
  ];

  // Copy to clipboard function
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`${text} copied to clipboard`);
    }).catch(() => {
      toast.error("Failed to copy");
    });
  };

  // Load saved credentials on mount
  useEffect(() => {
    const savedUsername = localStorage.getItem('rememberedUsername');
    const savedRememberMe = localStorage.getItem('rememberMe') === 'true';
    if (savedUsername && savedRememberMe) {
      setInitialValues(prev => ({
        ...prev,
        username: savedUsername,
        rememberMe: true
      }));
    }
  }, []);

  const [initialValues, setInitialValues] = useState({
    username: "",
    password: "",
    rememberMe: false
  });

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        delayChildren: 0.2,
        staggerChildren: 0.1 
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4"
    >
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-5xl flex flex-col md:flex-row shadow-2xl rounded-2xl overflow-hidden dark:border dark:border-gray-700"
      >
        {/* Left Side - Animated Background */}
        <motion.div 
          variants={itemVariants}
          className="w-full md:w-1/2 relative bg-gradient-to-br from-green-600 to-emerald-600 text-white flex flex-col justify-center p-8 md:p-12 overflow-hidden"
        >
          {/* Animated Background Elements */}
          <motion.div 
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 50, 
              damping: 10 
            }}
            className="absolute -top-20 -left-20 w-72 h-72 bg-white/10 rounded-full"
          />
          <motion.div 
            initial={{ scale: 0, rotate: 180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 50, 
              damping: 10,
              delay: 0.2
            }}
            className="absolute -bottom-20 -right-20 w-96 h-96 bg-white/10 rounded-full"
          />

          <motion.h1 
            variants={itemVariants}
            className="text-2xl md:text-4xl font-bold mb-4 md:mb-6 relative z-10"
          >
            Welcome to HealthCare Hub
          </motion.h1>
          <motion.p 
            variants={itemVariants}
            className="text-lg md:text-xl mb-4 md:mb-8 relative z-10 opacity-80"
          >
            Your trusted patient management solution
          </motion.p>

          <motion.div 
            variants={itemVariants}
            className="flex items-center space-x-4 relative z-10"
          >
            <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 rounded-full flex items-center justify-center">
              <Lock className="w-6 h-6 md:w-8 md:h-8 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-base md:text-lg">Secure Login</h3>
              <p className="text-xs md:text-sm opacity-80">Advanced security measures</p>
            </div>
          </motion.div>

          {/* Credentials Section for Mobile */}
          <motion.div 
            variants={itemVariants}
            className="md:hidden mt-4 bg-white/10 rounded-lg p-4"
          >
            <button 
              onClick={() => setShowCredentials(!showCredentials)}
              className="w-full text-center py-2 rounded bg-white/20 hover:bg-white/30 transition"
            >
              {showCredentials ? "Hide" : "Show"} Test Credentials
            </button>
            {showCredentials && (
              <div className="mt-4 space-y-2">
                {credentials.map((cred) => (
                  <div 
                    key={cred.label} 
                    className="flex justify-between items-center bg-white/10 p-2 rounded"
                  >
                    <div>
                      <span className="font-semibold mr-2">{cred.label}:</span>
                      <span>{cred.value}</span>
                    </div>
                    <button 
                      onClick={() => copyToClipboard(cred.value)}
                      className="ml-2 hover:bg-white/20 p-1 rounded"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>

        {/* Right Side - Login Form */}
        <motion.div 
          variants={itemVariants}
          className="w-full md:w-1/2 bg-white dark:bg-gray-800 p-8 md:p-12 flex flex-col justify-center relative"
        >
          <div className="absolute top-4 right-4">
            <ThemeSwitch />
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={Yup.object({
              username: Yup.string().required("Username is required"),
              password: Yup.string()
                .min(6, "Password must be at least 6 characters")
                .required("Password is required"),
              rememberMe: Yup.boolean(),
            })}
            onSubmit={async (values, { setSubmitting, setFieldError }) => {
              setLoginError(null);
              try {
                await login(values);
                // Save credentials if remember me is checked
                if (values.rememberMe) {
                  localStorage.setItem('rememberedUsername', values.username);
                  localStorage.setItem('rememberMe', 'true');
                } else {
                  localStorage.removeItem('rememberedUsername');
                  localStorage.setItem('rememberMe', 'false');
                }
              } catch (error) {
                console.error("Login submission error:", error);
                
                if (axios.isAxiosError(error) && error.response) {
                  if (error.response.status === 400) {
                    setLoginError("Invalid username or password. Please try again.");
                  } else if (error.response.status === 401) {
                    setLoginError("Unauthorized. Please check your credentials.");
                  } else {
                    setLoginError(`Login failed: ${error.response.data?.message || 'Server error'}`);
                  }
                } else {
                  setLoginError("Login failed. Please try again later.");
                }
                
                setFieldError("password", "");
              } finally {
                setSubmitting(false);
              }
            }}
            enableReinitialize
          >
            {({ isSubmitting }) => (
              <Form className="space-y-6">
                <motion.h2 
                  variants={itemVariants}
                  className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-2"
                >
                  Login
                </motion.h2>
                <motion.p 
                  variants={itemVariants}
                  className="text-gray-600 dark:text-gray-300 mb-6 text-sm md:text-base"
                >
                  Enter your credentials to access your account
                </motion.p>

                {loginError && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 p-3 rounded mb-4"
                  >
                    {loginError}
                  </motion.div>
                )}

                {/* Desktop Credentials Section */}
                <div className="hidden md:block">
                  <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-4">
                    <h3 className="font-semibold mb-2 text-gray-700 dark:text-gray-200">Test Credentials</h3>
                    {credentials.map((cred) => (
                      <div 
                        key={cred.label} 
                        className="flex justify-between items-center mb-2 last:mb-0"
                      >
                        <div>
                          <span className="font-medium mr-2">{cred.label}:</span>
                          <span className="text-gray-600 dark:text-gray-300">{cred.value}</span>
                        </div>
                        <button 
                          type="button"
                          onClick={() => copyToClipboard(cred.value)}
                          className="ml-2 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                        >
                          <Copy size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <motion.div 
                  variants={itemVariants}
                  className="space-y-4"
                >
                  <div className="relative">
                    <label 
                      htmlFor="username" 
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Username
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                      <Field 
                        id="username" 
                        name="username" 
                        type="text" 
                        className="w-full pl-10 px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" 
                        autoComplete="username" 
                      />
                    </div>
                    <ErrorMessage name="username" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div className="relative">
                    <label 
                      htmlFor="password" 
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                      <Field 
                        id="password" 
                        name="password" 
                        type={showPassword ? "text" : "password"} 
                        className="w-full pl-10 px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" 
                        autoComplete="current-password" 
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <Field 
                        type="checkbox" 
                        name="rememberMe" 
                        className="rounded border-gray-300 text-green-600 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50" 
                      />
                      <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">Remember me</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Signing in..." : "Sign in"}
                  </button>
                </motion.div>
              </Form>
            )}
          </Formik>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default LoginForm;