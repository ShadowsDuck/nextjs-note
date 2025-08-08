import { CreateNoteButton } from "@/components/create-note-button";
import NoteCard from "@/components/note-card";
import { PageWrapper } from "@/components/page-wrapper";
import { getNotebookById } from "@/lib/actions/notebooks";

type Params = Promise<{
  notebookId: string;
}>;

const NotebookPage = async ({ params }: { params: Params }) => {
  const { notebookId } = await params;

  const { notebook } = await getNotebookById(notebookId);

  return (
    <PageWrapper
      breadcrumbs={[
        { label: "DashBoard", href: "/dashboard" },
        {
          label: notebook?.name ?? "Notebook",
          href: `/dashboard/${notebookId}`,
        },
      ]}
    >
      {notebook?.name}

      <CreateNoteButton notebookId={notebookId} />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {notebook &&
          notebook?.notes?.map((note) => (
            <NoteCard key={note.id} note={note}></NoteCard>
          ))}
      </div>

      {notebook && notebook.notes.length === 0 && <div>No notes found</div>}
    </PageWrapper>
  );
};

export default NotebookPage;
