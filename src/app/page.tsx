import { redirect } from 'next/navigation';
import { getUploads } from "@lib/supabase";
import FileUpload from "@components/ui/file-upload";
import UploadsTable from "@components/ui/uploads-table";
import { createClient } from "@lib/supabase/server";

export default async function Home() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect('/login');
  }

  // TODO: Logout button.

  const uploads = await getUploads(supabase) ?? [];

  return (
    <div>
      <FileUpload />
      <UploadsTable data={uploads} />
    </div>
  );
}
