import forget from "../../assets/images/forget.svg";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { IoIosArrowRoundBack } from "react-icons/io";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/v1/user/forgot-password`,
        { email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setIsLoading(false);
        toast.success(response.data.message);
        setEmail("");
      } else {
        setIsLoading(false);
        toast.error(`${response.data.message}`);
      }
    } catch (error) {
      setIsLoading(false);
      toast.error(error.response?.data?.message || "Failed to process request");
      console.log(error.response);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-Muted to-Muted/70">
        <div className="container mx-auto px-4 py-8 md:py-16">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2">
              <div className="bg-[#fffffff1] p-8 md:p-12 flex flex-col justify-center">
                <Link to={'/'} className="font-black text-primary flex w-24 flex-row items-center justify- col-start-4 mb-5"><IoIosArrowRoundBack className="text-2xl font-black  text-primary" /> <span className="text-sm">Home</span></Link>
                <div className="image">
                  <img src={forget} alt="Forgot password illustration" className="max-w-full h-auto" />
                </div>
              </div>

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
                  <h2 className="text-xl font-bold text-primary">Forgot Password</h2>
                  <p className="text-primary/70 mt-2">
                    Enter your email address and we'll send you a link to reset your password.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="form-group">
                    <label htmlFor="email" className="block text-sm font-medium text-primary mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-Accent text-primary"
                      onChange={(e) => setEmail(e.target.value)}
                      value={email}
                      id="email"
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div className="form-group">
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
                          Sending...
                        </div>
                      ) : (
                        "Reset Password"
                      )}
                    </button>
                  </div>
                </form>

                <div className="mt-6 text-center">
                  <Link to="/login" className="text-Accent hover:text-primary font-semibold">
                    Back to Login
                  </Link>
                </div>
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

export default ForgotPassword;