import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { fetchPosts } from "../redux/slices/post/post";
import EmojiPicker from 'emoji-picker-react';

export default function CreatePostModel({ show, handleClose }) {
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState("");
  const [image, setImage] = useState([]);
  const [video, setVideo] = useState([]);
  const [isOpen, setIsOpen] = useState(false)
  const dispatch = useDispatch();

  const selectImage = () => {
    const input = document.getElementById("fileInput");
    input.click();
  };

  const selectVideo = () => {
    const input = document.getElementById("videoInput");
    input.click();
  };

  const handleChange = (e) => {
    setContent(e.target.value);
  };

  const addPost = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const token = localStorage.getItem("token");
    var data = new FormData();
    if (image.length > 0)
      data.append("image", image[0]);

    data.append("content", content);

    if (video.length > 0)
      data.append("video", video[0]);

    var config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_BACKEND_URL}/v1/post/add`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        const res = response.data;
        if (res.success) {
          setIsLoading(false);
          let config = {
            method: "get",
            maxBodyLength: Infinity,
            url: `${process.env.REACT_APP_BACKEND_URL}/v1/post`,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };

          axios(config).then((res) => {
            dispatch(fetchPosts(res.data.posts));
          });

          toast.success("Resource Posted Successfully");
          setContent("");
          setImage([]);
          setVideo([]);
          handleClose();
        } else {
          toast.error(`${res.message}`);
        }
      })
      .catch(function (error) {
        e.reset();
        console.log(error);
      }).finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
     
      <div className={show ? "display-block" : "display-none"}>

        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>Create a Resource</h2>
              <button className="close-modal" onClick={() => {
                handleClose()
                setContent("")
                setImage([])
                setVideo([])
              }}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              <form
                className="blog-form"
                encType="multipart/form-data"
                onSubmit={(e) => addPost(e)}
              >
                <textarea
                  name=""
                  id=""
                  value={content}
                  onChange={handleChange}
                  placeholder="Meditation Description......"
                ></textarea>
                <br />

                {image.length > 0 && (
                  <div className="image-preview" style={{
                    'width': '100%',
                    'height': '260px'

                  }}>
                    <img width="100" style={{
                      'width': '100%',
                      'height': '100%'
                    }} src={URL.createObjectURL(image[0])} alt="" />
                  </div>
                )}

                {
                  video.length > 0 && (
                    <div className="image-preview" style={{
                      'width': '100%',
                      'height': '260px'

                    }}>
                      <video width="100" style={{
                        'width': '100%',
                        'height': '100%'
                      }} src={URL.createObjectURL(video[0])} alt="" controls />
                    </div>
                  )
                }

                <input
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    setImage(e.target.files);
                    setVideo([])
                  }}
                />
                <input
                  id="videoInput"
                  type="file"
                  accept="video/*"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    setVideo(e.target.files);
                    setImage([])
                  }}
                />

                {isOpen && (
                  <div style={{ position: 'absolute', border: '1px solid gray', padding: '10px', background: 'white' }}>
                    <div>
                      <EmojiPicker onEmojiClick={(e) => {
                        setContent(content + e.emoji)
                        setIsOpen(false)
                      }
                      } />
                    </div>
                  </div>
                )}
                <hr />
                <div className="post">
                  <div className="icons">
                    <span>
                      <i
                        onClick={() => selectImage()}
                        className="fa-regular fa-image"
                      ></i>
                    </span>
                    <span>
                      <i onClick={() => setIsOpen(true)} className="fa-regular fa-face-smile"></i>
                    </span>
                    <span>
                      <i onClick={() => selectVideo()} className="fa-solid fa-video"></i>
                    </span>
                  </div>
                  <div className="submittion">
                    <button disabled={isLoading}>
                      {isLoading ? <i className="fa fa-spinner fa-spin"></i> : "Create"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
