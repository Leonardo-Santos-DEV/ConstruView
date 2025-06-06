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
import {PiFileCloudFill} from "react-icons/pi";

export const DocsScreen: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoadingScreenData, setIsLoadingScreenData] = useState<boolean>(true);
  const [screenError, setScreenError] = useState<string | null>(null);

  const navItems = useMemo(() => {
    if (projectId) {
      return getProjectCategoryNavItems(projectId, navigate);
    }
    return [];
  }, [projectId, navigate]);

  useEffect(() => {
    if (projectId) {
      const fetchData = async () => {
        setIsLoadingScreenData(true);
        setScreenError(null);
        setProject(null);
        try {
          const projectData = await getProject(+projectId);
          setProject(projectData);
        } catch (err) {
          const apiError = err as APIError;
          console.error(`Failed to load project ${projectId} for Docs Screen:`, apiError);
          setScreenError(apiError.message || 'Could not load project data.');
        } finally {
          setIsLoadingScreenData(false);
        }
      };
      fetchData();
    } else {
      setScreenError("Project ID not found in URL.");
      setIsLoadingScreenData(false);
    }
  }, [projectId]);

  return (
    <ScreenStatusHandler
      isLoading={isLoadingScreenData}
      error={screenError}
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
              screenTitle='Docs'
              screenIcon={PiFileCloudFill }
            />

            <main className="px-4 py-10 flex-grow flex flex-col items-center justify-center">
              <div className="w-full max-w-lg text-center">
                <div className="flex justify-center mb-4">
                  <PiFileCloudFill  size={64} className="text-cyan-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Project Documents</h2>
                <p className="text-slate-300 text-lg mt-2">
                  Content for documents will be available here soon!
                </p>
              </div>
            </main>
          </div>
        </PageWrapper>
      )}
    </ScreenStatusHandler>
  );
};
