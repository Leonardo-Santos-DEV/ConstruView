import React, { useEffect, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Client } from '@/interfaces/clientInterfaces';
import type { Project } from '@/interfaces/projectInterfaces';

const createProjectSchema = (isMasterAdmin: boolean) => z.object({
  projectName: z.string().min(3, { message: "Project name is too short." }),
  imageFile: z.instanceof(FileList).optional(),
  clientId: isMasterAdmin
    ? z.string().min(1, { message: "You must select a client." })
    : z.string().optional(),
});

type ProjectFormData = z.infer<ReturnType<typeof createProjectSchema>>;

interface ProjectFormProps {
  onSubmit: SubmitHandler<ProjectFormData>;
  onCancel: () => void;
  isSubmitting: boolean;
  isMasterAdmin: boolean;
  clients: Client[];
  isEditing: boolean;
  initialData?: Project | null;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({
                                                          onSubmit, onCancel, isSubmitting, isMasterAdmin, clients, isEditing, initialData
                                                        }) => {
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<ProjectFormData>({
    resolver: zodResolver(createProjectSchema(isMasterAdmin)),
    defaultValues: {
      projectName: initialData?.projectName || '',
      clientId: initialData?.clientId?.toString() || '',
    }
  });

  const [preview, setPreview] = useState<string | null>(initialData?.imageUrl || null);
  const imageFile = watch('imageFile');

  useEffect(() => {
    if (isEditing && initialData) {
      reset({
        projectName: initialData.projectName,
        clientId: initialData.clientId.toString(),
      });
      setPreview(initialData.imageUrl || null);
    } else {
      reset({ projectName: '', clientId: '', imageFile: undefined });
      setPreview(null);
    }
  }, [initialData, isEditing, reset]);

  useEffect(() => {
    if (imageFile && imageFile.length > 0) {
      const file = imageFile[0];
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  }, [imageFile]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {isMasterAdmin && (
        <div>
          <label htmlFor="clientId" className="block text-sm font-medium text-sky-200 mb-1">
            Assign to Client
          </label>
          <select
            id="clientId"
            {...register('clientId')}
            disabled={isEditing} // Não permite trocar o cliente de um projeto existente
            className="h-10 w-full bg-sky-700 px-3 text-white rounded-md border border-sky-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">-- Select a Client --</option>
            {clients.map(client => (
              <option key={client.clientId} value={client.clientId}>
                {client.clientName}
              </option>
            ))}
          </select>
          {errors.clientId && <p className="text-sm text-red-400 mt-1">{errors.clientId.message}</p>}
        </div>
      )}

      <div>
        <label htmlFor="projectName" className="block text-sm font-medium text-sky-200 mb-1">Project Name</label>
        <input id="projectName" type="text" {...register('projectName')}
               className="h-10 w-full bg-sky-700 px-3 text-white rounded-md border border-sky-600 focus:outline-none focus:ring-2 focus:ring-cyan-400" />
        {errors.projectName && <p className="text-sm text-red-400 mt-1">{errors.projectName.message}</p>}
      </div>

      <div>
        <label htmlFor="imageFile" className="block text-sm font-medium text-sky-200 mb-1">
          Project Image {isEditing && <span className="text-xs text-slate-400">(optional, leave blank to keep current image)</span>}
        </label>
        <input id="imageFile" type="file" accept="image/*" {...register('imageFile')}
               className="w-full text-sm text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-500 file:text-white hover:file:bg-cyan-600" />
        {errors.imageFile && <p className="text-sm text-red-400 mt-1">{errors.imageFile.message as string}</p>}
        {preview && <img src={preview} alt="Image preview" className="mt-4 rounded-lg max-h-40 w-auto" />}
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-semibold rounded-md text-sky-200 hover:bg-sky-700">Cancel</button>
        <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-semibold text-white bg-cyan-500 hover:bg-cyan-600 rounded-md disabled:opacity-50">
          {isSubmitting ? 'Saving...' : (isEditing ? 'Save Changes' : 'Create Project')}
        </button>
      </div>
    </form>
  );
};
