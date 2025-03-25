import EmojiPicker from "emoji-picker-react";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useCreateCommunityPostMutation } from "../../redux/services/community/community-api";

export default function CreateCommunityPostModel({ show, handleClose }) {
  let { communityId } = useParams();

  // Redux mutation -create community post
  const [createCommunityPost, { isLoading }] = useCreateCommunityPostMutation();

  const [content, setContent] = useState("");
  const [image, setImage] = useState([]);
  const [video, setVideo] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

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

  const addPost = async (e) => {
    e.preventDefault();
    var data = new FormData();
    if (image.length > 0) data.append("image", image[0]);

    data.append("content", content);

    if (video.length > 0) data.append("video", video[0]);

    try {
      const posted = await createCommunityPost({
        communityId,
        post: data,
      }).unwrap();
      posted && toast.success(`posted`);
      setContent("");
      setImage([]);
      setVideo([]);
      handleClose();
    } catch (error) {
      console.log("Error here", error);
      toast.error(error?.data?.message || "Something went wrong.");
    }
  };

  return (
    <>

      <div className={`${show ? "display-block" : "display-none"} `}>
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3 className="text-[18px] font-semibold text-primary">
                Create Post
              </h3>
              <button
                className="close-modal bg-gray-300 text-red-700 p-2 rounded-full"
                onClick={() => {
                  handleClose();
                  setContent("");
                  setImage([]);
                  setVideo([]);
                }}
              >
                &times;
              </button>
            </div>
            <hr className="dark:text-dark-gray-300" />
            <div className="mt-4 ">
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
                  placeholder="| Feel to say ......"
                  className="p-3 rounded-md dark:!text-dark-gray-300"
                ></textarea>
                <br />
                <div className="py-4">
                  {image.length > 0 && (
                    <div
                      className="image-preview"
                      style={{
                        width: "100%",
                        height: "260px",
                      }}
                    >
                      <img
                        width="100"
                        style={{
                          width: "100%",
                          height: "100%",
                        }}
                        src={URL.createObjectURL(image[0])}
                        alt=""
                      />
                    </div>
                  )}

                  {video.length > 0 && (
                    <div
                      className="image-preview"
                      style={{
                        width: "100%",
                        height: "260px",
                      }}
                    >
                      <video
                        width="100"
                        style={{
                          width: "100%",
                          height: "100%",
                        }}
                        src={URL.createObjectURL(video[0])}
                        alt=""
                        controls
                      />
                    </div>
                  )}

                  <input
                    id="fileInput"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      setImage(e.target.files);
                      setVideo([]);
                    }}
                  />
                  <input
                    id="videoInput"
                    type="file"
                    accept="video/*"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      setVideo(e.target.files);
                      setImage([]);
                    }}
                  />

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
                            setContent(content + e.emoji);
                            setIsOpen(false);
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                <hr />
                <div className="flex flex-row items-center justify-between my-2">
                  <div className="flex flex-row items-center gap-3">
                    <span className="cursor-pointer text-gray-600">
                      <i
                        onClick={() => selectImage()}
                        className="fa-regular fa-image"
                      ></i>
                    </span>
                    <span className="cursor-pointer text-gray-600">
                      <i
                        onClick={() => setIsOpen(true)}
                        className="fa-regular fa-face-smile"
                      ></i>
                    </span>
                    <span className="cursor-pointer text-gray-600">
                      <i
                        onClick={() => selectVideo()}
                        className="fa-solid fa-video"
                      ></i>
                    </span>
                  </div>
                  <div className="bg-primary rounded-md">
                    <button disabled={isLoading} className="text-center py-2 pr-2 text-xs rounded-md">
                      {isLoading ? <i className="fa fa-spinner fa-spin"></i> : "Post"}
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
