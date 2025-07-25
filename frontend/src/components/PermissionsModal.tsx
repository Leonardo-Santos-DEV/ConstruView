import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Modal } from './Modal';
import { ImSpinner2 } from "react-icons/im";
import { updatePermission, type UpdatePermissionPayload } from '@/api/services/permissionsService';
import apiClient from '@/api/apiClient';

const PERMISSION_LEVELS = [
  { level: 0, label: 'No Access' },
  { level: 1, label: 'Viewer' },
  { level: 2, label: 'Content Manager' },
  { level: 3, label: 'Project Manager' },
];

interface UserPermission {
  userId: number;
  userName: string;
  level: number;
}

const getPermissionsForProject = async (projectId: number): Promise<UserPermission[]> => {
  const { data } = await apiClient.get<UserPermission[]>(`/permissions?projectId=${projectId}`);
  return data;
};

interface PermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: { projectId: number; projectName: string; };
}

export const PermissionsModal: React.FC<PermissionsModalProps> = ({ isOpen, onClose, project }) => {
  const queryClient = useQueryClient();
  const permissionsQueryKey = ['permissions', project.projectId];

  const { data: permissions, isLoading } = useQuery<UserPermission[], Error>({
    queryKey: permissionsQueryKey,
    queryFn: () => getPermissionsForProject(project.projectId),
    enabled: isOpen,
  });

  const updatePermissionMutation = useMutation({
    mutationFn: (payload: UpdatePermissionPayload) => updatePermission(payload),
    onSuccess: () => {
      toast.success('Permission updated!');
      queryClient.invalidateQueries({ queryKey: permissionsQueryKey });
    },
    onError: (error: any) => {
      toast.error(`Failed to update: ${error.message || 'Unknown error'}`);
    },
  });

  const handlePermissionChange = (userId: number, newLevel: number) => {
    updatePermissionMutation.mutate({ projectId: project.projectId, userId, level: newLevel });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Permissions for ${project.projectName}`}>
      <div className="max-h-[60vh] overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <ImSpinner2 className="h-8 w-8 animate-spin text-cyan-400" />
          </div>
        ) : (
          <table className="w-full text-left border-separate border-spacing-x-0">
            <thead>
            <tr className="border-b border-sky-700">
              <th className="p-2 text-sky-200">User</th>

              {/* ---- INÍCIO DA ALTERAÇÃO ---- */}
              {/* Mapeia os níveis para criar um cabeçalho para cada coluna */}
              {PERMISSION_LEVELS.map(({ label }) => (
                <th key={label} className="p-1 text-center text-xs font-bold text-sky-300" title={label}>
                  {label}
                </th>
              ))}
              {/* ---- FIM DA ALTERAÇÃO ---- */}
            </tr>
            </thead>
            <tbody>
            {permissions?.map((user) => (
              <tr key={user.userId} className="border-b border-sky-900/50">
                <td className="p-3 text-white">{user.userName}</td>

                {/* O corpo da tabela já se alinha com o novo cabeçalho */}
                {PERMISSION_LEVELS.map(({ level, label }) => (
                  <td key={level} className="p-1 text-center">
                    <button
                      onClick={() => handlePermissionChange(user.userId, level)}
                      className={`w-5 h-5 rounded-full border-2 transition-transform hover:scale-110 disabled:opacity-50 ${
                        user.level === level
                          ? 'bg-cyan-400 border-cyan-300'
                          : 'bg-sky-700 border-sky-600'
                      }`}
                      title={label}
                      disabled={updatePermissionMutation.isPending}
                    />
                  </td>
                ))}
              </tr>
            ))}
            </tbody>
          </table>
        )}
      </div>
      <div className="flex justify-end mt-6">
        <button onClick={onClose} className="px-4 py-2 text-sm font-semibold rounded-md text-sky-200 hover:bg-sky-700">
          Close
        </button>
      </div>
    </Modal>
  );
};
