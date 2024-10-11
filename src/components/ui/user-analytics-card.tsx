
import { FC } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@components/ui/card";

interface UserAnalyticsCardProps {
  totalFiles: number;
  publicFiles: number;
  privateFiles: number;
}

const UserAnalyticsCard: FC<UserAnalyticsCardProps> = ({ totalFiles, publicFiles, privateFiles }) => {
  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle className="text-lg">File Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-semibold text-gray-700">Total Files:</span>
          <span className="text-lg font-bold text-gray-900">{totalFiles}</span>
        </div>
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm text-gray-700">Public Files:</span>
          <span className="text-lg text-green-600 font-medium">{publicFiles}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-700">Private Files:</span>
          <span className="text-lg text-blue-600 font-medium">{privateFiles}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserAnalyticsCard;