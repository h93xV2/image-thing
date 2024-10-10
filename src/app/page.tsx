import { redirect } from 'next/navigation';
import { getUploads } from "@lib/supabase";
import FileUpload from "@components/ui/file-upload";
import UploadsTable from "@components/ui/uploads-table";
import { createClient } from "@lib/supabase/server";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList
} from "@/components/ui/navigation-menu";
import LogOutButton from '@components/ui/logout-button';

export default async function Home() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect('/login');
  }

  const uploads = await getUploads(supabase) ?? [];

  return (
    <div>
      <NavigationMenu className="w-full p-4">
        <NavigationMenuList id="list" className="flex w-full justify-end max-w-7xl mx-auto">
          {/* Right-aligned Logout Button using shadcn's Button component */}
          <NavigationMenuItem>
            <LogOutButton />
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <FileUpload />
      <UploadsTable data={uploads} />
    </div>
  );
}
