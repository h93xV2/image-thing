'use client';

import * as React from 'react';
import { Button } from '@components/ui/button';

interface DeleteButtonProps {
  cid: string;
  buttonText?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg';
}

const DeleteButton: React.FC<DeleteButtonProps> = ({
  cid,
  buttonText = 'Delete',
  variant = 'destructive', // Default variant is destructive for a delete button
  size = 'default',
  ...props
}) => {
  const handleClick = () => {
    fetch('/api/upload', {
      method: 'DELETE',
      body: JSON.stringify({ pinataCids: [cid] })
    }).then(() => {
      console.log('Delete successful');
    }).catch(console.error);
  };

  return (
    <Button variant={variant} size={size} onClick={handleClick} {...props}>
      {buttonText}
    </Button>
  );
};

export default DeleteButton;