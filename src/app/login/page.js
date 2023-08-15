"use client";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

const UserLogin = () => {
  const router = useRouter();
  const initialValues = {
    username: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleSubmit = async (values) => {
    console.log("userValues", values);
    const response = await axios.post(
      "http://192.168.1.215:5000/user/login",
      values
    );

    console.log("response ", response);
    if (response.status === 200) {
      localStorage.setItem("user", JSON.stringify(response.data));
      router.push("/dashboard");
    } else {
      alert("Please Try again...");
    }
  };
  return (
    <div>
      <div className="container">
        <h2>User Login</h2>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          <Form className="signupForm">
            <div className="formField">
              <label htmlFor="username">Username</label>
              <br />
              <Field
                type="text"
                id="username"
                name="username"
                className="form-control"
              />
              <ErrorMessage
                name="username"
                component="span"
                className="error"
              />
            </div>

            <div className="formField">
              <label htmlFor="pwd">Password</label>
              <br />
              <Field
                type="password"
                id="pwd"
                name="password"
                className="form-control"
              />
              <ErrorMessage
                name="password"
                component="span"
                className="error"
              />
            </div>

            <button className="btn btn-md btn-success" type="submit">
              Login
            </button>
          </Form>
        </Formik>

        <Link href="/">Register Here</Link>
      </div>
    </div>
  );
};

export default UserLogin;
