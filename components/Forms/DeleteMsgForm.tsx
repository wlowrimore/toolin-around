"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckIcon, AlertCircle } from "lucide-react";
import { LoadingSpinner, LoadingSpinnerRed } from "../LoadingAnimations";

interface DeleteMsgFormProps {
  messageId: string;
  onDelete?: (success: boolean) => void;
}

const DeleteMsgForm = ({ messageId, onDelete }: DeleteMsgFormProps) => {
  const [checked, setChecked] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isReferenceError, setIsReferenceError] = useState(false);

  const handleCheck = () => {
    setChecked(!checked);
    // Clear any previous errors when checking/unchecking
    setError(null);
    setIsReferenceError(false);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling

    if (!checked || isDeleting) return;

    try {
      setIsDeleting(true);
      setError(null);
      setIsReferenceError(false);

      console.log("Sending delete request for message:", messageId);

      const response = await fetch("/api/conversations/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Delete API error:", data);

        if (response.status === 409 || data.type === "reference_error") {
          setIsReferenceError(true);
          setError(
            "This message can't be deleted because it's part of a conversation"
          );
        } else {
          setError(data.error || "Failed to delete message");
        }

        onDelete?.(false);
        return;
      }

      console.log("Delete successful:", data);
      onDelete?.(true);
      setChecked(false);
    } catch (err) {
      console.error("Delete request failed:", err);
      setError("An error occurred while deleting");
      onDelete?.(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
      <Checkbox
        id={`delete-message-${messageId}`}
        checked={checked}
        onCheckedChange={handleCheck}
        className="w-4 h-4 border-2 border-cyan-800 data-[state=checked]:bg-cyan-800 rounded"
      >
        {checked && <CheckIcon className="h-3 w-3 text-white" />}
      </Checkbox>

      {checked && (
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="ml-2 text-xs font-semibold uppercase tracking-wide bg-white p-2 text-red-600 hover:text-red-800"
        >
          <span className="flex items-center gap-2">
            {isDeleting && <LoadingSpinnerRed />}
            {isDeleting ? "Deleting Message & Conversation..." : "Delete"}
          </span>
        </button>
      )}

      {error && (
        <div className="text-xs text-red-600 bg-white p-2 flex items-center">
          {isReferenceError && <AlertCircle size={12} className="mr-1" />}
          {error}
        </div>
      )}
    </div>
  );
};

export default DeleteMsgForm;
