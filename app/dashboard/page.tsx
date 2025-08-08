import { CreateNotebookButton } from "@/components/create-notebook-button copy";
import NotebookCard from "@/components/notebook-card";
import { PageWrapper } from "@/components/page-wrapper";
import { getNotebooks } from "@/lib/actions/notebooks";
import React, { Suspense } from "react";

const DashBoard = async () => {
  const notebooks = await getNotebooks();

  return (
    <Suspense fallback={<div>Loading Page...</div>}>
      <PageWrapper breadcrumbs={[{ label: "DashBoard", href: "/dashboard" }]}>
        <h1>Notebooks</h1>

        <Suspense fallback={<div>Loading...</div>}>
          <CreateNotebookButton />
        </Suspense>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {notebooks.success &&
            notebooks?.notebooksByUser?.map((notebook) => (
              <Suspense
                key={notebook.id}
                fallback={<div>Loading notebook...</div>}
              >
                <NotebookCard notebook={notebook} />
              </Suspense>
            ))}
        </div>

        {notebooks.success && notebooks?.notebooksByUser?.length === 0 && (
          <div>No notebooks found</div>
        )}
      </PageWrapper>
    </Suspense>
  );
};

export default DashBoard;
