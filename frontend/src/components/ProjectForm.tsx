import React, { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Client } from '@/interfaces/clientInterfaces';

const createProjectSchema = (isMasterAdmin: boolean) => z.object({
  projectName: z.string().min(3, { message: "Project name is too short." }),
  imageFile: z.instanceof(FileList)
    .refine(files => files.length > 0, { message: "An image is required." })
    .refine(files => files[0]?.type.startsWith("image/"), { message: "Only image files are accepted." }),
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
}

export const ProjectForm: React.FC<ProjectFormProps> = ({ onSubmit, onCancel, isSubmitting, isMasterAdmin, clients }) => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<ProjectFormData>({
    resolver: zodResolver(createProjectSchema(isMasterAdmin)),
  });

  const [preview, setPreview] = useState<string | null>(null);
  const imageFile = watch('imageFile');

  if (imageFile && imageFile.length > 0) {
    const file = imageFile[0];
    if (file && (!preview || preview.length < 100)) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  }

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
            className="h-10 w-full bg-sky-700 px-3 text-white rounded-md border border-sky-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
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
        <label htmlFor="imageFile" className="block text-sm font-medium text-sky-200 mb-1">Project Image</label>
        <input id="imageFile" type="file" accept="image/*" {...register('imageFile')}
               className="w-full text-sm text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-500 file:text-white hover:file:bg-cyan-600" />
        {errors.imageFile && <p className="text-sm text-red-400 mt-1">{errors.imageFile.message as string}</p>}
        {preview && <img src={preview} alt="Image preview" className="mt-4 rounded-lg max-h-40 w-auto" />}
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-semibold rounded-md text-sky-200 hover:bg-sky-700">Cancel</button>
        <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-semibold text-white bg-cyan-500 hover:bg-cyan-600 rounded-md disabled:opacity-50">
          {isSubmitting ? 'Creating...' : 'Create Project'}
        </button>
      </div>
    </form>
  );
};
