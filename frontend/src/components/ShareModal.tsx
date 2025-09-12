import React, { useState } from "react";
import { Modal } from "./Modal";
import { FiCopy, FiCheck } from "react-icons/fi";
import { createShareLink } from "@/api/services/contentService";
import type { Content } from "@/interfaces/contentInterfaces";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: Content | null;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  content,
}) => {
  const [expiresIn, setExpiresIn] = useState(3600); // 1 hour default
  const [shareableLink, setShareableLink] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const handleGenerateLink = async () => {
    if (content) {
      try {
        const data = await createShareLink(content.contentId, expiresIn);
        setShareableLink(data.shareableLink);
        setIsCopied(false);
      } catch (error) {
        console.error("Failed to generate share link:", error);
        alert("Failed to generate share link.");
      }
    }
  };

  const handleCopy = () => {
    if (shareableLink) {
      navigator.clipboard.writeText(shareableLink);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share Content">
      <div className="space-y-4">
        <div>
          <label
            htmlFor="expiresIn"
            className="block text-sm font-medium text-sky-200 mb-1"
          >
            Expires In
          </label>
          <select
            id="expiresIn"
            value={expiresIn}
            onChange={(e) => setExpiresIn(Number(e.target.value))}
            className="h-10 w-full bg-sky-700 px-3 text-white rounded-md border border-sky-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            <option value={3600}>1 Hour</option>
            <option value={86400}>1 Day</option>
            <option value={604800}>1 Week</option>
          </select>
        </div>
        <button
          onClick={handleGenerateLink}
          className="w-full px-4 py-2 text-sm font-semibold text-white bg-cyan-500 hover:bg-cyan-600 rounded-md"
        >
          Generate Link
        </button>
        {shareableLink && (
          <div className="flex items-center space-x-2">
            <input
              type="text"
              readOnly
              value={shareableLink}
              className="h-10 w-full bg-sky-700 px-3 text-white rounded-md border border-sky-600"
            />
            <button
              onClick={handleCopy}
              className="p-2 rounded-md bg-sky-700 hover:bg-sky-600"
            >
              {isCopied ? <FiCheck className="text-green-400" /> : <FiCopy />}
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};
