import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageWrapper } from '../components/PageWrapper';
import { AppNavigation } from '../components/AppNavigation';
import ScreenStatusHandler from '../components/ScreenStatusHandler';
import { getProjectCategoryNavItems } from '@/helpers/constants.tsx';
import type { Project } from '@/interfaces/projectInterfaces.ts';
import type { APIError } from '@/interfaces/apiErrorsInterfaces.ts';
import { getProject } from '@/api/services/projectService';
import {AppHeader} from "@/components/AppHeader.tsx";
import {PiDrone} from "react-icons/pi";

export const AerialViewsScreen: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<Project | null>(null);
  const [isLoadingProject, setIsLoadingProject] = useState<boolean>(true);
  const [projectError, setProjectError] = useState<APIError | null>(null);

  const navItems = useMemo(() => {
    if (projectId) {
      return getProjectCategoryNavItems(projectId, navigate);
    }
    return [];
  }, [projectId, navigate]);

  useEffect(() => {
    if (projectId) {
      const fetchData = async () => {
        setIsLoadingProject(true);
        setProjectError(null);
        try {
          const projectData = await getProject(+projectId);
          setProject(projectData);
        } catch (err) {
          const apiError = err as APIError;
          console.error(`Failed to load project ${projectId} for Aerial Views:`, apiError);
          setProjectError(apiError);
        } finally {
          setIsLoadingProject(false);
        }
      };
      fetchData().catch((err) => {
        const apiError = err as APIError;
        console.error(`Failed to load project ${projectId} for Aerial Views:`, apiError);
        setProjectError(apiError);
        setIsLoadingProject(false);
      });
    } else {
      setProjectError({message: 'Project ID not found in URL.'});
      setIsLoadingProject(false);
    }
  }, [projectId]);

  return (
    <ScreenStatusHandler
      isLoading={isLoadingProject}
      error={projectError}
      data={project}
      navItems={navItems}
      notFoundMessage="Project not found."
    >
      {(loadedProject) => (
        <PageWrapper hasSidebar={true}>
          <AppNavigation items={navItems} />
          <div className="md:ml-56 lg:ml-64 flex flex-col w-full h-full">
            <AppHeader projectTitle={loadedProject.projectName} screenTitle='Aerial Views' screenIcon={PiDrone} />

            <main className="px-4 py-10 flex-grow flex flex-col items-center justify-center">
              <div className="w-full max-w-lg text-center">
                <div className="flex justify-center mb-4">
                  <PiDrone size={64} className="text-cyan-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Aerial Views</h2>
                <p className="text-slate-300 text-lg mt-2">
                  Content for aerial views will be available here soon!
                </p>
              </div>
            </main>
          </div>
        </PageWrapper>
      )}
    </ScreenStatusHandler>
  );
};
