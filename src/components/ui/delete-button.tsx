'use client';

import { Button } from '@components/ui/button';
import { DeleteRequest } from '@lib/types';
import { Loader, Trash2 } from 'lucide-react';
import { FC, useState } from 'react';

interface DeleteButtonProps {
  id: number;
}

const DeleteButton: FC<DeleteButtonProps> = ({
  id,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);

    const requestBody: DeleteRequest = { ids: [id] };

    fetch('/api/upload', {
      method: 'DELETE',
      body: JSON.stringify(requestBody)
    })
      .then(() => {
        console.log('Delete successful');
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  };

  return (
    <Button variant="ghost" size="icon" onClick={handleClick} {...props} disabled={isLoading}>
      {isLoading ? <Loader className="animate-spin" /> : <Trash2 color="red" />}
    </Button>
  );
};

export default DeleteButton;