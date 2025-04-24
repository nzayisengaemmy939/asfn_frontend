import React, { useState } from "react";
import { sendReply } from "../../api_service/report/report"; // make sure this path is correct

const ReplyComponent = ({ reportId, senderRole = "authority", token, onReplySent }) => {
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCancel = () => {
    setShowReply(false);
    setReplyText("");
  };

  const handleSubmit = async () => {
    if (!replyText.trim()) return;

    try {
      setIsSubmitting(true);
      await sendReply(reportId, replyText, senderRole, token);
      setShowReply(false);
      setReplyText("");
      onReplySent?.(); 
    } catch (error) {
      console.error("Failed to send reply:", error.message);
      alert("Failed to send reply.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-2">
      {!showReply ? (
        <button
          onClick={() => setShowReply(true)}
          className="bg-gray-400 text-white px-3 py-1 rounded"
        >
          Reply
        </button>
      ) : (
        <div className="space-y-2">
          <textarea
            className="w-[600px] min-h-[44px] px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your reply..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              className="text-blue-500"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Submit"}
            </button>
            <button
              onClick={handleCancel}
              className="text-gray-400"
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReplyComponent;
