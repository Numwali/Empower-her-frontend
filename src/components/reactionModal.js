import User from "./user";

export default function ReactionModal({
  showReaction,
  handleCloseReaction,
  users,
}) {
  return (
    <>
      <div className={showReaction ? "display-block" : "display-none"}>
        <div className="modal-overlay reaction">
          <div className="modal-container">
            <div className="modal-header">
              <h2>Post Reactions</h2>
              <button
                className="close-modal"
                onClick={() => handleCloseReaction()}
              >
                &times;
              </button>
            </div>
            <div className="modal-body">
              {users.map((item,index) => (
                <User key={index} userInfor={item.user} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
