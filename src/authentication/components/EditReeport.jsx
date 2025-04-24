export default function EditReport({
    editForm,
    onChange,
    onSave,
    onCancel,
    reportId,
  })
  
  {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
        <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md space-y-3">
          <input
            name="district"
            value={editForm.district}
            onChange={onChange}
            className="border px-3 py-1 rounded w-full"
            placeholder="District"
          />
          <input
            name="sector"
            value={editForm.sector}
            onChange={onChange}
            className="border px-3 py-1 rounded w-full"
            placeholder="Sector"
          />
          <input
            name="cell"
            value={editForm.cell}
            onChange={onChange}
            className="border px-3 py-1 rounded w-full"
            placeholder="Cell"
          />

          <textarea
            name="symptoms"
            value={editForm.symptoms}
            onChange={onChange}
            className="border px-3 py-1 rounded w-full"
            rows={2}
            placeholder="Symptoms"
          />
          <input
            name="pigsAffected"
            type=""
            value={editForm.numberOfPigsAffected}
            onChange={onChange}
            className="border px-3 py-1 rounded w-full"
            placeholder="Pigs Affected"
          />
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => onSave(reportId)}
              className="bg-blue-600 text-white px-3 py-1 rounded"
            >
              Update
            </button>
            <button
              onClick={onCancel}
              className="bg-gray-400 text-white px-3 py-1 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }
  