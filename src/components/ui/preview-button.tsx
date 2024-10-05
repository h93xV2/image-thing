'use client';

import * as React from 'react';
import { Button } from '@components/ui/button';

interface PreviewButtonProps {
  cid: string;
  buttonText?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg';
}

const PreviewButton: React.FC<PreviewButtonProps> = ({
  cid,
  buttonText = 'Preview',
  variant = 'default',
  size = 'default',
  ...props
}) => {
  const handleClick = () => {
    fetch('/api/preview', {
      method: 'POST',
      body: JSON.stringify({cid})
    }).then(response => {
      response.json().then(data => {
        console.log(data.url);
        window.open(data.url, '_blank', 'noopener,noreferrer');
      })
    })
  };

  // TODO: Look into displaying a small thumbnail or open the image in an overlay
  return (
    <Button variant={variant} size={size} onClick={handleClick} {...props}>
      {buttonText}
    </Button>
  );
};

export default PreviewButton;
