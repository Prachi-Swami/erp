import { useEffect, useRef, useState } from "react";

const initialState = {
  email: "",
  password: "",
  remember: false,
};
export default function LoginPage() {
  const [form, setForm] = useState(initialState);
  const [touched, setTouched] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, type: "success", msg: "" });
  const toastRef = useRef(null);

  // Simple validators
  const validators = {
    email: (v) =>
      /^\S+@\S+\.\S+$/.test(v) ? "" : "Please enter a valid email address.",
    password: (v) => {
      if (v.length < 8) return "Password must be at least 8 characters.";
      if (!/[A-Z]/.test(v)) return "Include at least one uppercase letter.";
      if (!/[a-z]/.test(v)) return "Include at least one lowercase letter.";
      if (!/[0-9]/.test(v)) return "Include at least one number.";
      if (!/[!@#$%^&*(),.?":{}|<>_\-\\/~`+=\[\];']/g.test(v))
        return "Include at least one special character.";
      return "";
    },
  };

  const errors = {
    email: validators.email(form.email),
    password: validators.password(form.password),
  };

  const isValid = Object.values(errors).every((e) => e === "");

  useEffect(() => {
    // Auto-show Bootstrap Toast when state updates
    if (toast.show && toastRef.current) {
      // eslint-disable-next-line no-undef
      const t = new bootstrap.Toast(toastRef.current); // Bootstrap is global from bundle import
      t.show();
    }
  }, [toast.show]);

  const onChange = (e) => {
    const { name, type, value, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const onBlur = (e) => {
    const { name } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });

    if (!isValid) {
      setToast({ show: true, type: "danger", msg: "Please fix form errors." });
      return;
    }

    try {
      setSubmitting(true);

      // Simulate login API call
      await new Promise((r) => setTimeout(r, 900));

      // Example: check hard-coded credentials (replace with real API)
      const ok =
        form.email.toLowerCase() === "demo@site.com" &&
        form.password === "Demo@1234";

      if (ok) {
        setToast({ show: true, type: "success", msg: "Logged in successfully!" });
        // TODO: Navigate to dashboard or save token, etc.
      } else {
        setToast({
          show: true,
          type: "danger",
          msg: "Invalid email or password.",
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container" style={{ maxWidth: 480 }}>
        <div className="card shadow-sm border-0">
          <div className="card-body p-4 p-md-5">
            <h1 className="h4 fw-bold mb-3 text-center">Welcome back</h1>
            <p className="text-secondary text-center mb-4">
              Sign in to continue to your account
            </p>

            <form noValidate onSubmit={handleSubmit}>
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
                    touched.email && errors.email ? "is-invalid" : touched.email ? "is-valid" : ""
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
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={onChange}
                    onBlur={onBlur}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowPw((s) => !s)}
                    aria-label={showPw ? "Hide password" : "Show password"}
                  >
                    {showPw ? "Hide" : "Show"}
                  </button>
                  <div className="invalid-feedback d-block">
                    {touched.password && errors.password}
                  </div>
                </div>
                <div className="form-text">
                  Must be 8+ chars with uppercase, lowercase, number & special character.
                </div>
              </div>

              {/* Remember + Forgot */}
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="remember"
                    name="remember"
                    checked={form.remember}
                    onChange={onChange}
                  />
                  <label className="form-check-label" htmlFor="remember">
                    Remember me
                  </label>
                </div>
                <a href="#" className="link-primary text-decoration-none">
                  Forgot password?
                </a>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={submitting}
              >
                {submitting ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <hr className="my-4" />
            <p className="text-center mb-0">
              New here?{" "}
              <a href="#" className="link-primary text-decoration-none">
                Create an account
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Toast */}
      <div
        className="toast-container position-fixed bottom-0 end-0 p-3"
        style={{ zIndex: 1090 }}
      >
        <div
          ref={toastRef}
          className={`toast align-items-center text-bg-${
            toast.type
          } border-0 ${toast.show ? "show" : "hide"}`}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
          data-bs-delay="2200"
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
