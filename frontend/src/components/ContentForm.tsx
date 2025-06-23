// CÓDIGO ATUALIZADO
import React, { useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Content } from '@/interfaces/contentInterfaces';

const contentSchema = z.object({
  contentName: z.string().min(3, { message: "O nome é muito curto." }),
  url: z.string().url({ message: "Por favor, insira uma URL do Matterport válida." }),
  date: z.string().min(1, { message: "A data é obrigatória." }),
});

type ContentFormData = z.infer<typeof contentSchema>;

interface ContentFormProps {
  onSubmit: SubmitHandler<ContentFormData>;
  onCancel: () => void;
  isSubmitting: boolean;
  isEditing: boolean;
  initialData?: Content | null;
}

export const ContentForm: React.FC<ContentFormProps> = ({ onSubmit, onCancel, isSubmitting, isEditing, initialData }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContentFormData>({
    resolver: zodResolver(contentSchema),
  });

  // Formata a data para o input type="date"
  const formatDateForInput = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString().split('T')[0];
  };

  useEffect(() => {
    if (initialData) {
      reset({
        contentName: initialData.contentName,
        url: initialData.url,
        date: formatDateForInput(initialData.date),
      });
    }
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="contentName" className="block text-sm font-medium text-sky-200 mb-1">Nome da Vista</label>
        <input id="contentName" type="text" {...register('contentName')}
               className="h-10 w-full bg-sky-700 px-3 text-white rounded-md border border-sky-600 focus:outline-none focus:ring-2 focus:ring-cyan-400" />
        {errors.contentName && <p className="text-sm text-red-400 mt-1">{errors.contentName.message}</p>}
      </div>

      <div>
        <label htmlFor="url" className="block text-sm font-medium text-sky-200 mb-1">URL do Matterport</label>
        <input id="url" type="url" {...register('url')} placeholder="https://my.matterport.com/show/?m=..."
               className="h-10 w-full bg-sky-700 px-3 text-white rounded-md border border-sky-600 focus:outline-none focus:ring-2 focus:ring-cyan-400" />
        {errors.url && <p className="text-sm text-red-400 mt-1">{errors.url.message}</p>}
      </div>

      <div>
        <label htmlFor="date" className="block text-sm font-medium text-sky-200 mb-1">Data do Conteúdo</label>
        <input id="date" type="date" {...register('date')}
               className="h-10 w-full bg-sky-700 px-3 text-white rounded-md border border-sky-600 focus:outline-none focus:ring-2 focus:ring-cyan-400" />
        {errors.date && <p className="text-sm text-red-400 mt-1">{errors.date.message}</p>}
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-semibold rounded-md text-sky-200 hover:bg-sky-700">Cancelar</button>
        <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-semibold text-white bg-cyan-500 hover:bg-cyan-600 rounded-md disabled:opacity-50">
          {isSubmitting ? 'Salvando...' : (isEditing ? 'Salvar Alterações' : 'Criar Vista')}
        </button>
      </div>
    </form>
  );
};
