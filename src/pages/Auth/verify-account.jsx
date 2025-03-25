import verify from "../../assets/images/verify.svg";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { usePinInput } from "react-pin-input-hook";
import { Link, useNavigate } from "react-router-dom";
import { IoIosArrowRoundBack } from "react-icons/io";

const VerifyUser = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [values, setValues] = useState(Array(6).fill(""));

  const handleVerification = async (value) => {
    setIsLoading(true);

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/v1/user/verify`,
        { token: value },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        if (response.data.success) {
          setIsLoading(false);
          toast.success(response.data.message);
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        } else {
          setIsLoading(false);
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      setIsLoading(false);
      toast.error(error.response?.data?.message || "Verification failed");
      console.log(error.response);
    }
  };

  const { fields } = usePinInput({
    values,
    onChange: (value) => {
      setValues(value);
    },
    onComplete: handleVerification
  });

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-Muted to-Muted/70">
        <div className="container mx-auto px-4 py-8 md:py-16">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2">
              <div className="bg-[#fffffff1] p-8 md:p-12 flex flex-col justify-center">
               <Link to={'/'} className="font-black text-primary flex w-24 flex-row items-center justify- col-start-4 mb-5"><IoIosArrowRoundBack className="text-2xl font-black  text-primary" /> <span className="text-sm">Home</span></Link>
                <div className="image">
                  <img src={verify} alt="Verification illustration" className="max-w-full h-auto" />
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
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-primary">Verify Your Account</h2>
                  <p className="text-primary/70 mt-2">
                    Enter the 6-digit verification code sent to your email
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="form-group">
                    <div
                      dir="ltr"
                      className="grid items-center justify-center grid-cols-6 gap-2 mt-6"
                    >
                      {fields.map((propsField, index) => {
                        return (
                          <input
                            key={index}
                            className="w-12 h-12 py-2 text-center border border-Accent rounded-lg focus:outline-none focus:ring-2 focus:ring-Accent text-primary"
                            {...propsField}
                          />
                        );
                      })}
                    </div>
                  </div>

                  <div className="form-group">
                    <button
                      onClick={() => handleVerification(values.join(''))}
                      disabled={isLoading || values.join('').length !== 6}
                      className="w-full bg-Accent hover:bg-primary text-white py-3 rounded-lg font-semibold transition-colors duration-300 mt-4"
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
                          Verifying...
                        </div>
                      ) : (
                        "Verify Account"
                      )}
                    </button>
                  </div>

                </div>

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

export default VerifyUser;