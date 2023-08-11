"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Paper, Box } from "@mui/material";
import { useRouter } from "next/navigation";

const UploadFile = () => {
  const [pictures, setPictures] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const router = useRouter();
  const userData = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  console.log("localUSER =", userData);
  const ImageData = async () => {
    const response = await axios.get("http://192.168.1.215:5000/image/All");
    console.log("pictures data ", response.data);
    setPictures(response.data);
  };

  useEffect(() => {
    if (userData == null) {
      router.push("/login");
    }
    ImageData();
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (selectedFile) {
      console.log("SelectedFIle = ", selectedFile);
      const formData = new FormData();
      formData.append("media", selectedFile);

      try {
        const response = await fetch(
          `http://192.168.1.215:5000/image/upload/${userData?.user?._id}`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (response.ok) {
          console.log("Image uploaded successfully");
        } else {
          console.error("Image upload failed");
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const handleLogout = () => {
    console.log("logout");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const handleComment = async (e) => {
    e.preventDefault();
    const response = await axios.post("http://localhost:5000/image/commnet");
    console.log("Comment Response =", response);
  };

  //   const handleSubmit = async (e) => {
  //     e.preventDefault();

  //     const formData = new FormData();
  //     const myPic = e.target.file.files[0];
  //     formData.append("media", myPic);
  //     console.log("MY PIC =", typeof myPic);
  //     console.log("PICTURE FormData", formData);

  //     const user = JSON.parse(localStorage.getItem("user"));
  //     console.log("Local USER =", user.user._id);
  //     try {
  //       const response = await axios.post(
  //         `http://192.168.1.215:5000/image/upload/${user.user._id}`,
  //         {
  //           body: myPic,
  //         }
  //       );

  //       if (response.ok) {
  //         // Handle successful upload
  //         console.log("File uploaded successfully");
  //       } else {
  //         // Handle upload error
  //         console.error("Error uploading file");
  //       }
  //     } catch (error) {
  //       console.error("An error occurred while uploading the file", error);
  //     }
  //   };
  return (
    <>
      <div className="container">
        <h3 style={{ float: "left" }}>Upload Files</h3>
        <button
          className="btn btn-sm btn-danger rounded logoutButton"
          onClick={handleLogout}
        >
          Logout
        </button>
        <br />
        <br />
        <form onSubmit={handleUpload} encType="multipart/form-data">
          <input type="file" name="file" onChange={handleFileChange} />
          <br />
          <br />
          <input
            type="submit"
            value="Upload"
            className="btn btn-md btn-success"
          />
        </form>

        <br />
        <br />
        <div>
          {pictures.map((pic, index) => {
            return (
              <>
                {/* <Box
                  key={index}
                  sx={{
                    display: "flex",
                    "& > :not(style)": {
                      m: 1,
                      width: 128,
                      height: 128,
                    },
                  }}
                >
                  <Paper key={index} variant="outlined">
                    <img src={pic.url} width="127px" height="127px" />
                  </Paper>
                </Box> */}

                <div>
                  <div>
                    <img src={pic.url} width="127px" height="127px" />
                  </div>
                  <div>
                    <form onSubmit={handleComment}>
                      <input type="text" name="userComment" />
                      <button className="btn btn-sm btn-success rounded">
                        Send
                      </button>
                    </form>
                  </div>
                </div>

                <div className="">
                  <img src={pic.url} width="700px" height="500px" />

                  <ul
                    className="list-group list-group-flush "
                    style={{ width: "700px" }}
                  >
                    {pic.comments.map((user, index) => {
                      return (
                        <>
                          <li
                            className="list-group-item"
                            key={index}
                            style={{ width: "700px" }}
                          >
                            {user.username}
                          </li>
                        </>
                      );
                    })}
                  </ul>

                  <div className="card-body">
                    <form onSubmit={handleComment}>
                      <input type="text" name="userComment" />
                      <button className="btn btn-sm btn-success rounded">
                        Send
                      </button>
                    </form>
                  </div>
                  <div className="card-footer text-muted">2 days ago</div>
                </div>
              </>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default UploadFile;
