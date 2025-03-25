import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  selectingPostToEdit,
} from "../redux/slices/post/post";
import EmojiPicker from "emoji-picker-react";
import { useUpdatePostMutation } from "../redux/services/post/post-api";

export default function EditPostModel({ show, handleClose }) {
  const { selectedPostToEdit } = useSelector((state) => state.posts);
  const selectedPost = selectedPostToEdit;
  const [updatePost, { isLoading }] = useUpdatePostMutation();

  const [content, setContent] = useState(selectedPost && selectedPost.content);
  const [imageUrl, setImageUrl] = useState(
    selectedPost.image && selectedPost.image != "" ? [selectedPost.image] : []
  );
  const [videoUrl, setVideoUrl] = useState(
    selectedPost.video && selectedPost.video != "" ? [selectedPost.video] : []
  );
  const [image, setImage] = useState([]);
  const [video, setVideo] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();

  const selectImage = () => {
    const input = document.getElementById("fileInput");
    input.click();
    input.onchange = (e) => {
      dispatch(
        selectingPostToEdit({
          ...selectedPost,
          image_img: e.target.files[0],
          isLocal: true,
        })
      );
    };
  };

  const selectVideo = () => {
    const input = document.getElementById("videoInput");
    input.click();
    input.onchange = (e) => {
      dispatch(
        selectingPostToEdit({
          ...selectedPost,
          video: e.target.files[0],
          isLocal: true,
        })
      );
    };
  };

  const handleChange = (value) => {
    setContent(value);
    dispatch(selectingPostToEdit({ ...selectedPost, content: value }));
  };

  const editPost = async (e) => {
    e.preventDefault();
    var data = new FormData();
    if (image.length > 0) data.append("image", image[0]);

    data.append("content", content);

    if (video.length > 0) data.append("video", video[0]);

    try {
      const { post, message } = await updatePost({
        postId: selectedPostToEdit?._id, post: {
          content: selectedPostToEdit.content,
        }
      }).unwrap();
      (message && toast.success(`${message}`)) ||
        (post && toast.success(`${post.name} deleted`));
      handleClose();
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong.");
    }

  };

  return (
    <>

      <div className={show ? "display-block" : "display-none"}>
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3 className="font-black text-Secondary underline text-sm">Edit Resource</h3>
              <button
                className="close-modal"
                onClick={() => {
                  handleClose();
                }}
              >
                &times;
              </button>
            </div>
            <div className="modal-body">
              <form
                className="blog-form"
                encType="multipart/form-data"
                onSubmit={(e) => editPost(e)}
              >
                <textarea
                  name=""
                  id=""
                  value={selectedPost && selectedPost.content}
                  onChange={(e) => handleChange(e.target.value)}
                  placeholder="| Feel to say ......"
                ></textarea>
                <br />

                {/* {!selectedPostToEdit.isLocal&&imageUrl.length > 0 && (
                  <div className="image-preview" style={{
                    'width':'100%',
                    'height':'260px'
                
                  }}>
                    <img width="100" style={{
                      'width':'100%',
                      'height':'100%'
                    }} alt={imageUrl[0]} src={imageUrl[0]}  />
                  </div>
                )} */}
                {/*     
                {selectedPostToEdit.isLocal&&selectedPostToEdit.isLocal==true && (
                  <div className="image-preview" style={{
                    'width':'100%',
                    'height':'260px'
                
                  }}>
                    <img width="100" style={{
                      'width':'100%',
                      'height':'100%'
                    }} src={URL.createObjectURL(selectedPostToEdit.image_img)} alt="" />
                  </div>
                )}

                {
                  video.length > 0 && (
                    <div className="image-preview" style={{
                      'width':'100%',
                      'height':'260px'
                  
                    }}>
                      <video width="100" style={{
                        'width':'100%',
                        'height':'100%'
                      }} src={URL.createObjectURL(video[0])} alt="" controls />
                    </div>
                  )
                }

                <input
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  name="image_img"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    dispatch(selectingPostToEdit({...selectedPost,image_img:e.target.files[0],isLocal:true}))
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
                /> */}

                {isOpen && (
                  <div
                    style={{
                      position: "absolute",
                      border: "1px solid gray",
                      padding: "10px",
                      background: "white",
                    }}
                  >
                    <div>
                      <EmojiPicker
                        onEmojiClick={(e) => {
                          handleChange(selectedPost.content + e.emoji);
                          // setContent(content + e.emoji)
                          setIsOpen(false);
                        }}
                      />
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
                      <i
                        onClick={() => setIsOpen(true)}
                        className="fa-regular fa-face-smile"
                      ></i>
                    </span>
                    <span>
                      <i
                        onClick={() => selectVideo()}
                        className="fa-solid fa-video"
                      ></i>
                    </span>
                    <span>
                      <i className="fa-solid fa-location-dot"></i>
                    </span>
                  </div>
                  <div className="submittion">
                    {isLoading ? (
                      <button disabled>
                        <i className="fa fa-spinner fa-spin"></i>
                      </button>
                    ) : (
                      <button>Update</button>
                    )}
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
