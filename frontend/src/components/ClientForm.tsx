import React, { useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Client } from '@/interfaces/clientInterfaces';

// Schema agora valida apenas o nome do cliente
const clientSchema = z.object({
  clientName: z.string().min(3, { message: "Client name must be at least 3 characters long." }),
});

type ClientFormData = z.infer<typeof clientSchema>;

interface ClientFormProps {
  onSubmit: SubmitHandler<ClientFormData>;
  onCancel: () => void;
  initialData?: Client | null;
  isSubmitting: boolean;
}

export const ClientForm: React.FC<ClientFormProps> = ({ onSubmit, onCancel, initialData, isSubmitting }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      clientName: initialData?.clientName || '',
    },
  });

  useEffect(() => {
    reset({
      clientName: initialData?.clientName || '',
    });
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="clientName" className="block text-sm font-medium text-sky-200 mb-1">
          Client Name
        </label>
        <input id="clientName" type="text" {...register('clientName')}
               className="h-10 w-full bg-sky-700 px-3 text-white placeholder:text-slate-400 border border-sky-600 rounded-md outline-none focus:ring-2 focus:ring-cyan-400 disabled:opacity-50"
               disabled={isSubmitting} />
        {errors.clientName && <p className="text-sm text-red-400 mt-1">{errors.clientName.message}</p>}
      </div>
      <div className="flex justify-end gap-4 pt-4">
        <button type="button" onClick={onCancel} disabled={isSubmitting}
                className="px-4 py-2 text-sm font-semibold text-white bg-sky-700 hover:bg-sky-600 rounded-md transition-colors disabled:opacity-50">
          Cancel
        </button>
        <button type="submit" disabled={isSubmitting}
                className="px-4 py-2 text-sm font-semibold text-white bg-cyan-500 hover:bg-cyan-600 rounded-md transition-colors disabled:opacity-50">
          {isSubmitting ? 'Saving...' : 'Save Client'}
        </button>
      </div>
    </form>
  );
};
