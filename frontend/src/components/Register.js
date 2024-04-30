import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";

const userValidationSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  username: yup.string().required("Username is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  profilePic: yup.string(),
  bio: yup.string(),
});

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    profilePic: "",
    bio: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await userValidationSchema.validate(formData, { abortEarly: false });
      console.log("Form submitted:", formData);
      setFormData({
        name: "",
        username: "",
        email: "",
        password: "",
        profilePic: "",
        bio: "",
      });
      setErrors({});
      navigate("/login");
    } catch (validationErrors) {
      const newErrors = {};
      validationErrors.inner.forEach((error) => {
        newErrors[error.path] = error.message;
      });
      setErrors(newErrors);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2 className="mt-4 mb-4">Register</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                className={`form-control ${errors.name && "is-invalid"}`}
                placeholder="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && (
                <div className="invalid-feedback">{errors.name}</div>
              )}
            </div>
            <div className="form-group">
              <input
                type="text"
                className={`form-control ${errors.username && "is-invalid"}`}
                placeholder="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
              />
              {errors.username && (
                <div className="invalid-feedback">{errors.username}</div>
              )}
            </div>
            <div className="form-group">
              <input
                type="email"
                className={`form-control ${errors.email && "is-invalid"}`}
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <div className="invalid-feedback">{errors.email}</div>
              )}
            </div>
            <div className="form-group">
              <input
                type="password"
                className={`form-control ${errors.password && "is-invalid"}`}
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && (
                <div className="invalid-feedback">{errors.password}</div>
              )}
            </div>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                placeholder="Profile Picture URL (Optional)"
                name="profilePic"
                value={formData.profilePic}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <textarea
                className="form-control"
                placeholder="Bio (Optional)"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
