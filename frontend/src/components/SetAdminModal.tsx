import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Modal } from './Modal';
import { getUsersByClientId } from '@/api/services/userService';
import type { User } from '@/interfaces/userInterfaces';
import type { Client } from '@/interfaces/clientInterfaces';
import { ImSpinner2 } from 'react-icons/im';

interface SetAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (userId: number) => void;
  client: Client | null;
  isConfirming: boolean;
}

export const SetAdminModal: React.FC<SetAdminModalProps> = ({ isOpen, onClose, onConfirm, client, isConfirming }) => {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const { data: users, isLoading } = useQuery<User[], Error>({
    queryKey: ['users', client?.clientId],
    queryFn: () => getUsersByClientId(client!.clientId),
    enabled: !!client && isOpen,
  });

  // Encontra o admin atual para pré-selecionar o radio button
  useEffect(() => {
    if (users) {
      const currentAdmin = users.find(u => u.isClientAdmin);
      setSelectedUserId(currentAdmin?.userId || null);
    }
  }, [users]);

  const handleConfirm = () => {
    if (selectedUserId) {
      onConfirm(selectedUserId);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Set Admin for ${client?.clientName}`}>
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <ImSpinner2 className="h-8 w-8 animate-spin text-cyan-400" />
        </div>
      ) : (
        <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
          {users?.map(user => (
            <label
              key={user.userId}
              className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                selectedUserId === user.userId ? 'bg-sky-600' : 'bg-sky-900/50 hover:bg-sky-700/50'
              }`}
            >
              <input
                type="radio"
                name="clientAdmin"
                checked={selectedUserId === user.userId}
                onChange={() => setSelectedUserId(user.userId)}
                className="h-4 w-4 mr-4 text-cyan-400 bg-sky-800 border-sky-600 focus:ring-cyan-500"
              />
              <div>
                <p className="font-semibold text-white">{user.userName}</p>
                <p className="text-sm text-slate-300">{user.email}</p>
              </div>
            </label>
          ))}
        </div>
      )}
      <div className="flex justify-end gap-4 pt-6">
        <button type="button" onClick={onClose} className="px-4 py-2 text-sm rounded-md text-sky-200 hover:bg-sky-700">
          Cancel
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={!selectedUserId || isConfirming}
          className="px-4 py-2 text-sm font-semibold text-white bg-cyan-500 hover:bg-cyan-600 rounded-md disabled:opacity-50"
        >
          {isConfirming ? 'Saving...' : 'Confirm'}
        </button>
      </div>
    </Modal>
  );
};
