'use client';

import { FC } from 'react';
import { Button } from '@components/ui/button';
import { ExternalLink } from 'lucide-react';
import { PreviewRequest } from '@lib/types';

interface PreviewButtonProps {
  pinataCid: string;
}

const PreviewButton: FC<PreviewButtonProps> = ({
  pinataCid,
  ...props
}) => {
  const handleClick = () => {
    const requestBody: PreviewRequest = { pinataCid };

    fetch('/api/preview', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    }).then(response => {
      response.json().then(data => {
        console.log(data.url);
        window.open(data.url, '_blank', 'noopener,noreferrer');
      })
    })
  };

  // TODO: Look into displaying a small thumbnail or open the image in an overlay
  return (
    <Button variant="ghost" size="icon" onClick={handleClick} {...props}>
      <ExternalLink />
    </Button>
  );
};

export default PreviewButton;
