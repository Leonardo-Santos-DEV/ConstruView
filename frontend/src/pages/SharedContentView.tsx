// ConstruView/frontend/src/pages/SharedContentView.tsx

import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { PageWrapper } from "../components/PageWrapper";
import ScreenStatusHandler from "../components/ScreenStatusHandler";
import type { Content } from "@/interfaces/contentInterfaces.ts";
import type { APIError } from "@/interfaces/apiErrorsInterfaces.ts";
import { getSharedContent } from "@/api/services/contentService";
import logoImage from "@/assets/Logo.png"; // Importe a logo

export const SharedContentView: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [viewData, setViewData] = useState<Content | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<APIError | null>(null);

  useEffect(() => {
    if (token) {
      const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const data = await getSharedContent(token);
          setViewData(data);
        } catch (err) {
          setError(err as APIError);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    } else {
      setError({ message: "No share token provided." });
      setIsLoading(false);
    }
  }, [token]);

  const modifiedMatterportUrl = useMemo(() => {
    if (!viewData?.url) return null;

    try {
      const url = new URL(viewData.url);
      url.searchParams.set("play", "1");
      url.searchParams.set("brand", "0");
      url.searchParams.set("title", "0");
      url.searchParams.set("search", "0");
      url.searchParams.set("qs", "1");
      url.searchParams.set("share", "0");
      url.searchParams.set("mls", "2");
      url.searchParams.set("help", "0");
      return url.toString();
    } catch (error) {
      console.error("URL do Matterport é inválida:", viewData.url);
      return viewData.url;
    }
  }, [viewData?.url]);

  return (
    <ScreenStatusHandler
      isLoading={isLoading}
      error={error}
      data={viewData}
      notFoundMessage="Content not found or link has expired."
      requireAuth={false}
    >
      {(view) => (
        <PageWrapper className="flex flex-col">
          <div className="flex flex-col flex-grow overflow-hidden">
            {/* Cabeçalho customizado com a logo centralizada */}
            <header className="w-full p-4 flex justify-center items-center sticky top-0 bg-sky-800 z-20">
              <img
                src={logoImage}
                alt="Logo"
                className="group-hover:scale-105 transition-transform duration-150 w-9 h-9 rounded-lg"
              />
              <span className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors duration-150">
                Constru
                <span className="text-cyan-400 group-hover:text-white transition-colors duration-150">
                  VIEW
                </span>
              </span>
            </header>
            <main className="flex-grow p-4 flex flex-col">
              {modifiedMatterportUrl ? (
                <iframe
                  src={modifiedMatterportUrl}
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
