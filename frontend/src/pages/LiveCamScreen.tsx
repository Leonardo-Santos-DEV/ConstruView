import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageWrapper } from '../components/PageWrapper';
import { AppNavigation } from '../components/AppNavigation';
import { AppHeader } from '../components/AppHeader';
import ScreenStatusHandler from '../components/ScreenStatusHandler';
import { getProjectCategoryNavItems } from '@/helpers/constants.tsx';
import type { Project } from '@/interfaces/projectInterfaces.ts';
import type { APIError } from '@/interfaces/apiErrorsInterfaces.ts';
import { getProject } from '@/api/services/projectService';
import {PiVideoCameraFill} from "react-icons/pi";

export const LiveCamScreen: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<Project | null>(null);
  const [isLoadingProject, setIsLoadingProject] = useState<boolean>(true);
  const [projectError, setProjectError] = useState<string | null>(null);

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
        setProject(null);
        try {
          const projectData = await getProject(+projectId);
          setProject(projectData);
        } catch (err) {
          const apiError = err as APIError;
          console.error(`Failed to load project ${projectId} for Live Cam Screen:`, apiError);
          setProjectError(apiError.message || 'Could not load project data.');
        } finally {
          setIsLoadingProject(false);
        }
      };
      fetchData();
    } else {
      setProjectError("Project ID not found in URL.");
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
            <AppHeader
              projectTitle={loadedProject.projectName}
              screenTitle="Live Cam"
              screenIcon={PiVideoCameraFill }
            />

            <main className="px-4 py-10 flex-grow flex flex-col items-center justify-center">
              <div className="w-full max-w-lg text-center">
                <div className="flex justify-center mb-4">
                  <PiVideoCameraFill  size={64} className="text-cyan-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Live Camera</h2>
                <p className="text-slate-300 text-lg mt-2">
                  Live camera content will be available here soon!
                </p>
              </div>
            </main>
          </div>
        </PageWrapper>
      )}
    </ScreenStatusHandler>
  );
};
