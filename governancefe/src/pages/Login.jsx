
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api";
import "../styles/Login.css";

function Login() {
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    if (isRegister && !name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    setLoading(true);

    try {
      if (isRegister) {
        // Register citizen in Spring Boot
        await apiRequest("/auth/register", {
          method: "POST",
          body: JSON.stringify({
            name: name.trim(),
            email: normalizedEmail,
            password,
          }),
        });

        // Registration ke baad normal login
      }

      const loginResponse = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: normalizedEmail,
          password,
        }),
      });

      if (!loginResponse.token) {
        throw new Error("Login successful, but token was not received.");
      }

      const currentUser = {
        id: loginResponse.id,
        name: loginResponse.name,
        email: loginResponse.email,
        role: String(loginResponse.role).toLowerCase(),
      };

      // Save JWT and user details
      localStorage.setItem("civicToken", loginResponse.token);
      localStorage.setItem(
        "civicCurrentUser",
        JSON.stringify(currentUser)
      );

      // Clean up old demo users if present
      localStorage.removeItem("civicUsers");

      navigate("/citizen/dashboard");
    } catch (err) {
      setError(
        err.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <header className="login-navbar">
        <Link to="/" className="brand">
          <span>🏛️</span>
          CivicConnect
        </Link>

        <Link to="/" className="back-home">
          ← Back to Home
        </Link>
      </header>

      <main className="login-layout">
        <section className="login-intro">
          <span className="section-tag">CITIZEN PORTAL</span>

          <h1>
            Your city.
            <br />
            Your voice.
            <br />
            <span>Your impact.</span>
          </h1>

          <p>
            Report local problems, upload photos, and
            track the progress of your complaints from
            one simple dashboard.
          </p>

          <div className="login-benefit">
            <span>01</span>
            <div>
              <h3>Report with photos</h3>
              <p>Show authorities exactly what needs attention.</p>
            </div>
          </div>

          <div className="login-benefit">
            <span>02</span>
            <div>
              <h3>Track every complaint</h3>
              <p>Check whether your reported issues are resolved.</p>
            </div>
          </div>
        </section>

        <section className="login-form-panel">
          <div className="login-form-heading">
            <h2>{isRegister ? "Create your account" : "Welcome back"}</h2>
            <p>
              {isRegister
                ? "Register to start reporting civic issues."
                : "Sign in to access your citizen dashboard."}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {isRegister && (
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                minLength={6}
              />
            </div>

            {error && <p className="login-error">{error}</p>}

            <button
              type="submit"
              className="login-submit"
              disabled={loading}
            >
              {loading
                ? "Please wait..."
                : isRegister
                  ? "Create Account"
                  : "Sign In"}
              {!loading && <span>→</span>}
            </button>
          </form>

          <div className="register-switch">
            {isRegister
              ? "Already have an account?"
              : "New to CivicConnect?"}

            <button
              type="button"
              disabled={loading}
              onClick={() => {
                setIsRegister(!isRegister);
                setError("");
              }}
            >
              {isRegister ? "Sign in" : "Create an account"}
            </button>
          </div>

          <p className="login-disclaimer">
            Citizen access · Civic issue reporting portal
          </p>
        </section>
      </main>
    </div>
  );
}

export default Login;

// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import "../styles/Login.css";

// function Login() {
//   const navigate = useNavigate();

//   const [isRegister, setIsRegister] = useState(false);
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   function handleSubmit(event) {
//     event.preventDefault();
//     setError("");

//     if (!email.trim() || !password.trim()) {
//       setError("Please enter your email and password.");
//       return;
//     }

//     if (isRegister && !name.trim()) {
//       setError("Please enter your full name.");
//       return;
//     }

//     const users = JSON.parse(
//       localStorage.getItem("civicUsers") || "[]"
//     );

//     if (isRegister) {
//       const alreadyExists = users.some(
//         (user) => user.email === email.trim().toLowerCase()
//       );

//       if (alreadyExists) {
//         setError("This email is already registered.");
//         return;
//       }

//       const newUser = {
//         id: Date.now(),
//         name: name.trim(),
//         email: email.trim().toLowerCase(),
//         password,
//       };

//       users.push(newUser);

//       localStorage.setItem("civicUsers", JSON.stringify(users));
//       localStorage.setItem(
//         "civicCurrentUser",
//         JSON.stringify({
//           id: newUser.id,
//           name: newUser.name,
//           email: newUser.email,
//           role: "citizen",
//         })
//       );

//       navigate("/citizen/dashboard");
//       return;
//     }

//     const matchedUser = users.find(
//       (user) =>
//         user.email === email.trim().toLowerCase() &&
//         user.password === password
//     );

//     if (!matchedUser) {
//       setError("Invalid email or password. Please register first.");
//       return;
//     }

//     localStorage.setItem(
//       "civicCurrentUser",
//       JSON.stringify({
//         id: matchedUser.id,
//         name: matchedUser.name,
//         email: matchedUser.email,
//         role: "citizen",
//       })
//     );

//     navigate("/citizen/dashboard");
//   }

//   return (
//     <div className="login-page">
//       <header className="login-navbar">
//         <Link to="/" className="brand">
//           <span>🏛️</span>
//           CivicConnect
//         </Link>

//         <Link to="/" className="back-home">
//           ← Back to Home
//         </Link>
//       </header>

//       <main className="login-layout">
//         <section className="login-intro">
//           <span className="section-tag">CITIZEN PORTAL</span>

//           <h1>
//             Your city.
//             <br />
//             Your voice.
//             <br />
//             <span>Your impact.</span>
//           </h1>

//           <p>
//             Report local problems, upload photos, and
//             track the progress of your complaints from
//             one simple dashboard.
//           </p>

//           <div className="login-benefit">
//             <span>01</span>
//             <div>
//               <h3>Report with photos</h3>
//               <p>Show authorities exactly what needs attention.</p>
//             </div>
//           </div>

//           <div className="login-benefit">
//             <span>02</span>
//             <div>
//               <h3>Track every complaint</h3>
//               <p>Check whether your reported issues are resolved.</p>
//             </div>
//           </div>
//         </section>

//         <section className="login-form-panel">
//           <div className="login-form-heading">
//             <h2>{isRegister ? "Create your account" : "Welcome back"}</h2>
//             <p>
//               {isRegister
//                 ? "Register to start reporting civic issues."
//                 : "Sign in to access your citizen dashboard."}
//             </p>
//           </div>

//           <form onSubmit={handleSubmit}>
//             {isRegister && (
//               <div className="form-group">
//                 <label htmlFor="fullName">Full Name</label>
//                 <input
//                   id="fullName"
//                   type="text"
//                   placeholder="Enter your full name"
//                   value={name}
//                   onChange={(event) => setName(event.target.value)}
//                   required
//                 />
//               </div>
//             )}

//             <div className="form-group">
//               <label htmlFor="email">Email Address</label>
//               <input
//                 id="email"
//                 type="email"
//                 placeholder="you@example.com"
//                 value={email}
//                 onChange={(event) => setEmail(event.target.value)}
//                 required
//               />
//             </div>

//             <div className="form-group">
//               <label htmlFor="password">Password</label>
//               <input
//                 id="password"
//                 type="password"
//                 placeholder="Enter your password"
//                 value={password}
//                 onChange={(event) => setPassword(event.target.value)}
//                 required
//                 minLength={6}
//               />
//             </div>

//             {error && <p className="login-error">{error}</p>}

//             <button type="submit" className="login-submit">
//               {isRegister ? "Create Account" : "Sign In"}
//               <span>→</span>
//             </button>
//           </form>

//           <div className="register-switch">
//             {isRegister
//               ? "Already have an account?"
//               : "New to CivicConnect?"}

//             <button
//               type="button"
//               onClick={() => {
//                 setIsRegister(!isRegister);
//                 setError("");
//               }}
//             >
//               {isRegister ? "Sign in" : "Create an account"}
//             </button>
//           </div>

//           <p className="login-disclaimer">
//             Citizen access · Civic issue reporting portal
//           </p>
//         </section>
//       </main>
//     </div>
//   );
// }

// export default Login;
