import React, { useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import img1 from "../assets/images/profile.png";
import { toast } from "react-toastify";
import { logginUser } from "../redux/slices/Auth/login";

export default function ProfileModal({ show, handleClose, user }) {
  const dispatch = useDispatch();

  const [firstname, setFirstname] = useState(user?.firstname);
  const [lastname, setLastname] = useState(user?.lastname);
  const [username, setUsername] = useState(user.username);
  const [dob, setDob] = useState(user.dob);
  const [email, setEmail] = useState(user.email);
  const [address, setAddress] = useState(user.address);
  const [gender, setGender] = useState(user.gender);
  const [phone, setPhone] = useState(user.phone);
  const [image, setImage] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem("token");

  const selectImage = () => {
    const input = document.getElementById("fileInput");
    input.click();
  };

  const handSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    var data = new FormData();
    data.append("firstname", firstname);
    data.append("lastname", lastname);
    data.append("username", username);
    data.append("dob", dob);
    data.append("email", email);
    data.append("address", address);
    data.append("phone", phone);
    data.append("gender", gender);
    {
      image.length > 0 && data.append("image", image[0]);
    }

    var config = {
      method: "put",
      url: `${process.env.REACT_APP_BACKEND_URL}/v1/user/profile`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: data,
    };

    axios(config).then(function (response) {
      const res = response.data;
      if (res.success) {
        localStorage.setItem("user", JSON.stringify(res.user));
        dispatch(logginUser(res.user));
        setIsLoading(false);
        toast.success("Successfully");
        setTimeout(() => {
          handleClose();
        }, 2000);
      } else {
        setIsLoading(false);
        toast.error(`${res.message}`);
      }
    });
  };

  return (
    <>
      <div className={`fixed inset-0 z-50 ${show ? "block" : "hidden"}`}>
        <div className="fixed inset-0 bg-black bg-opacity-50"></div>
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-2xl font-bold">Update Profile</h2>
              <button
                className="text-2xl text-black hover:text-gray-700"
                onClick={handleClose}
              >
                &times;
              </button>
            </div>
            <div className="p-4">
              <div className="flex items-center mb-4">
                <img
                  src={user.profileImage ? user.profileImage : img1}
                  alt="Profile"
                  className="w-16 h-16 rounded-full cursor-pointer mr-4"
                  onClick={selectImage}
                />
                <div className="flex flex-col">
                  <span className="font-semibold">
                    {user?.firstname} {user?.lastname}
                  </span>
                  <span className="text-sm text-gray-500">{user.email}</span>
                </div>
              </div>
              <form onSubmit={handSubmit}>
                <input
                  id="fileInput"
                  type="file"
                  className="hidden"
                  onChange={(e) => setImage(e.target.files)}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700">
                      First Name
                    </label>
                    <input
                      type="text"
                      className="mt-1 p-2 border rounded-lg"
                      placeholder="First Name"
                      value={firstname}
                      required
                      onChange={(e) => setFirstname(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="mt-1 p-2 border rounded-lg"
                      placeholder="Last Name"
                      value={lastname}
                      required
                      onChange={(e) => setLastname(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700">
                      Username
                    </label>
                    <input
                      type="text"
                      className="mt-1 p-2 border rounded-lg"
                      placeholder="Username"
                      value={username !== "default" ? username : ""}
                      required
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      className="mt-1 p-2 border rounded-lg"
                      placeholder="Email"
                      value={email}
                      required
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700">
                      Gender
                    </label>
                    <select
                      className="mt-1 p-2 border rounded-lg"
                      required
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      className="mt-1 p-2 border rounded-lg"
                      value={dob}
                      required
                      onChange={(e) => setDob(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <input
                      type="number"
                      className="mt-1 p-2 border rounded-lg"
                      placeholder="Phone number"
                      value={phone}
                      required
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700">
                      Address
                    </label>
                    <input
                      type="text"
                      className="mt-1 p-2 border rounded-lg"
                      placeholder="Address"
                      value={address !== "default" ? address : ""}
                      required
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-center">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-700"
                  >
                    {isLoading ? "Loading ..." : "Update"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}