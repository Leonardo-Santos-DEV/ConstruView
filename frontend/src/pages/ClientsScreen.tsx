import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageWrapper } from '../components/PageWrapper';
import { AppNavigation } from '../components/AppNavigation';
import { AppHeader } from '../components/AppHeader';
import ScreenStatusHandler from '../components/ScreenStatusHandler';
import {APP_ROUTES, getTopLevelNavItems} from '@/helpers/constants';
import type { Client } from '@/interfaces/clientInterfaces.ts';
import type { APIError } from '@/interfaces/apiErrorsInterfaces.ts';
import { createClient, getAllClients, updateClient, disableClient } from '@/api/services/clientService';
import { useAuth } from '@/context/AuthContext';
import { FaPlus } from "react-icons/fa6";
import { MdOutlineAdminPanelSettings  } from "react-icons/md";
import { Modal } from '@/components/Modal';
import { ClientForm } from '@/components/ClientForm';
import {ToggleSwitch} from "@/components/ToggleSwitch.tsx";

export const ClientsScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [togglingClientId, setTogglingClientId] = useState<number | null>(null);

  const navItems = useMemo(() => getTopLevelNavItems(user, navigate), [user, navigate]);

  const fetchClients = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedClients = await getAllClients();
      setClients(fetchedClients);
    } catch (err) {
      const apiError = err as APIError;
      setError(apiError.message || 'Could not load clients.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleOpenCreateModal = () => {
    setSelectedClient(null);
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (client: Client) => {
    setTogglingClientId(client.clientId); // Desabilita o toggle específico
    try {
      if (client.enabled) {
        await disableClient(client.clientId);
      } else {
        await updateClient(client.clientId, { enabled: true });
      }
      setClients(prevClients =>
        prevClients.map(c =>
          c.clientId === client.clientId ? { ...c, enabled: !c.enabled } : c
        )
      );
    } catch (error) {
      console.error("Error toggling client status:", error);
      alert("Failed to update client status.");
    } finally {
      setTogglingClientId(null);
    }
  };

  const handleFormSubmit = async (data: { clientName: string }) => {
    setIsSubmitting(true);
    try {
      if (selectedClient) {
        if (data.clientName !== selectedClient.clientName) {
          const updatedClient = await updateClient(selectedClient.clientId, { clientName: data.clientName });
          setClients(prevClients =>
            prevClients.map(c =>
              c.clientId === selectedClient.clientId ? updatedClient : c
            )
          );
        }
      } else {
        const newClient = await createClient({ clientName: data.clientName });
        setClients(prevClients => [...prevClients, newClient]);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to save client:", error);
      alert("Error saving client. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <ScreenStatusHandler isLoading={isLoading} error={error} data={clients} navItems={navItems} notFoundMessage="No clients found.">
        {(loadedClients) => (
          <PageWrapper hasSidebar={true}>
            <AppNavigation items={navItems} />
            <div className="md:ml-56 lg:ml-64 flex flex-col w-screen h-screen">
              <AppHeader screenTitle="Client Management" screenIcon={MdOutlineAdminPanelSettings } />
              <main className="px-4 sm:px-6 lg:px-8 py-6 flex-grow overflow-y-auto">
                <div className="max-w-7xl mx-auto">
                  <h2 className="text-3xl font-bold text-white mb-8">All Clients</h2>
                  <div className="bg-sky-900/50 rounded-xl">
                    <ul className="divide-y divide-sky-700/50">
                      {loadedClients.map((client) => (
                        <li key={client.clientId} className="p-3 flex justify-between items-center">
                          <div className="flex items-center gap-4">
                            {client.clientId > 1 ? (
                              <ToggleSwitch
                              enabled={client.enabled}
                              onChange={() => handleToggleStatus(client)}
                              disabled={togglingClientId === client.clientId}
                            />) : null}
                            <p className="font-semibold text-white">{client.clientName}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <button
                              onClick={() => navigate(`${APP_ROUTES.CLIENT_USERS_BASE}/${client.clientId}/users`)}
                              className="text-sm font-medium text-cyan-400 hover:text-cyan-300"
                            >
                              Manage Users
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </main>
            </div>
          </PageWrapper>
        )}
      </ScreenStatusHandler>

      <button
        onClick={handleOpenCreateModal}
        className="fixed bottom-28 md:bottom-10 right-10 z-40 h-14 w-14 bg-cyan-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-cyan-600 transition-all transform hover:scale-110"
        aria-label="Add new client"
      >
        <FaPlus size={24} />
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedClient ? 'Edit Client' : 'Create New Client'}
      >
        <ClientForm
          onSubmit={handleFormSubmit}
          onCancel={() => setIsModalOpen(false)}
          initialData={selectedClient}
          isSubmitting={isSubmitting}
        />
      </Modal>
    </>
  );
};
