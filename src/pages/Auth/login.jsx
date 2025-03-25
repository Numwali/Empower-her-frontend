import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { IoIosArrowRoundBack } from "react-icons/io";

import axios from "axios";
import { logginUser } from "../../redux/slices/Auth/login";
import { loginMode } from "../../redux/slices/Auth/Auth";

const Login = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/v1/user/login`,
        {
          email: username,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const res = response.data;
      if (res.success) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("id", res.user?.id);
        localStorage.setItem("user", JSON.stringify(res.user));
        dispatch(logginUser(res.user));
        dispatch(loginMode());
        setIsLoading(false);
        toast.success("Logged In");
        setTimeout(() => {
          navigate("/resources");
        }, 3000);
      } else {
        setIsLoading(false);
        toast.error(`${res.message}`);
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error.response);
      console.log(error);
      toast.error(error.message); // Add error toast here
    }
  };

  const handleGoogleLogin = (e) => {
    e.preventDefault();
    window.open(`${process.env.REACT_APP_BACKEND_URL}/auth/google`, "_self");
  };

  const location = useLocation();

  useEffect(() => {
    const checkForToken = async () => {
      const params = new URLSearchParams(location.search);
      const token = params.get("token");
      var user = params.get("user");

      if (token) {
        try {
          user = JSON.parse(user);
          const idi = user?._id;
          localStorage.setItem("token", token);
          localStorage.setItem("id", idi);
          localStorage.setItem("user", JSON.stringify(user));
          dispatch(logginUser(user));
          dispatch(loginMode());
          setIsLoading(false);
          toast.success("Successfully");
          setTimeout(() => {
            navigate("/resources");
          }, 2000);
        } catch (error) {
          setIsLoading(false);
          toast.error("Login failed. Please try again.");
        }
      } else {
        setIsLoading(false);
      }
    };

    checkForToken();
  }, [location, dispatch, navigate]);

  return (
    <>

      <div className="min-h-screen bg-gradient-to-br from-Muted to-Muted/70">
        <div className="container mx-auto px-4 py-8 md:py-16">
          {/* Main Content */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2">
              {/* Left Column - Text */}
              <div className="bg-[#f5fafd] p-8 md:p-12 flex flex-col justify-center">
                <Link to={'/'} className="font-black text-primary flex w-24 flex-row items-center justify- col-start-4 mb-5"><IoIosArrowRoundBack className="text-2xl font-black  text-primary" /> <span className="text-sm">Home</span></Link>
                <div className="max-w-md">
                  <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4">Hello!</h2>
                  <p className="text-primary/80 leading-relaxed">
                    EmpowerHer is excited to see you back. We are thankful for the decision you have taken to join us in
                    this journey. Together, we can support each other's mental wellness and create a community of strength
                    and healing.
                  </p>

                  {/* Decorative Elements */}
                  <div className="relative mt-8 h-40 hidden md:block">
                    <div className="absolute top-0 left-0 w-20 h-20 rounded-full bg-Muted/30"></div>
                    <div className="absolute bottom-0 right-0 w-24 h-24 rounded-full bg-Accent/20"></div>
                  </div>
                </div>
              </div>

              {/* Right Column - Form */}
              <div className="p-8 md:p-12">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-Muted/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-primary">Welcome Back!</h2>
                </div>

                <form onSubmit={(e) => handleSubmit(e)} className="space-y-6">

                  <div>
                    <div className="relative">
                      <input
                        type="email"
                        id="email"
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter Email"
                        className={`w-full px-4 py-3 rounded-lg border  focus:outline-none focus:ring-2 focus:ring-Accent text-primary`}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <div className="relative">
                      <input
                        type="password"
                        id="password"
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter Password"
                        className={`w-full px-4 py-3 rounded-lg border  focus:outline-none focus:ring-2 focus:ring-Accent text-primary pr-10`}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-Accent hover:bg-primary text-white py-2 rounded-lg font-semibold transition-colors duration-300"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Loading...
                        </div>
                      ) : (
                        "Login"
                      )}
                    </button>
                  </div>

                  <div className="relative flex items-center justify-center">
                    <div className="border-t border-gray-200 w-52"></div>
                    <span className="bg-white px-3 text-sm text-gray-500 relative">Or</span>
                    <div className="border-t border-gray-200 w-52"></div>
                  </div>

                  <button
                    onClick={handleGoogleLogin}
                    className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-300"
                  >
                    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                      <path
                        fill="#FFC107"
                        d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                      />
                      <path
                        fill="#FF3D00"
                        d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                      />
                      <path
                        fill="#4CAF50"
                        d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                      />
                      <path
                        fill="#1976D2"
                        d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                      />
                    </svg>
                    <span className="text-black">Login with Google</span>
                  </button>

                  <div className="flex flex-col sm:flex-row justify-between items-center text-sm mt-6">
                    <div className="mb-2 sm:mb-0">
                      <span className="text-primary/70">Dont have an Account ? </span>
                      <Link to="/register" className="text-Accent hover:text-primary font-semibold">
                        Sign Up
                      </Link>
                    </div>
                    <Link to="/forget-password" className="text-Accent hover:text-primary font-semibold">
                      Forgot Password?
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-primary/70 text-sm">
            <p>© {new Date().getFullYear()} EmpowerHer. All rights reserved.</p>
          </div>

        </div>
      </div>
    </>
  );
};

export default Login;
