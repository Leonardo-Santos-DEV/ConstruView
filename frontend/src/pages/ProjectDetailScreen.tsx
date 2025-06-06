import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageWrapper } from '../components/PageWrapper';
import { AppNavigation } from '../components/AppNavigation';
import { AppHeader } from '../components/AppHeader';
import ScreenStatusHandler from '../components/ScreenStatusHandler';
import { APP_ROUTES, getTopLevelNavItems, PROJECT_CATEGORIES } from '@/helpers/constants.tsx';
import type { Category } from '@/interfaces/categoryInterfaces.ts';
import type { Project } from '@/interfaces/projectInterfaces.ts';
import type { APIError } from '@/interfaces/apiErrorsInterfaces.ts';
import { getProject } from '@/api/services/projectService';
import {CategoryCard} from "@/components/CategoryCard.tsx";
import {useAuth} from "@/context/AuthContext.tsx";

export const ProjectDetailScreen: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [project, setProject] = useState<Project | null>(null);
  const [isLoadingProject, setIsLoadingProject] = useState<boolean>(true);
  const [projectError, setProjectError] = useState<string | null>(null);

  const navItems = useMemo(() => {
    return getTopLevelNavItems(user, navigate);
  }, [user, navigate]);

  useEffect(() => {
    if (projectId) {
      const fetchProjectDetails = async () => {
        setIsLoadingProject(true);
        setProjectError(null);
        setProject(null);
        try {
          const fetchedProject = await getProject(+projectId);
          setProject(fetchedProject);
        } catch (err) {
          const apiError = err as APIError;
          console.error(`Failed to fetch project ${projectId}:`, apiError);
          setProjectError(apiError.message || 'Could not load project details.');
        } finally {
          setIsLoadingProject(false);
        }
      };
      fetchProjectDetails();
    } else {
      setProjectError("Project ID not found in URL.");
      setIsLoadingProject(false);
    }
  }, [projectId]);

  const handleCategoryClick = (category: Category) => {
    navigate(`${APP_ROUTES.PROJECT_DETAIL_BASE}/${projectId}/${category.pathSegment}`);
  };

  return (
    <ScreenStatusHandler
      isLoading={isLoadingProject}
      error={projectError}
      data={project}
      navItems={navItems}
      notFoundMessage="Projeto não encontrado."
    >
      {(loadedProject) => (
        <PageWrapper hasSidebar={true}>
          <AppNavigation items={navItems} />
          <div className="md:ml-56 lg:ml-64 flex flex-col w-full h-full">
            <AppHeader />

            <main className="px-4 py-2 flex-grow">
              <h2 className="text-2xl font-bold text-cv-text-primary mb-6 text-center">
                {loadedProject.projectName}
              </h2>

              <div className="grid grid-cols-2 gap-4 md:gap-6 max-w-md mx-auto">
                {PROJECT_CATEGORIES.map((category) => (
                  <CategoryCard
                    key={category.pathSegment}
                    category={category}
                    onClick={() => handleCategoryClick(category)}
                  />
                ))}
              </div>
            </main>
          </div>
        </PageWrapper>
      )}
    </ScreenStatusHandler>
  );
};
