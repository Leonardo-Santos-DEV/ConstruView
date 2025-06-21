import React, {useEffect, useMemo, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {PageWrapper} from '../components/PageWrapper';
import {AppNavigation} from '../components/AppNavigation';
import {AppHeader} from '../components/AppHeader';
import ScreenStatusHandler from '../components/ScreenStatusHandler';
import {getTopLevelNavItems} from '@/helpers/constants';
import {useAuth} from '@/context/AuthContext';
import type {User, UpdateUserPayload} from '@/interfaces/userInterfaces';
import {createUser, getUsersByClientId, updateUser} from '@/api/services/userService';
import {getClientById} from '@/api/services/clientService';
import type {Client} from '@/interfaces/clientInterfaces';
import {Modal} from '@/components/Modal';
import {UserForm, type UserFormData} from '@/components/UserForm';
import {ToggleSwitch} from '@/components/ToggleSwitch';
import {FiEdit} from "react-icons/fi";
import {FaUsers, FaPlus} from "react-icons/fa6";
import type {APIError} from "@/interfaces/apiErrorsInterfaces.ts";

export const ClientUsersScreen: React.FC = () => {
  const {clientId} = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const {user: adminUser} = useAuth();

  const [client, setClient] = useState<Client | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<APIError | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [togglingUserId, setTogglingUserId] = useState<number | null>(null);

  const navItems = useMemo(() => getTopLevelNavItems(adminUser, navigate), [adminUser, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      if (!clientId) {
        setError({message: 'Client ID is required to load users.'});
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const [clientData, usersData] = await Promise.all([
          getClientById(+clientId),
          getUsersByClientId(+clientId),
        ]);
        setClient(clientData);
        setUsers(usersData);
      } catch (err) {
        setError(err as APIError);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [clientId]);

  const handleOpenCreateModal = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (user: User) => {
    setTogglingUserId(user.userId);
    try {
      const updatedUser = await updateUser(user.userId, {enabled: !user.enabled});
      setUsers(prevUsers => prevUsers.map(u => u.userId === user.userId ? updatedUser : u));
    } catch (error) {
      alert("Failed to update user status.");
    } finally {
      setTogglingUserId(null);
    }
  };

  const handleFormSubmit = async (data: UserFormData) => { // Alterado de 'any' para 'UserFormData'
    if (!clientId) return;
    setIsSubmitting(true);
    try {
      if (selectedUser) {
        const payload: UpdateUserPayload = {...data};
        if (!payload.password) delete payload.password; // Lógica para não enviar senha vazia

        const updatedUser = await updateUser(selectedUser.userId, payload);
        setUsers(prevUsers => prevUsers.map(u => (u.userId === selectedUser.userId ? updatedUser : u)));
      } else {
        const newUser = await createUser({...data, clientId: +clientId});
        setUsers(prevUsers => [...prevUsers, newUser]);
      }
      setIsModalOpen(false);
    } catch (error) {
      alert("Error saving user.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <ScreenStatusHandler isLoading={isLoading} error={error} data={client} navItems={navItems}>
        {(loadedClient) => (
          <PageWrapper hasSidebar={true}>
            <AppNavigation items={navItems}/>
            <div className="md:ml-56 lg:ml-64 flex flex-col w-screen h-screen">
              <AppHeader screenTitle={`Users for ${loadedClient.clientName}`} screenIcon={FaUsers}/>
              <main className="px-4 sm:px-6 lg:px-8 py-6 flex-grow overflow-y-auto">
                <div className="max-w-7xl mx-auto">
                  <div className="bg-sky-900/50 rounded-xl">
                    <ul className="divide-y divide-sky-700/50">
                      {users.map((user) => (
                        <li key={user.userId} className="p-3 flex justify-between items-center">
                          <div>
                            <p className="font-semibold text-white">{user.userName}</p>
                            <p className="text-sm text-slate-300">{user.email}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            {!user.isMasterAdmin && (
                              <ToggleSwitch
                                enabled={user.enabled}
                                onChange={() => handleToggleStatus(user)}
                                disabled={togglingUserId === user.userId}
                              />)}
                            <button onClick={() => handleOpenEditModal(user)} className="text-sky-200 hover:text-white">
                              <FiEdit size={20}/>
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

      <button onClick={handleOpenCreateModal}
              className="fixed bottom-28 md:bottom-10 right-10 z-40 h-14 w-14 bg-cyan-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-cyan-600 transition-all transform hover:scale-110"
              aria-label="Add new user">
        <FaPlus size={24}/>
      </button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}
             title={selectedUser ? 'Edit User' : 'Create New User'}>
        <UserForm
          onSubmit={handleFormSubmit}
          onCancel={() => setIsModalOpen(false)}
          isEditing={!!selectedUser}
          initialData={selectedUser}
          isSubmitting={isSubmitting}
        />
      </Modal>
    </>
  );
};
