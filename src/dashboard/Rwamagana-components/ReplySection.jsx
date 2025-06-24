const ReplySection = ({ reports, expandedReports }) => {
  const expandedReportsWithReplies = reports.filter((report) =>
    expandedReports.includes(report._id)
  );

  if (expandedReportsWithReplies.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 space-y-4">
      {expandedReportsWithReplies.map((report) => (
        <div
          key={report._id}
          className="bg-blue-50 rounded-lg p-4 border border-blue-200"
        >
          <h4 className="font-semibold text-blue-700 mb-3">
            Replies for Report from {report.district}
          </h4>
          {report.replies && report.replies.length > 0 ? (
            <div className="space-y-2">
              {report.replies.map((reply, idx) => (
                <div
                  key={idx}
                  className="bg-white p-3 rounded-md shadow-sm"
                >
                  <p className="text-sm text-gray-800">{reply.message}</p>
                  <div className="text-xs text-gray-500 flex justify-between mt-2">
                    <span className="capitalize">From: {reply.senderRole}</span>
                    <span>{new Date(reply.sentAt).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-600">No replies yet.</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default ReplySection;