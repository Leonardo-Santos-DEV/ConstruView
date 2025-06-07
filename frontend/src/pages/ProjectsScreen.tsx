import React, {useEffect, useMemo, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {PageWrapper} from '../components/PageWrapper';
import {AppNavigation} from '../components/AppNavigation';
import {AppHeader} from '../components/AppHeader';
import ScreenStatusHandler from '../components/ScreenStatusHandler';
import {APP_ROUTES, getTopLevelNavItems} from '@/helpers/constants.tsx';
import type {Project} from '@/interfaces/projectInterfaces.ts';
import type {APIError} from '@/interfaces/apiErrorsInterfaces.ts';
import {createProject, getAllProjects} from '@/api/services/projectService';
import {ProjectCard} from "@/components/ProjectCard.tsx";
import {useAuth} from "@/context/AuthContext.tsx";
import {FaPlus} from "react-icons/fa6";
import {Modal} from "@/components/Modal.tsx";
import {ProjectForm} from "@/components/ProjectForm.tsx";
import type {Client} from "@/interfaces/clientInterfaces.ts";
import {getAllClients} from "@/api/services/clientService.ts";

export const ProjectsScreen: React.FC = () => {
  const navigate = useNavigate();
  const {user} = useAuth();

  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState<boolean>(true);
  const [projectsError, setProjectsError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navItems = useMemo(() => {
    return getTopLevelNavItems(user, navigate);
  }, [user, navigate]);

  useEffect(() => {
    setIsMounted(true);

    const fetchProjects = async () => {
      setIsLoadingProjects(true);
      setProjectsError(null);
      setProjects([]);
      try {
        const fetchedProjects = await getAllProjects();
        setProjects(fetchedProjects);
      } catch (err) {
        const apiError = err as APIError;
        console.error('Failed to fetch projects:', apiError);
        setProjectsError(apiError.message || 'Could not load projects.');
      } finally {
        setIsLoadingProjects(false);
      }
    };

    fetchProjects();
  }, []);

  const handleOpenCreateModal = async () => {
    if (user?.isMasterAdmin) {
      try {
        const clientList = await getAllClients();
        setClients(clientList);
      } catch (error) {
        alert("Could not load clients for project creation.");
        return;
      }
    }
    setIsModalOpen(true);
  };

  const handleCreateProjectSubmit = async (data: { projectName: string; imageFile?: FileList | undefined; clientId?: string }) => {
    if (!user) {
      alert("You must be logged in to create a project.");
      return;
    }

    const targetClientId = user.isMasterAdmin ? Number(data.clientId) : user.clientId;
    if (!targetClientId) {
      alert("A client must be selected.");
      return;
    }

    setIsSubmitting(true);

    const imageFile = data.imageFile && data.imageFile.length > 0 ? data.imageFile[0] : undefined;
    try {
      const newProject = await createProject({
        projectName: data.projectName,
        imageFile: imageFile,
        clientId: targetClientId,
      });

      setProjects(prevProjects => [...prevProjects, newProject]);
      setIsModalOpen(false);

    } catch (error) {
      console.error("Failed to create project:", error);
      alert(`Error: ${(error as Error).message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProjectClick = (projectId: number) => {
    navigate(`${APP_ROUTES.PROJECT_DETAIL_BASE}/${projectId}`);
  };

  return (
    <>
      <ScreenStatusHandler
        isLoading={isLoadingProjects}
        error={projectsError}
        data={projects}
        navItems={navItems}
        notFoundMessage="No projects found."
      >
        {(loadedProjects) => (
          <PageWrapper hasSidebar={true}>
            <AppNavigation items={navItems}/>
            <div
              className={`md:ml-56 lg:ml-64 flex flex-col w-full h-full transition-opacity duration-700 ease-out ${
                isMounted ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <AppHeader/>

              <main className="px-4 sm:px-6 lg:px-8 py-6 flex-grow">
                <h2 className="text-3xl font-bold text-white mb-8 text-center">
                  My Projects
                </h2>
                <div className="max-w-7xl mx-auto">
                  {loadedProjects.length === 0 && !isLoadingProjects && (
                    <p className="text-center text-sky-200 text-lg">No projects found.</p>
                  )}
                  {loadedProjects.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
                      {loadedProjects.map((project) => (
                        <ProjectCard
                          key={project.projectId}
                          project={project}
                          onClick={() => handleProjectClick(project.projectId)}
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
      {user && user.isMasterAdmin && (
        <button
          onClick={handleOpenCreateModal}
          className="fixed bottom-28 md:bottom-10 right-10 z-40 h-14 w-14 bg-cyan-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-cyan-600"
          aria-label="Add new project"
        >
          <FaPlus size={24} />
        </button>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Project">
        <ProjectForm
          onSubmit={handleCreateProjectSubmit}
          onCancel={() => setIsModalOpen(false)}
          isSubmitting={isSubmitting}
          isMasterAdmin={user?.isMasterAdmin ?? false}
          clients={clients}
        />
      </Modal>
    </>
  );
};
