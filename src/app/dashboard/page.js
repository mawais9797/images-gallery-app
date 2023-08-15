"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Paper,
  Box,
  Card,
  ImageListItem,
  Button,
  Badge,
  TextField,
} from "@mui/material";
import { useRouter } from "next/navigation";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import imageNoData from "../../../public/No data-amico.png";

import {
  Container,
  CssBaseline,
  Grid,
  Typography,
  CardContent,
  CardActions,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { ThumbUp, Comment } from "@mui/icons-material";

const UploadFile = () => {
  const [pictures, setPictures] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState([
    "Great post!",
    "I enjoyed reading this.",
  ]);

  const router = useRouter();
  const userData = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  console.log("localUSER =", userData);

  const ImageData = async () => {
    try {
      const response = await axios.get("http://192.168.1.215:5000/image/All");
      console.log("pictures data ", response.data);
      setPictures(response.data);
    } catch (error) {
      console.log("Error All Image: ", error);
    }
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
      debugger;
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

  const handleComment = async (event, pictureID) => {
    event.preventDefault();

    const userComment = event.target.userComment.value;
    // alert(userComment);
    const commentData = {
      userId: userData?.user?._id,
      imageId: pictureID,
      comment: userComment,
    };
    const response = await axios.post(
      "http://192.168.1.215:5000/image/commnet",
      commentData
    );
    console.log("Comment Response =", response);
  };
  // const handleComment = () => {
  //   const newComment = prompt("Add a comment:");
  //   if (newComment) {
  //     setComments((prevComments) => [...prevComments, newComment]);
  //   }
  // };

  const handleButtonClick = async (e, picID) => {
    e.preventDefault();
    // alert(picID);
    try {
      const picData = {
        userId: userData?.user?._id,
        imageId: picID,
      };
      const response = await axios.post(
        "http://192.168.1.215:5000/image/like",
        picData
      );
      console.log("submit Like= ", response);
    } catch (error) {
      console.log("Error in LIKE: ", error);
    }
  };

  return (
    <>
      {pictures != null ? (
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
            {pictures?.map((pic, index) => {
              return (
                <React.Fragment key={index}>
                  {/* <Card
                    sx={{
                      width: 275,
                      padding: 2,
                      float: "left",
                      marginRight: 5,
                      marginBottom: 30,
                      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                      borderRadius: 2,
                      backgroundColor: "#ffffff",
                      transition: "transform 0.2s",
                      "&:hover": {
                        transform: "scale(1.02)",
                      },
                    }}
                  >
                    <ImageListItem key={index}>
                      <img
                        src={pic.url}
                        alt={pic.title}
                        style={{ width: "300px", height: "300px" }}
                      />
                    </ImageListItem>
                    {pic.likedBy.filter((id) => id === userData.user._id) !=
                    "" ? (
                      <Button
                        onClick={(e) => handleButtonClick(e, pic._id)}
                        disabled
                      >
                        {console.log("mylikes= ", userData.user._id)}
                        {console.log("pic.likedBy= ", pic.likedBy)}
                        <ThumbUpOffAltIcon />{" "}
                        {pic.likesCount > 0 ? (
                          <span>({pic.likesCount})</span>
                        ) : (
                          <span></span>
                        )}
                      </Button>
                    ) : (
                      <Button onClick={(e) => handleButtonClick(e, pic._id)}>
                        <ThumbUpOffAltIcon />{" "}
                        {pic.likesCount > 0 ? (
                          <span>({pic.likesCount})</span>
                        ) : (
                          <span></span>
                        )}
                      </Button>
                    )}
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
                              style={{
                                width: "284px",
                                borderBottom: "2px solid white",
                              }}
                            >
                              {user.comment}
                            </li>
                          </>
                        );
                      })}
                    </ul>
                    <div className="card-body">
                      <form onSubmit={(event) => handleComment(event, pic._id)}>
                        <input type="text" name="userComment" />
                        <button
                          type="submit"
                          className="btn btn-sm btn-success rounded"
                        >
                          Send
                        </button>
                      </form>
                    </div>
                  </Card> */}
                  <br />
                  {/* <div className="">
                    <img src={pic.url} width="500px" height="400px" />
                    <ul
                      className="list-group list-group-flush "
                      style={{ width: "700px" }}
                    >
                      {pic.comments.map((user, index) => {
                        return (
                          <li
                            className="list-group-item"
                            key={index}
                            style={{ width: "700px" }}
                          >
                            {user.username}
                          </li>
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
                  </div> */}
                  <Container
                    component="main"
                    style={{ marginLeft: "180px", width: "1050px" }}
                  >
                    <CssBaseline />

                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={8}>
                        <Card>
                          <CardContent>
                            <Typography variant="h6" component="div">
                              My First Blog Post
                            </Typography>
                            <img
                              src={pic.url}
                              alt="Blog Post"
                              style={{ maxWidth: "100%", marginTop: "16px" }}
                            />
                          </CardContent>
                          <CardActions>
                            {pic.likedBy.filter(
                              (id) => id === userData.user._id
                            ) != "" ? (
                              <>
                                <IconButton
                                  color="primary"
                                  onClick={(e) => handleButtonClick(e, pic._id)}
                                  disabled
                                >
                                  <ThumbUp />
                                </IconButton>
                                <Typography>{pic.likesCount} Likes</Typography>
                              </>
                            ) : (
                              <>
                                <IconButton
                                  color="primary"
                                  onClick={(e) => handleButtonClick(e, pic._id)}
                                >
                                  <ThumbUp />
                                </IconButton>
                                <Typography>{pic.likesCount} Likes</Typography>
                              </>
                            )}
                            {/* <IconButton
                              color="primary"
                              onClick={(e) => handleButtonClick(e, pic._id)}
                            >
                              <ThumbUp />
                            </IconButton>
                            <Typography>{pic.likesCount} Likes</Typography> */}
                            <IconButton color="secondary">
                              <Comment />
                            </IconButton>
                            <Typography>
                              {pic.comments.length} Comments
                            </Typography>
                          </CardActions>
                          <List>
                            {pic.comments.map((comment, index) => (
                              <ListItem
                                key={index}
                                style={{
                                  backgroundColor: "#f0f0f0",
                                  marginBottom: "8px",
                                }}
                              >
                                <ListItemText> {comment.comment} </ListItemText>
                              </ListItem>
                            ))}
                          </List>
                          <form
                            onSubmit={(event) => handleComment(event, pic._id)}
                          >
                            <TextField
                              fullWidth
                              label="Add a Comment"
                              variant="outlined"
                              margin="normal"
                              name="userComment"
                            />
                            <Button
                              variant="contained"
                              color="primary"
                              type="submit"
                            >
                              Submit
                            </Button>
                          </form>
                        </Card>
                      </Grid>
                    </Grid>
                  </Container>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      ) : (
        <>
          <h1>No Data</h1>
          <img
            src={imageNoData.src}
            style={{ width: "500px", marginLeft: "200px" }}
          />
        </>
      )}
    </>
  );
};

export default UploadFile;
