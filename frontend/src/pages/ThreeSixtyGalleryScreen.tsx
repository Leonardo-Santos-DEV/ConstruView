import React, { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { PageWrapper } from "../components/PageWrapper";
import { AppNavigation } from "../components/AppNavigation";
import { AppHeader } from "../components/AppHeader";
import ScreenStatusHandler from "../components/ScreenStatusHandler";
import {
  APP_ROUTES,
  getProjectCategoryNavItems,
} from "@/helpers/constants.tsx";
import type {
  Content,
  CreateContentPayload,
  UpdateContentPayload,
} from "@/interfaces/contentInterfaces.ts";
import type { Project } from "@/interfaces/projectInterfaces.ts";
import type { APIError } from "@/interfaces/apiErrorsInterfaces.ts";
import { getProject } from "@/api/services/projectService";
import {
  createContent,
  getContentsByProjectAndCategory,
  updateContent,
  deleteContent,
} from "@/api/services/contentService";
import { TbView360Arrow } from "react-icons/tb";
import { ContentForm } from "@/components/ContentForm.tsx";
import { Modal } from "@/components/Modal.tsx";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { ConfirmationModal } from "@/components/ConfirmationModal";
import { ContentListItem } from "@/components/ContentListItem";
import { ShareModal } from "@/components/ShareModal";

const groupContentByDate = (views: Content[]) => {
  const grouped: { [key: string]: Content[] } = {};
  views.forEach((view) => {
    const date = new Date(view.date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    });
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(view);
  });
  return grouped;
};

export const ThreeSixtyGalleryScreen: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<Content | null>(null);
  const [contentToDelete, setContentToDelete] = useState<Content | null>(null);
  const [contentToShare, setContentToShare] = useState<Content | null>(null);

  const navItems = useMemo(
    () => (projectId ? getProjectCategoryNavItems(projectId, navigate) : []),
    [projectId, navigate]
  );
  const galleryQueryKey = ["gallery", projectId, "360view"];

  const {
    data,
    isLoading: isLoadingScreenData,
    error: screenError,
  } = useQuery<{ project: Project; views: Content[] }, APIError>({
    queryKey: galleryQueryKey,
    queryFn: async () => {
      if (!projectId) throw new Error("Project ID is required");
      const [projectData, viewsData] = await Promise.all([
        getProject(+projectId),
        getContentsByProjectAndCategory({
          projectId: +projectId,
          category: "360view",
        }),
      ]);
      return { project: projectData, views: viewsData };
    },
    enabled: !!projectId,
  });

  const contentMutation = useMutation({
    mutationFn: (vars: {
      payload: CreateContentPayload | UpdateContentPayload;
      editingId?: number;
    }) => {
      const { payload, editingId } = vars;
      if (editingId) {
        return updateContent(editingId, payload as UpdateContentPayload);
      }
      return createContent(payload as CreateContentPayload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: galleryQueryKey });
      setIsFormModalOpen(false);
      toast.success("Vista salva com sucesso!");
    },
    onError: (e: APIError) =>
      toast.error(`Erro ao salvar a vista: ${e.message}`),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteContent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: galleryQueryKey });
      setIsConfirmModalOpen(false);
      toast.success("Vista deletada com sucesso!");
    },
    onError: (e: APIError) =>
      toast.error(`Erro ao deletar a vista: ${e.message}`),
  });

  const handleFormSubmit = (data: {
    contentName: string;
    url: string;
    date: string;
  }) => {
    if (!projectId) return;

    if (editingContent) {
      contentMutation.mutate({
        payload: data,
        editingId: editingContent.contentId,
      });
    } else {
      contentMutation.mutate({
        payload: { ...data, projectId: +projectId, category: "360view" },
      });
    }
  };

  const handleDeleteRequest = (view: Content) => {
    setContentToDelete(view);
    setIsConfirmModalOpen(true);
  };

  const confirmDelete = () => {
    if (contentToDelete) {
      deleteMutation.mutate(contentToDelete.contentId);
    }
  };

  const openCreateModal = () => {
    setEditingContent(null);
    setIsFormModalOpen(true);
  };

  const openEditModal = (view: Content) => {
    setEditingContent(view);
    setIsFormModalOpen(true);
  };

  const handleShareRequest = (view: Content) => {
    setContentToShare(view);
    setIsShareModalOpen(true);
  };

  const handleViewClick = (viewId: number) => {
    if (projectId) {
      navigate(
        `${APP_ROUTES.PROJECT_DETAIL_BASE}/${projectId}${APP_ROUTES.THREE_SIXTY_VIEW_RELATIVE}/${viewId}`
      );
    }
  };

  const groupedViews = data ? groupContentByDate(data.views) : {};

  return (
    <>
      <ScreenStatusHandler
        isLoading={isLoadingScreenData}
        error={screenError}
        data={data}
        navItems={navItems}
        notFoundMessage="Projeto não encontrado ou você não tem permissão para acessá-lo."
      >
        {(loadedData) => (
          <PageWrapper hasSidebar={true}>
            <AppNavigation items={navItems} />
            <div className="md:ml-56 lg:ml-64 flex flex-col w-full h-full">
              <AppHeader
                projectTitle={loadedData.project.projectName}
                screenTitle="360° Views"
                screenIcon={TbView360Arrow}
              />
              <main className="px-4 py-4 flex-grow overflow-y-auto">
                {loadedData.views.length === 0 && !isLoadingScreenData && (
                  <div className="text-center text-slate-300 py-10">
                    <TbView360Arrow
                      size={48}
                      className="mx-auto text-sky-700"
                    />
                    <p className="mt-4">
                      Nenhuma vista 360° encontrada para este projeto.
                    </p>
                  </div>
                )}
                <div className="max-w-4xl mx-auto space-y-6">
                  {Object.entries(groupedViews).map(([date, viewsInDate]) => (
                    <div key={date}>
                      <h3 className="text-lg font-bold text-sky-200 mb-3 border-b border-sky-800 pb-2">
                        {date}
                      </h3>
                      <ul className="space-y-2">
                        {viewsInDate.map((view) => (
                          <ContentListItem
                            key={view.contentId}
                            view={view}
                            onClick={() => handleViewClick(view.contentId)}
                            onEdit={() => openEditModal(view)}
                            onDelete={() => handleDeleteRequest(view)}
                            onShare={() => handleShareRequest(view)}
                          />
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </main>
            </div>
          </PageWrapper>
        )}
      </ScreenStatusHandler>

      <FloatingActionButton
        onClick={openCreateModal}
        ariaLabel="Adicionar nova vista 360"
      />

      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={editingContent ? "Editar Vista 360°" : "Criar Nova Vista 360°"}
      >
        <ContentForm
          onSubmit={handleFormSubmit}
          onCancel={() => setIsFormModalOpen(false)}
          isSubmitting={contentMutation.isPending}
          isEditing={!!editingContent}
          initialData={editingContent}
        />
      </Modal>

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmDelete}
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja deletar a vista "${contentToDelete?.contentName}"?`}
        confirmButtonText="Deletar"
        isConfirming={deleteMutation.isPending}
      />
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        content={contentToShare}
      />
    </>
  );
};
