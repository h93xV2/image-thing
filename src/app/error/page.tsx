'use client';

import { Button } from '@components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@components/ui/card";
import { useRouter } from 'next/navigation';
import { AlertCircle } from 'lucide-react';

export default function ErrorPage() {
  const router = useRouter();

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <div className="flex justify-center max-w-md mx-auto mt-10">
      <Card className="w-full max-w-sm">
        <CardHeader className="flex items-center justify-center space-y-2">
          <AlertCircle className="text-red-500 w-10 h-10" />
          <CardTitle className="text-2xl">Oops! Something went wrong</CardTitle>
          <CardDescription>
            We&apos;re sorry, but an unexpected error has occurred.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-600">
            Please try again later or return to the homepage.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button onClick={handleGoHome} className="w-full">Go to Homepage</Button>
        </CardFooter>
      </Card>
    </div>
  );
}