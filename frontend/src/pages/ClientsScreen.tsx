// CÓDIGO ATUALIZADO - COPIAR E COLAR
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { PageWrapper } from '../components/PageWrapper';
import { AppNavigation } from '../components/AppNavigation';
import { AppHeader } from '../components/AppHeader';
import ScreenStatusHandler from '../components/ScreenStatusHandler';
import { APP_ROUTES, getTopLevelNavItems } from '@/helpers/constants';
import type { Client, UpdateClientPayload } from '@/interfaces/clientInterfaces.ts';
import type { APIError } from '@/interfaces/apiErrorsInterfaces.ts';
import { createClient, getAllClients, updateClient, disableClient } from '@/api/services/clientService';
import { useAuth } from '@/context/AuthContext';
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { Modal } from '@/components/Modal';
import { ClientForm } from '@/components/ClientForm';
import { ToggleSwitch } from "@/components/ToggleSwitch.tsx";
import { FloatingActionButton } from '@/components/FloatingActionButton';
import { FaUserShield } from "react-icons/fa6";
import { setClientAdmin } from "@/api/services/clientService";
import {SetAdminModal} from "@/components/SetAdminModal.tsx";

export const ClientsScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isSetAdminModalOpen, setIsSetAdminModalOpen] = useState(false);
  const [clientForAdminSelection, setClientForAdminSelection] = useState<Client | null>(null);


  const navItems = useMemo(() => getTopLevelNavItems(user, navigate), [user, navigate]);

  const { data: clients, isLoading, error } = useQuery<Client[], APIError>({
    queryKey: ['clients'],
    queryFn: getAllClients,
  });

  const createClientMutation = useMutation({
    mutationFn: createClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      setIsModalOpen(false);
      toast.success('Client created successfully!');
    },
    onError: (e: APIError) => toast.error(`Error creating client: ${e.message}`),
  });

  const updateClientMutation = useMutation({
    mutationFn: (variables: {id: number, payload: UpdateClientPayload}) => updateClient(variables.id, variables.payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      setIsModalOpen(false);
      toast.success('Client updated successfully!');
    },
    onError: (e: APIError) => toast.error(`Error updating client: ${e.message}`),
  });

  const toggleStatusMutation = useMutation({
    mutationFn: (client: Client) => {
      return client.enabled ? disableClient(client.clientId) : updateClient(client.clientId, { enabled: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success('Client status updated!');
    },
    onError: (e: APIError) => toast.error(`Failed to update status: ${e.message}`),
  });

  const setAdminMutation = useMutation({
    mutationFn: (variables: { clientId: number, userId: number }) =>
      setClientAdmin(variables.clientId, variables.userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] }); // Invalida cache de usuários
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success('Client Admin updated successfully!');
      setIsSetAdminModalOpen(false);
    },
    onError: (e: APIError) => toast.error(`Failed to set admin: ${e.message}`),
  });

  const handleOpenCreateModal = () => {
    setSelectedClient(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (client: Client) => {
    setSelectedClient(client);
    setIsModalOpen(true);
  }

  const handleOpenSetAdminModal = (client: Client) => {
    setClientForAdminSelection(client);
    setIsSetAdminModalOpen(true);
  };

  const handleConfirmSetAdmin = (userId: number) => {
    if (clientForAdminSelection) {
      setAdminMutation.mutate({ clientId: clientForAdminSelection.clientId, userId });
    }
  };

  const handleFormSubmit = (data: { clientName: string }) => {
    if (selectedClient) {
      if (data.clientName !== selectedClient.clientName) {
        updateClientMutation.mutate({ payload: data, id: selectedClient.clientId });
      } else {
        setIsModalOpen(false);
      }
    } else {
      createClientMutation.mutate(data);
    }
  };

  const isSubmitting = createClientMutation.isPending || updateClientMutation.isPending;

  return (
    <>
      <ScreenStatusHandler isLoading={isLoading} error={error} data={clients} navItems={navItems} notFoundMessage="No clients found.">
        {(loadedClients) => (
          <PageWrapper hasSidebar={true}>
            <AppNavigation items={navItems} />
            <div className="md:ml-56 lg:ml-64 flex flex-col w-screen h-screen">
              <AppHeader screenTitle="Client Management" screenIcon={MdOutlineAdminPanelSettings} />
              <main className="px-4 sm:px-6 lg:px-8 py-6 flex-grow overflow-y-auto">
                <div className="max-w-7xl mx-auto">
                  <h2 className="text-3xl font-bold text-white mb-8">All Clients</h2>
                  <div className="bg-sky-900/50 rounded-xl">
                    <ul className="divide-y divide-sky-700/50">
                      {loadedClients.map((client) => (
                        <li key={client.clientId} className="p-3 flex justify-between items-center">
                          <div className="flex items-center gap-4">
                            {client.clientId > 1 && (
                              <ToggleSwitch
                                enabled={client.enabled}
                                onChange={() => toggleStatusMutation.mutate(client)}
                                disabled={toggleStatusMutation.isPending && toggleStatusMutation.variables?.clientId === client.clientId}
                              />
                            )}
                            <p className="font-semibold text-white">{client.clientName}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <button
                              onClick={() => handleOpenEditModal(client)}
                              className="text-sm font-medium text-cyan-400 hover:text-cyan-300"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => navigate(`${APP_ROUTES.CLIENT_USERS_BASE}/${client.clientId}/users`)}
                              className="text-sm font-medium text-cyan-400 hover:text-cyan-300"
                            >
                              Manage Users
                            </button>
                            {user?.isMasterAdmin && client.clientId > 1 && (
                              <button
                                onClick={() => handleOpenSetAdminModal(client)}
                                className="text-sm font-medium text-amber-400 hover:text-amber-300 flex items-center gap-1"
                                title="Set Client Admin"
                              >
                                <FaUserShield /> Set Admin
                              </button>
                            )}
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

      <FloatingActionButton onClick={handleOpenCreateModal} ariaLabel="Add new client" />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedClient ? 'Edit Client' : 'Create New Client'}>
        <ClientForm
          onSubmit={handleFormSubmit}
          onCancel={() => setIsModalOpen(false)}
          initialData={selectedClient}
          isSubmitting={isSubmitting}
        />
      </Modal>

      <SetAdminModal
        isOpen={isSetAdminModalOpen}
        onClose={() => setIsSetAdminModalOpen(false)}
        onConfirm={handleConfirmSetAdmin}
        client={clientForAdminSelection}
        isConfirming={setAdminMutation.isPending}
      />
    </>
  );
};
