import * as React from "react";
import { SearchForm } from "@/components/search-form";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { getNotebooks } from "@/lib/actions/notebooks";
import Image from "next/image";
import SidebarData from "./sidebar-data";
import Link from "next/link";
import { Suspense } from "react";
import { Skeleton } from "./ui/skeleton";

const SearchLoading = () => <Skeleton className="h-8 w-full" />;
const SidebarNavLoading = () => (
  <div className="p-2 space-y-2">
    <Skeleton className="h-6 w-3/4" />
    <Skeleton className="h-6 w-1/2" />
    <Skeleton className="h-6 w-2/3" />
  </div>
);

export async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const notebooks = await getNotebooks();

  const data = {
    versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
    navMain: [
      ...(notebooks?.notebooksByUser?.map((notebook) => ({
        title: notebook.name,
        url: `/dashboard/${notebook.id}`,
        items: notebook?.notes?.map((note) => ({
          title: note.title,
          url: `/dashboard/notebook/${notebook.id}/note/${note.id}`,
        })),
      })) ?? []),
    ],
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Link
            href="/"
            aria-label="home"
            className="flex items-center space-x-2"
          >
            <Image
              src="/noteforge-logo.png"
              alt="logo"
              width={48}
              height={48}
            />
            <h2 className="text-2xl">NS Note</h2>
          </Link>
        </div>

        <Suspense fallback={<SearchLoading />}>
          <SearchForm />
        </Suspense>
      </SidebarHeader>
      <SidebarContent className="gap-0">
        <Suspense fallback={<SidebarNavLoading />}>
          <SidebarData data={data} />
        </Suspense>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
