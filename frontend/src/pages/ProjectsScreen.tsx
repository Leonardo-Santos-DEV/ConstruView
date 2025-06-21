// CÓDIGO ATUALIZADO - COPIAR E COLAR
import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { PageWrapper } from '../components/PageWrapper';
import { AppNavigation } from '../components/AppNavigation';
import { AppHeader } from '../components/AppHeader';
import ScreenStatusHandler from '../components/ScreenStatusHandler';
import { APP_ROUTES, getTopLevelNavItems } from '@/helpers/constants.tsx';
import type { Project, CreateProjectPayload, UpdateProjectPayload } from '@/interfaces/projectInterfaces.ts';
import { createProject, deleteProject, getAllProjects, updateProject } from '@/api/services/projectService';
import { ProjectCard } from "@/components/ProjectCard.tsx";
import { useAuth } from "@/context/AuthContext.tsx";
import { Modal } from "@/components/Modal.tsx";
import { ProjectForm } from "@/components/ProjectForm.tsx";
import type { Client } from "@/interfaces/clientInterfaces.ts";
import { getAllClients } from "@/api/services/clientService.ts";
import { FloatingActionButton } from '@/components/FloatingActionButton';
import type { APIError } from '@/interfaces/apiErrorsInterfaces';
import { ConfirmationModal } from '@/components/ConfirmationModal'; // Importar o novo modal

export const ProjectsScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Estados para os modais
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true) }, []);

  const { data: projects, isLoading: isLoadingProjects, error: projectsError } = useQuery<Project[], APIError>({
    queryKey: ['projects'],
    queryFn: getAllProjects,
  });

  const { data: clients } = useQuery<Client[], Error>({
    queryKey: ['clients'],
    queryFn: getAllClients,
    enabled: !!user?.isMasterAdmin,
  });

  const createMutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setIsFormModalOpen(false);
      toast.success('Project created successfully!');
    },
    onError: (error: APIError) => toast.error(`Error creating project: ${error.message}`),
  });

  const updateMutation = useMutation({
    mutationFn: (data: { editingId: number; payload: UpdateProjectPayload }) =>
      updateProject(data.editingId, data.payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setIsFormModalOpen(false);
      toast.success('Project updated successfully!');
    },
    onError: (error: APIError) => toast.error(`Error updating project: ${error.message}`),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project deleted successfully!');
      setIsConfirmModalOpen(false);
      setProjectToDelete(null);
    },
    onError: (error: APIError) => toast.error(`Error deleting project: ${error.message}`),
  });

  const navItems = useMemo(() => getTopLevelNavItems(user, navigate), [user, navigate]);

  const handleOpenCreateModal = () => {
    setEditingProject(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (project: Project) => {
    setEditingProject(project);
    setIsFormModalOpen(true);
  };

  const handleDeleteRequest = (project: Project) => {
    setProjectToDelete(project);
    setIsConfirmModalOpen(true);
  };

  const confirmDelete = () => {
    if (projectToDelete) {
      deleteMutation.mutate(projectToDelete.projectId);
    }
  };

  const handleFormSubmit = (data: { projectName: string; imageFile?: FileList; clientId?: string }) => {
    if (!user) return;

    if (editingProject) {
      updateMutation.mutate({
        payload: { projectName: data.projectName },
        editingId: editingProject.projectId
      });
    } else {
      const targetClientId = user.isMasterAdmin ? Number(data.clientId) : user.clientId;
      if (!targetClientId) {
        toast.error("A client must be selected.");
        return;
      }
      const imageFile = data.imageFile && data.imageFile.length > 0 ? data.imageFile[0] : undefined;
      const payload: CreateProjectPayload = {
        projectName: data.projectName,
        imageFile: imageFile,
        clientId: targetClientId,
      };
      createMutation.mutate(payload);
    }
  };

  const handleProjectClick = (projectId: number) => {
    navigate(`${APP_ROUTES.PROJECT_DETAIL_BASE}/${projectId}`);
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <>
      <ScreenStatusHandler isLoading={isLoadingProjects} error={projectsError} data={projects} navItems={navItems} notFoundMessage="No projects found.">
        {(loadedProjects) => (
          <PageWrapper hasSidebar={true}>
            <AppNavigation items={navItems} />
            <div className={`md:ml-56 lg:ml-64 flex flex-col w-full h-full transition-opacity duration-700 ease-out ${isMounted ? 'opacity-100' : 'opacity-0'}`}>
              <AppHeader />
              <main className="px-4 sm:px-6 lg:px-8 py-6 flex-grow overflow-y-auto">
                <h2 className="text-3xl font-bold text-white mb-8 text-center">My Projects</h2>
                <div className="max-w-7xl mx-auto">
                  {loadedProjects.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
                      {loadedProjects.map((project) => (
                        <ProjectCard
                          key={project.projectId}
                          project={project}
                          onClick={() => handleProjectClick(project.projectId)}
                          onEdit={() => handleOpenEditModal(project)}
                          onDelete={() => handleDeleteRequest(project)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </main>
            </div>
          </PageWrapper>
        )}
      </ScreenStatusHandler>

      {user?.isMasterAdmin && <FloatingActionButton onClick={handleOpenCreateModal} ariaLabel="Add new project" />}

      <Modal isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} title={editingProject ? 'Edit Project' : 'Create New Project'}>
        <ProjectForm
          onSubmit={handleFormSubmit}
          onCancel={() => setIsFormModalOpen(false)}
          isSubmitting={isSubmitting}
          isMasterAdmin={user?.isMasterAdmin ?? false}
          clients={clients || []}
          isEditing={!!editingProject}
          initialData={editingProject}
        />
      </Modal>

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        message={`Are you sure you want to delete the project "${projectToDelete?.projectName}"? This action cannot be undone.`}
        confirmButtonText="Delete"
        isConfirming={deleteMutation.isPending}
      />
    </>
  );
};
