import React from "react";

function MessageInput({ handleSubmit, message, setMessage, isSending }) {
  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-row items-center p-2 border-t"
    >
      <input
        type="text"
        value={message}
        placeholder="Type your message here..."
        className="flex-1 border rounded-md p-2 outline-none"
        onChange={(e) => setMessage(e.target.value)}
      />
      <button className="ml-2 bg-primary text-white rounded- py-2 px-3">
        {isSending ? (
          <i className="fa fa-spinner fa-spin"></i>
        ) : (
          <i className="fa fa-paper-plane"></i>
        )}
      </button>
    </form>
  );
}

export default MessageInput;
