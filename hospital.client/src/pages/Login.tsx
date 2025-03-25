import { Formik, Form, Field, ErrorMessage } from "formik";
import { useAuth } from "../context/AuthContext";
import * as Yup from "yup";
import { LoginCredentials } from "../types/LoginCredentials";
import { Navigate } from "react-router-dom";
import "../assets/css/LoginForm.css";

const LoginForm = () => {
  const { login, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="login-container">
      <h2>Login</h2>
      <Formik
        initialValues={{ username: "", password: "", rememberMe: false }}
        validationSchema={Yup.object({
          username: Yup.string().required("Username is required"),
          password: Yup.string()
            .min(6, "Password must be at least 6 characters")
            .required("Password is required"),
          rememberMe: Yup.boolean(),
        })}
        onSubmit={async (values, { setSubmitting, setFieldError }) => {
          try {
            await login(values);
          } catch (error) {
            setFieldError("password", "Invalid username or password");
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className="login-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <Field id="username" name="username" type="text" className="input" />
              <ErrorMessage name="username" component="div" className="error-message" />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <Field id="password" name="password" type="password" className="input" />
              <ErrorMessage name="password" component="div" className="error-message" />
            </div>

            <div className="remember-me-group">
              <Field id="rememberMe" name="rememberMe" type="checkbox" className="remember-me-checkbox" />
              <label htmlFor="rememberMe" className="remember-me-label">Remember me</label>
            </div>

            <button type="submit" disabled={isSubmitting} className="submit-button">
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default LoginForm;
