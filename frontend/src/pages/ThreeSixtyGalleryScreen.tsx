import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { PageWrapper } from '../components/PageWrapper';
import { AppNavigation } from '../components/AppNavigation';
import { AppHeader } from '../components/AppHeader';
import ScreenStatusHandler from '../components/ScreenStatusHandler';
import { APP_ROUTES, getProjectCategoryNavItems } from '@/helpers/constants.tsx';
import type { Content, CreateContentPayload, UpdateContentPayload } from '@/interfaces/contentInterfaces.ts';
import type { Project } from '@/interfaces/projectInterfaces.ts';
import type { APIError } from '@/interfaces/apiErrorsInterfaces.ts';
import { getProject } from '@/api/services/projectService';
import { createContent, getContentsByProjectAndCategory, updateContent, deleteContent } from '@/api/services/contentService';
import { ContentCard } from "@/components/ContentCard.tsx";
import { TbView360Arrow } from "react-icons/tb";
import { ContentForm } from "@/components/ContentForm.tsx";
import { Modal } from "@/components/Modal.tsx";
import { useAuth } from "@/context/AuthContext.tsx";
import { FloatingActionButton } from '@/components/FloatingActionButton';
import { ConfirmationModal } from '@/components/ConfirmationModal';

export const ThreeSixtyGalleryScreen: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<Content | null>(null);
  const [contentToDelete, setContentToDelete] = useState<Content | null>(null);

  const navItems = useMemo(() => projectId ? getProjectCategoryNavItems(projectId, navigate) : [], [projectId, navigate]);

  // CORREÇÃO: Padronizando a queryKey
  const galleryQueryKey = ['gallery', projectId, '360view'];

  const { data, isLoading: isLoadingScreenData, error: screenError } = useQuery<{project: Project, views: Content[]}, APIError>({
    queryKey: galleryQueryKey, // Usando a chave padronizada
    queryFn: async () => {
      if (!projectId) throw new Error("Project ID is required");
      const [projectData, viewsData] = await Promise.all([
        getProject(+projectId),
        getContentsByProjectAndCategory({ projectId: +projectId, category: '360view' })
      ]);
      return { project: projectData, views: viewsData };
    },
    enabled: !!projectId,
  });

  const contentMutation = useMutation({
    mutationFn: (vars: { payload: CreateContentPayload | UpdateContentPayload, editingId?: number }) => {
      const { payload, editingId } = vars;
      if (editingId) {
        return updateContent(editingId, payload as UpdateContentPayload);
      }
      return createContent(payload as CreateContentPayload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: galleryQueryKey }); // Usando a chave padronizada
      setIsFormModalOpen(false);
      toast.success('View saved successfully!');
    },
    onError: (e: APIError) => toast.error(`Error saving view: ${e.message}`),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteContent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: galleryQueryKey }); // Usando a chave padronizada
      setIsConfirmModalOpen(false);
      toast.success('View deleted successfully!');
    },
    onError: (e: APIError) => toast.error(`Error deleting view: ${e.message}`),
  });

  const handleFormSubmit = (data: { contentName: string; url: string; previewImageFile?: FileList }) => {
    if (!projectId) return;
    const imageFile = data.previewImageFile && data.previewImageFile[0] ? data.previewImageFile[0] : undefined;

    if (editingContent) {
      contentMutation.mutate({ payload: { ...data, previewImageFile: imageFile }, editingId: editingContent.contentId });
    } else {
      contentMutation.mutate({ payload: { ...data, projectId: +projectId, category: '360view', previewImageFile: imageFile } });
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

  const handleViewClick = (viewId: number) => {
    if (projectId) {
      navigate(`${APP_ROUTES.PROJECT_DETAIL_BASE}/${projectId}${APP_ROUTES.THREE_SIXTY_VIEW_RELATIVE}/${viewId}`);
    }
  };

  return (
    <>
      <ScreenStatusHandler isLoading={isLoadingScreenData} error={screenError} data={data} navItems={navItems} notFoundMessage="Project not found.">
        {(loadedData) => (
          <PageWrapper hasSidebar={true}>
            <AppNavigation items={navItems} />
            <div className="md:ml-56 lg:ml-64 flex flex-col w-full h-full">
              <AppHeader projectTitle={loadedData.project.projectName} screenTitle="360° Views" screenIcon={TbView360Arrow}/>
              <main className="px-4 py-4 flex-grow overflow-y-auto">
                {loadedData.views.length === 0 && !isLoadingScreenData && (
                  <p className="text-center text-slate-300">No 360 views found for this project.</p>
                )}
                <div className="max-w-6xl mx-auto">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {loadedData.views.map((view) => (
                      <ContentCard key={view.contentId} view={view}
                                   onClick={() => handleViewClick(view.contentId)}
                                   onEdit={() => openEditModal(view)}
                                   onDelete={() => handleDeleteRequest(view)}
                      />
                    ))}
                  </div>
                </div>
              </main>
            </div>
          </PageWrapper>
        )}
      </ScreenStatusHandler>

      {user?.isMasterAdmin && <FloatingActionButton onClick={openCreateModal} ariaLabel="Add new 360 view"/>}

      <Modal isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} title={editingContent ? "Edit 360 View" : "Create New 360 View"}>
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
        title="Confirm Deletion"
        message={`Are you sure you want to delete the view "${contentToDelete?.contentName}"?`}
        isConfirming={deleteMutation.isPending}
      />
    </>
  );
};
