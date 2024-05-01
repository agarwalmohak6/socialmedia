import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import * as yup from "yup";

const loginValidationSchema = yup.object().shape({
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required"),
});

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
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
      await loginValidationSchema.validate(formData, { abortEarly: false });

      // Make a POST request to the login endpoint using Axios
      const response = await axios.post(
        "http://localhost:5000/api/users/login",
        formData
      );

      // Assuming the server responds with a token upon successful login
      const { token } = response.data;
      console.log(token);
      // Perform actions after successful login, such as storing the token in local storage
      localStorage.setItem("token", token);

      console.log("Login successful:", formData);
      setFormData({
        username: "",
        password: "",
      });
      setErrors({});
      navigate("/about");
    } catch (validationErrors) {
      // const newErrors = {};
      // validationErrors.inner.forEach((error) => {
      //   newErrors[error.path] = error.message;
      // });
      // setErrors(newErrors);
      console.log(validationErrors);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2 className="mt-4 mb-4">Login</h2>
          <form onSubmit={handleSubmit}>
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
            <button type="submit" className="btn btn-primary">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
