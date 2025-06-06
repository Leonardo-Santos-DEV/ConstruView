import React, {useEffect, useMemo, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {PageWrapper} from '../components/PageWrapper';
import {AppNavigation} from '../components/AppNavigation';
import {AppHeader} from '../components/AppHeader';
import ScreenStatusHandler from '../components/ScreenStatusHandler';
import {getProjectCategoryNavItems} from '@/helpers/constants.tsx';
import type {Content} from '@/interfaces/contentInterfaces.ts';
import type {APIError} from '@/interfaces/apiErrorsInterfaces.ts';
import {getContentById} from '@/api/services/contentService';
import {TbView360Arrow} from "react-icons/tb";

export const ThreeSixtyViewScreen: React.FC = () => {
  const {projectId, viewId} = useParams<{ projectId: string; viewId: string }>();
  const navigate = useNavigate();

  const [viewData, setViewData] = useState<Content | null>(null);

  const [isLoadingScreenData, setIsLoadingScreenData] = useState<boolean>(true);
  const [screenError, setScreenError] = useState<string | null>(null);

  const navItems = useMemo(() => {
    if (projectId) {
      return getProjectCategoryNavItems(projectId, navigate);
    }
    return [];
  }, [projectId, navigate]);

  useEffect(() => {
    if (projectId && viewId) {
      const fetchData = async () => {
        setIsLoadingScreenData(true);
        setScreenError(null);
        setViewData(null);
        try {
          const fetchedView = await getContentById(viewId);
          setViewData(fetchedView);
        } catch (err) {
          const apiError = err as APIError;
          console.error(`Failed to load project/view data (View: ${viewId}):`, apiError);
          setScreenError(apiError.message || 'Could not load the data for this view.');
        } finally {
          setIsLoadingScreenData(false);
        }
      };
      fetchData();
    } else {
      setScreenError("View IDs not found in URL.");
      setIsLoadingScreenData(false);
    }
  }, [viewId, projectId]);

  return (
    <ScreenStatusHandler
      isLoading={isLoadingScreenData}
      error={screenError}
      data={viewData}
      navItems={navItems}
      notFoundMessage="View or project not found."
    >
      {(view) => (
        <PageWrapper className="flex flex-col" hasSidebar={true}>
          <AppNavigation items={navItems}/>
          <div className="md:ml-56 lg:ml-64 flex flex-col flex-grow overflow-hidden">
            <AppHeader
              projectTitle={view.project.projectName}
              screenTitle={`File: ${view.contentName}`}
              screenIcon={TbView360Arrow}
            />

            <main className="flex-grow p-4 flex flex-col">
              {view.url ? (
                <iframe
                  src={view.url}
                  title={`360 view of ${view.contentName}`}
                  className="w-full flex-grow border-0 rounded-2xl shadow-lg"
                  allowFullScreen
                  allow="autoplay; fullscreen; web-share; xr-spatial-tracking"
                ></iframe>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-sky-900 rounded-2xl">
                  <p className="text-white">360 view not available.</p>
                </div>
              )}
            </main>
          </div>
        </PageWrapper>
      )}
    </ScreenStatusHandler>
  );
};
