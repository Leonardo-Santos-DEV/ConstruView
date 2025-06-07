import React, {useEffect, useMemo, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {PageWrapper} from '../components/PageWrapper';
import {AppNavigation} from '../components/AppNavigation';
import {AppHeader} from '../components/AppHeader';
import ScreenStatusHandler from '../components/ScreenStatusHandler';
import {APP_ROUTES, getProjectCategoryNavItems} from '@/helpers/constants.tsx';
import type {Content} from '@/interfaces/contentInterfaces.ts';
import type {Project} from '@/interfaces/projectInterfaces.ts';
import type {APIError} from '@/interfaces/apiErrorsInterfaces.ts';
import {getProject} from '@/api/services/projectService';
import {createContent, getContentsByProjectAndCategory} from '@/api/services/contentService';
import {ContentCard} from "@/components/ContentCard.tsx";
import {TbView360Arrow} from "react-icons/tb";
import {FaPlus} from "react-icons/fa6";
import {ContentForm} from "@/components/ContentForm.tsx";
import {Modal} from "@/components/Modal.tsx";
import {useAuth} from "@/context/AuthContext.tsx";

export const ThreeSixtyGalleryScreen: React.FC = () => {
  const {projectId} = useParams<{ projectId: string }>();
  const {user} = useAuth();
  const navigate = useNavigate();

  const [project, setProject] = useState<Project | null>(null);
  const [views, setViews] = useState<Content[]>([]);

  const [isLoadingScreenData, setIsLoadingScreenData] = useState<boolean>(true);
  const [screenError, setScreenError] = useState<APIError | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        setViews([]);
        try {
          const [projectData, viewsData] = await Promise.all([
            getProject(+projectId),
            getContentsByProjectAndCategory({projectId: +projectId, category: '360view'})
          ]);

          setProject(projectData);
          setViews(viewsData);

        } catch (err) {
          const apiError = err as APIError;
          console.error('Failed to load 360 gallery data:', apiError);
          setScreenError(apiError);
        } finally {
          setIsLoadingScreenData(false);
        }
      };
      fetchData();
    } else {
      setScreenError({message: 'Project ID not found in URL.'});
      setIsLoadingScreenData(false);
    }
  }, [projectId]);

  const handleCreateContentSubmit = async (data: { contentName: string; url: string; previewImageFile?: FileList | undefined; }) => {
    if (!projectId) return;

    setIsSubmitting(true);

    const imageFile = data.previewImageFile && data.previewImageFile.length > 0 ? data.previewImageFile[0] : undefined;

    try {
      const newContent = await createContent({
        ...data,
        projectId: +projectId,
        category: '360view',
        previewImageFile: imageFile,
      });
      setViews(prevViews => [...prevViews, newContent]);
      setIsModalOpen(false);
    } catch (error) {
      alert(`Error creating view: ${(error as Error).message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewClick = (viewContentId: number) => {
    if (projectId) {
      navigate(`${APP_ROUTES.PROJECT_DETAIL_BASE}/${projectId}${APP_ROUTES.THREE_SIXTY_VIEW_RELATIVE}/${viewContentId.toString()}`);
    }
  };

  return (
    <>
      <ScreenStatusHandler
        isLoading={isLoadingScreenData}
        error={screenError}
        data={project}
        navItems={navItems}
        notFoundMessage="Project not found."
      >
        {(loadedProject) => (
          <PageWrapper hasSidebar={true}>
            <AppNavigation items={navItems}/>
            <div className="md:ml-56 lg:ml-64 flex flex-col w-screen h-screen overflow-hidden">
              <AppHeader
                projectTitle={loadedProject.projectName}
                screenTitle="360° Views"
                screenIcon={TbView360Arrow}
              />

              <main className="px-4 py-4 flex-grow overflow-y-auto">
                {views.length === 0 && !isLoadingScreenData && !screenError && (
                  <p className="text-center text-slate-300">No 360 views found for this project.</p>
                )}
                {views.length > 0 && (
                  <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                      {views.map((view) => (
                        <ContentCard key={view.contentId} view={view} onClick={() => handleViewClick(view.contentId)}/>
                      ))}
                    </div>
                  </div>
                )}
              </main>
            </div>
          </PageWrapper>
        )}
      </ScreenStatusHandler>

      {user && user.isMasterAdmin && (<button onClick={() => setIsModalOpen(true)}
                                              className="fixed bottom-28 md:bottom-10 right-10 z-40 h-14 w-14 bg-cyan-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-cyan-600"
                                              aria-label="Add new 360 view">
        <FaPlus size={24}/>
      </button>)}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New 360 View">
        <ContentForm
          onSubmit={handleCreateContentSubmit}
          onCancel={() => setIsModalOpen(false)}
          isSubmitting={isSubmitting}
        />
      </Modal>
    </>
  );
};
