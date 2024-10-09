'use client';

import { Button } from "@components/ui/button";
import { PinRequest } from "@lib/types";
import { Pin, PinOff, Loader } from "lucide-react";
import { FC, useState } from "react";

interface PinButtonProps {
  id: number,
  isInitiallyPinned: boolean
}

const PinButton: FC<PinButtonProps> = ({
  id,
  isInitiallyPinned,
  ...props
}) => {
  const [isPinned, setIsPinned] = useState(isInitiallyPinned);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);

    const body: PinRequest = { id };

    fetch('/api/upload', {
      method: 'PATCH',
      body: JSON.stringify(body)
    })
    .then(() => setIsPinned(!isPinned))
    .catch(console.error)
    .finally(() => setIsLoading(false));
  };

  return (
    <Button variant="ghost" size="icon" onClick={handleClick} disabled={isLoading} {...props}>
      {
        isLoading ? (
          <Loader className="animate-spin" />
        ) : !isPinned ? (
          <Pin className="text-green-500" />
        ) : (
          <PinOff className="text-gray-500" />
        )
      }
    </Button>
  );
};

export default PinButton;