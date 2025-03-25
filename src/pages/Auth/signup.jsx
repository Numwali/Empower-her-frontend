import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import InterestSelect from "./interests";
import { Eye, EyeOff } from "lucide-react";
import { IoIosArrowRoundBack } from "react-icons/io";

const SignUp = () => {

 const url = process.env.REACT_APP_BACKEND_URL

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    dob: "",
    phone: "",
    address: "",
    username: "",
    password: "",
    confirm_password: "",
  });
  const [file, setFile] = useState(null);
  const [interests, setInterests] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // First name validation
    if (!formData.firstname.trim()) {
      newErrors.firstname = "First name is required";
      isValid = false;
    }

    // Last name validation
    if (!formData.lastname.trim()) {
      newErrors.lastname = "Last name is required";
      isValid = false;
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Date of birth validation
    if (!formData.dob) {
      newErrors.dob = "Date of birth is required";
      isValid = false;
    }

    // Phone validation
    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
      isValid = false;
    }

    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
      isValid = false;
    }

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
      isValid = false;
    }

    // Interests validation
    if (interests.length === 0) {
      newErrors.interests = "Please select at least one interest";
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    // Confirm password validation
    if (!formData.confirm_password) {
      newErrors.confirm_password = "Please confirm your password";
      isValid = false;
    } else if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = "Passwords do not match";
      isValid = false;
    }
    if (!file) {
      newErrors.profile = "Please Select Your Profile";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      Object.values(errors).forEach((error) => {
        toast.error(error);
      });
      return;
    }

    console.log(validateForm());
    console.log(errors);
    setIsLoading(true);

    // Prepare data for API
    const data = new FormData();
    data.append("firstname", formData.firstname);
    data.append("lastname", formData.lastname);
    data.append("username", formData.username);
    data.append("age", formData.dob);
    data.append("email", formData.email);
    data.append("address", formData.address);
    data.append("role", "user");
    data.append("phone", formData.phone);
    data.append("password", formData.password);
    data.append("gender", "Female");
    data.append("confirm_password", formData.confirm_password);
    data.append("interests", JSON.stringify(interests));

    data.append("image", file);

    const config = {
      method: "post",
      url: `${process.env.REACT_APP_BACKEND_URL}/v1/user/register`,
      data: data,
    };

    try {
      const response = await axios(config);
      const res = response.data;

      if (res.success) {
        toast.success(
          "Successfully registered, Check your email for verification"
        );
        setTimeout(() => {
          navigate("/verify-account");
        }, 3000);
      } else {
        toast.error(`${res.message}`);
      }
    } catch (error) {
      console.log("Signup failed", error);
      toast.error(error.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-Muted to-Muted/70">
        <div className="container mx-auto px-2 py-8">
          {/* Main Content */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-6xl mx-auto mb-8">
            <div className="grid md:grid-cols-4">
              {/* Form Section */}
              <div className="md:col-span-2 p-6 md:p-8">
                <div className="text-center mb-6">
                  <Link
                    to={"/"}
                    className="font-black text-primary flex w-24 flex-row items-center justify- col-start-4"
                  >
                    <IoIosArrowRoundBack className="text-2xl font-black  text-primary" />{" "}
                    <span className="text-sm">Home</span>
                  </Link>
                  <h1 className="text-2xl font-bold text-primary">
                    Create Account Now!
                  </h1>
                  <p className="text-primary/70 mt-1 max-w-2xl mx-auto">
                    Prioritize mental health. It matters. Seek support when
                    needed. Everyone deserves understanding.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-2">
                  {/* Name Fields */}
                  <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
                    <div>
                      <div className="relative">
                        <input
                          type="text"
                          name="firstname"
                          value={formData.firstname}
                          onChange={handleChange}
                          placeholder="Firstname"
                          className={`w-full px-4 py-2 rounded-lg border ${errors.firstname
                              ? "border-red-500"
                              : "border-primary/20"
                            } focus:outline-none focus:ring-2 focus:ring-Accent text-primary`}
                          required
                        />
                      </div>
                      {errors.firstname && (
                        <p className="mt-1 text-red-500 text-sm">
                          {errors.firstname}
                        </p>
                      )}
                    </div>

                    <div>
                      <div className="relative">
                        <input
                          type="text"
                          name="lastname"
                          value={formData.lastname}
                          onChange={handleChange}
                          placeholder="Lastname"
                          className={`w-full px-4 py-2 rounded-lg border ${errors.lastname
                              ? "border-red-500"
                              : "border-primary/20"
                            } focus:outline-none focus:ring-2 focus:ring-Accent text-primary`}
                          required
                        />
                      </div>
                      {errors.lastname && (
                        <p className="mt-1 text-red-500 text-sm">
                          {errors.lastname}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* DOB and Phone */}
                  <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 items-center">
                    <div>
                      <div className="relative">
                        <p className="text-[0.50rem] absolute ml-8 text-center">Date Of Birth</p>
                        <input
                          type="date"
                          name="dob"
                          value={formData.dob}
                          onChange={handleChange}
                          className={`w-full px-4 py-2 rounded-lg border ${errors.dob ? "border-red-500" : "border-primary/20"
                            } focus:outline-none focus:ring-2 focus:ring-Accent text-primary`}
                          required
                        />
                      </div>
                      {errors.dob && (
                        <p className="mt-1 text-red-500 text-sm">
                          {errors.dob}
                        </p>
                      )}
                    </div>

                    <div>
                      <div className="relative">
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="Phone number"
                          className={`w-full px-4 py-2 rounded-lg border ${errors.phone
                              ? "border-red-500"
                              : "border-primary/20"
                            } focus:outline-none focus:ring-2 focus:ring-Accent text-primary`}
                          required
                        />
                      </div>
                      {errors.phone && (
                        <p className="mt-1 text-red-500 text-sm">
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <div className="relative">
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Address/Location"
                        className={`w-full px-4 py-2 rounded-lg border ${errors.address
                            ? "border-red-500"
                            : "border-primary/20"
                          } focus:outline-none focus:ring-2 focus:ring-Accent text-primary`}
                        required
                      />
                    </div>
                    {errors.address && (
                      <p className="mt-1 text-red-500 text-sm">
                        {errors.address}
                      </p>
                    )}
                  </div>

                  {/* Email and Username */}
                  <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
                    <div>
                      <div className="relative">
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="E-mail"
                          className={`w-full px-4 py-2 rounded-lg border ${errors.email
                              ? "border-red-500"
                              : "border-primary/20"
                            } focus:outline-none focus:ring-2 focus:ring-Accent text-primary`}
                          required
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-1 text-red-500 text-sm">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <div className="relative">
                        <input
                          type="text"
                          name="username"
                          value={formData.username}
                          onChange={handleChange}
                          placeholder="Username"
                          className={`w-full px-4 py-2 rounded-lg border ${errors.username
                              ? "border-red-500"
                              : "border-primary/20"
                            } focus:outline-none focus:ring-2 focus:ring-Accent text-primary`}
                          required
                        />
                      </div>
                      {errors.username && (
                        <p className="mt-1 text-red-500 text-sm">
                          {errors.username}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Interests */}
                  <div>
                    <label className="block text-primary text-sm font-medium mb-2">
                      Interests (select multiple, start with #)
                    </label>
                    <InterestSelect
                      value={interests}
                      onChange={setInterests}
                      hasError={!!errors.interests}
                      errorId={errors.interests ? "interests-error" : undefined}
                    />
                    {errors.interests && (
                      <p className="mt-1 text-red-500 text-sm">
                        {errors.interests}
                      </p>
                    )}
                  </div>

                  {/* Password Fields */}
                  <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
                    <div>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Password"
                          className={`w-full px-4 py-2 rounded-lg border ${errors.password
                              ? "border-red-500"
                              : "border-primary/20"
                            } focus:outline-none focus:ring-2 focus:ring-Accent text-primary pr-10`}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary z-10"
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                        >
                          {showPassword ? (
                            <EyeOff size={10} className="text-[#979799]" />
                          ) : (
                            <Eye size={10} className="text-[#979799]" />
                          )}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="mt-1 text-red-500 text-sm">
                          {errors.password}
                        </p>
                      )}
                    </div>

                    <div>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirm_password"
                          value={formData.confirm_password}
                          onChange={handleChange}
                          placeholder="Re-enter Password"
                          className={`w-full px-4 py-2 rounded-lg border ${errors.confirm_password
                              ? "border-red-500"
                              : "border-primary/20"
                            } focus:outline-none focus:ring-2 focus:ring-Accent text-primary pr-10`}
                          required
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary z-10"
                          aria-label={
                            showConfirmPassword
                              ? "Hide password"
                              : "Show password"
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeOff size={10} className="text-[#979799]" />
                          ) : (
                            <Eye size={10} className="text-[#979799]" />
                          )}
                        </button>
                      </div>
                      {errors.confirm_password && (
                        <p className="mt-1 text-red-500 text-sm">
                          {errors.confirm_password}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-primary text-sm font-medium mb-2">
                      Profile Picture
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      name="profileImage"
                      onChange={(e) => handleFileChange(e)}
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="mt-6">
                    {isLoading ? (
                      <button
                        className="w-full bg-Accent text-white py-2 rounded-lg font-semibold opacity-70 cursor-not-allowed flex items-center justify-center"
                        disabled
                      >
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                        Processing...
                      </button>
                    ) : (
                      <input
                        type="submit"
                        value="Sign Up"
                        className="w-full bg-Accent hover:bg-primary text-white py-2 rounded-lg font-semibold transition-colors duration-300 cursor-pointer"
                      />
                    )}
                  </div>

                  {/* Login Link */}
                  <div className="text-center mt-4">
                    <p className="text-primary/70">
                      Already have an account?{" "}
                      <Link
                        to="/login"
                        className="text-Accent font-semibold hover:text-primary "
                      >
                        Sign in
                      </Link>
                    </p>
                  </div>
                </form>
              </div>

              {/* Text Section */}
              <div className="hidden md:block md:col-span-2 bg-[#f5fafd] p-8 flex-col  justify-center">
                <div className=" items-center justify-center">
                  <div className="text-center mb-2">
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
                    <h2 className="text-xl font-bold text-primary">
                      Be Healthy!
                    </h2>
                  </div>
                  <p className="text-primary/80 leading-relaxed">
                    We hope that you are going to heal others, and as well as
                    that you are going to heal. We want you to know that mental
                    health matters and you are responsible to make it better.
                  </p>

                  <div className="relative mt-1 h-40">
                    <div className="absolute top-0 left-0 w-16 h-16 rounded-full bg-Muted/30"></div>
                    <div className="absolute bottom-0 right-0 w-20 h-20 rounded-full bg-Accent/20"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-primary/70 text-sm">
            <p>© {new Date().getFullYear()} EmpowerHer. All rights reserved.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
