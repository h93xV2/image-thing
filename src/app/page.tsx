import { getUploads } from "@/lib/supabase";
import FileUpload from "@components/ui/file-upload";
import UploadsTable from "@components/ui/uploads-table";

export default async function Home() {
  const uploads = await getUploads() ?? [];

  return (
    <div>
      <FileUpload />
      <UploadsTable data={uploads} />
    </div>
  );
}
