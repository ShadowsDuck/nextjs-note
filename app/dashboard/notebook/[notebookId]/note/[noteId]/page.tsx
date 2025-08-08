import { PageWrapper } from "@/components/page-wrapper";
import RichTextEditor from "@/components/rich-text-editor";
import { getNoteById } from "@/lib/actions/notes";
import { type JSONContent } from "@tiptap/react";

type Params = Promise<{
  noteId: string;
}>;

const NotePage = async ({ params }: { params: Params }) => {
  const { noteId } = await params;

  const { note } = await getNoteById(noteId);

  return (
    <PageWrapper
      breadcrumbs={[
        { label: "DashBoard", href: "/dashboard" },
        {
          label: note?.notebook?.name ?? "Notebook",
          href: `/dashboard/notebook/${note?.notebook?.id}`,
        },
        {
          label: note?.title ?? "Note",
          href: `/dashboard/notebook/${note?.notebook?.id}/note/${noteId}`,
        },
      ]}
    >
      {note?.title}
      <RichTextEditor
        content={note?.content as JSONContent[]}
        noteId={noteId}
      />
    </PageWrapper>
  );
};

export default NotePage;
