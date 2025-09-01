
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const initialState = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export default function SignupPage() {
  const [form, setForm] = useState(initialState);
  const [touched, setTouched] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, type: "success", msg: "" });
  const toastRef = useRef(null);
  const navigate = useNavigate();

  // Validators 
  const validators = {
    name: (v) => (v && v.trim().length >= 2 ? "" : "Please enter your full name."),
    email: (v) =>
      /^\S+@\S+\.\S+$/.test(v) ? "" : "Please enter a valid email address.",
    password: (v) => {
      if (v.length < 8) return "Password must be at least 8 characters.";
      if (!/[A-Z]/.test(v)) return "Include at least one uppercase letter.";
      if (!/[a-z]/.test(v)) return "Include at least one lowercase letter.";
      if (!/[0-9]/.test(v)) return "Include at least one number.";
      if (!/[!@#$%^&*(),.?":{}|<>_\-\\/~`+=\[\];']/.test(v))
        return "Include at least one special character.";
      return "";
    },
    confirmPassword: (v) => (v === form.password ? "" : "Passwords do not match."),
  };

  const errors = {
    name: validators.name(form.name),
    email: validators.email(form.email),
    password: validators.password(form.password),
    confirmPassword: validators.confirmPassword(form.confirmPassword),
  };

  const isValid = Object.values(errors).every((e) => e === "");

 
  useEffect(() => {
    if (!toast.show || !toastRef.current) return;
    const toastEl = toastRef.current;

    if (window.bootstrap?.Toast) {
      const t = new window.bootstrap.Toast(toastEl, { delay: 2000 });
      t.show();
    } else {
      
      const id = setTimeout(() => setToast((s) => ({ ...s, show: false })), 2000);
      return () => clearTimeout(id);
    }
  }, [toast.show]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onBlur = (e) => setTouched((t) => ({ ...t, [e.target.name]: true }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, password: true, confirmPassword: true });

    if (!isValid) {
      setToast({ show: true, type: "danger", msg: "Please fix form errors." });
      return;
    }

    try {
      setSubmitting(true);

      // Simulate API call 
      await new Promise((r) => setTimeout(r, 300));

      // Show success toast
      setToast({ show: true, type: "success", msg: "User created successfully!" });


      setTimeout(() => {
        navigate("/login", {
          replace: true,
          state: { justSignedUp: true, email: form.email },
        });
      }, 900);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container" style={{ maxWidth: 520 }}>
        <div className="card shadow-sm border-0">
          <div className="card-body p-4 p-md-5">
            <h1 className="h4 fw-bold mb-3 text-center">Create your account</h1>
            <p className="text-secondary text-center mb-4">
              Use your email and set a strong password
            </p>

            <form noValidate onSubmit={handleSubmit}>
              {/* Name */}
              <div className="mb-3">
                <label htmlFor="name" className="form-label fw-semibold">
                  Full name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className={`form-control ${
                    touched.name && errors.name
                      ? "is-invalid"
                      : touched.name
                      ? "is-valid"
                      : ""
                  }`}
                  placeholder="Your name"
                  value={form.name}
                  onChange={onChange}
                  onBlur={onBlur}
                  autoComplete="name"
                />
                <div className="invalid-feedback">{errors.name}</div>
              </div>

              {/* Email */}
              <div className="mb-3">
                <label htmlFor="email" className="form-label fw-semibold">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className={`form-control ${
                    touched.email && errors.email
                      ? "is-invalid"
                      : touched.email
                      ? "is-valid"
                      : ""
                  }`}
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={onChange}
                  onBlur={onBlur}
                  autoComplete="email"
                />
                <div className="invalid-feedback">{errors.email}</div>
              </div>

              {/* Password */}
              <div className="mb-3">
                <label htmlFor="password" className="form-label fw-semibold">
                  Password
                </label>
                <div className="input-group">
                  <input
                    id="password"
                    name="password"
                    type={showPw ? "text" : "password"}
                    className={`form-control ${
                      touched.password && errors.password
                        ? "is-invalid"
                        : touched.password
                        ? "is-valid"
                        : ""
                    }`}
                    placeholder="Create a strong password"
                    value={form.password}
                    onChange={onChange}
                    onBlur={onBlur}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowPw((s) => !s)}
                    aria-label={showPw ? "Hide password" : "Show password"}
                  >
                    {showPw ? "Hide" : "Show"}
                  </button>
                </div>
                <div className="invalid-feedback d-block">
                  {touched.password && errors.password}
                </div>
                <div className="form-text">
                  Must be 8+ chars with uppercase, lowercase, number & special character.
                </div>
              </div>

              {/* Confirm Password */}
              <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label fw-semibold">
                  Confirm password
                </label>
                <div className="input-group">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPw2 ? "text" : "password"}
                    className={`form-control ${
                      touched.confirmPassword && errors.confirmPassword
                        ? "is-invalid"
                        : touched.confirmPassword
                        ? "is-valid"
                        : ""
                    }`}
                    placeholder="Re-type your password"
                    value={form.confirmPassword}
                    onChange={onChange}
                    onBlur={onBlur}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowPw2((s) => !s)}
                    aria-label={showPw2 ? "Hide password" : "Show password"}
                  >
                    {showPw2 ? "Hide" : "Show"}
                  </button>
                </div>
                <div className="invalid-feedback d-block">
                  {touched.confirmPassword && errors.confirmPassword}
                </div>
              </div>

              {/* Submit */}
              <button type="submit" className="btn btn-primary w-100" disabled={submitting}>
                {submitting ? "Creating account…" : "Create account"}
              </button>
            </form>

            <hr className="my-4" />
            <p className="text-center mb-0">
              Already have an account?{" "}
              <Link to="/login" className="link-primary text-decoration-none">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Toast */}
      <div className="toast-container position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1090 }}>
        <div
          ref={toastRef}
          className={`toast align-items-center text-bg-${toast.type} border-0 ${
            toast.show ? "show" : "hide"
          }`}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
          data-bs-delay="2000"
        >
          <div className="d-flex">
            <div className="toast-body">{toast.msg}</div>
            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              data-bs-dismiss="toast"
              aria-label="Close"
              onClick={() => setToast((t) => ({ ...t, show: false }))}
            ></button>
          </div>
        </div>
      </div>
    </div>
  );
}
