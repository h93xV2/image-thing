"use client";

import { useState, FC } from "react";
import { Button } from "@components/ui/button";
import { Check, Copy } from "lucide-react";

interface CopyButtonProps {
  url: string;
  altText: string;
}

const CopyImageTagButton: FC<CopyButtonProps> = ({ url, altText, ...props }) => {
  const [copied, setCopied] = useState(false);

  const imgTag = `<img src="${url}" alt="${altText}" />`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(imgTag);

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <Button variant="ghost" size="icon" onClick={handleCopy} {...props}>
      {copied ? (
        <Check className="animate-pulse" />
      ) : (
        <Copy />
      )}
    </Button>
  )
};

export default CopyImageTagButton;