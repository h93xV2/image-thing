"use client";

import { RetrievedUploadRow } from "@lib/types";
import { FC, useEffect, useState } from "react";
import FileUpload from "./file-upload";
import UploadsTable from "./uploads-table";
import { createClient } from "@lib/supabase/client";
import UserAnalyticsCard from "./user-analytics-card";

interface UploadsProps {
  uploads: RetrievedUploadRow[];
}

const Uploads: FC<UploadsProps> = ({uploads}) => {
  const supabase = createClient();
  const [data, setData] = useState(uploads);

  useEffect(() => {
    const channel = supabase
      .channel("realtime uploads")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "uploads"
        },
        (payload) => {
          setData((prevData) => [...prevData, payload.new as RetrievedUploadRow]);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "uploads",
        },
        (payload) => {
          setData((prevData) => prevData.filter((item) => item.id !== payload.old.id));
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "uploads",
        },
        (payload) => {
          setData((prevData) =>
            prevData.map((item) =>
              item.id === payload.new.id ? (payload.new as RetrievedUploadRow) : item
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, data]);

  const totalFiles = data.length;
  const publicFiles = data.filter(file => file.is_pinned).length;
  const privateFiles = totalFiles - publicFiles;
  
  return (
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-center items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4 mt-10">
          <div className="w-full md:w-1/2 max-w-md">
            <FileUpload />
          </div>
          <div className="w-full md:w-1/2 max-w-md">
            <UserAnalyticsCard 
              totalFiles={totalFiles} 
              publicFiles={publicFiles} 
              privateFiles={privateFiles} 
            />
          </div>
        </div>
        <div className="mt-8">
          <UploadsTable data={data} />
        </div>
      </div>
  );
};

export default Uploads;