import React, { useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { User } from '@/interfaces/userInterfaces';

const createUserSchema = (isEditing: boolean) => z.object({
  userName: z.string().min(3, "Username must be at least 3 characters."),
  email: z.string().email("Please enter a valid email."),
  password: isEditing
    ? z.string().min(6, "New password must be at least 6 characters.").optional().or(z.literal(''))
    : z.string().min(6, "Password is required and must be at least 6 characters."),
});

type UserFormData = z.infer<ReturnType<typeof createUserSchema>>;

interface UserFormProps {
  onSubmit: SubmitHandler<UserFormData>;
  onCancel: () => void;
  isEditing: boolean;
  initialData?: User | null;
  isSubmitting: boolean;
}

export const UserForm: React.FC<UserFormProps> = ({ onSubmit, onCancel, isEditing, initialData, isSubmitting }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<UserFormData>({
    resolver: zodResolver(createUserSchema(isEditing)),
    defaultValues: {
      userName: initialData?.userName || '',
      email: initialData?.email || '',
      password: '',
    },
  });

  useEffect(() => {
    reset({
      userName: initialData?.userName || '',
      email: initialData?.email || '',
      password: '',
    });
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="userName" className="block text-sm font-medium text-sky-200 mb-1">Name</label>
        <input id="userName" type="text" {...register('userName')}
               className="h-10 w-full bg-sky-700 px-3 text-white rounded-md border border-sky-600 focus:outline-none focus:ring-2 focus:ring-cyan-400" />
        {errors.userName && <p className="text-sm text-red-400 mt-1">{errors.userName.message}</p>}
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-sky-200 mb-1">Email</label>
        <input id="email" type="email" {...register('email')}
               className="h-10 w-full bg-sky-700 px-3 text-white rounded-md border border-sky-600 focus:outline-none focus:ring-2 focus:ring-cyan-400" />
        {errors.email && <p className="text-sm text-red-400 mt-1">{errors.email.message}</p>}
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-sky-200 mb-1">
          Password {isEditing && <span className="text-xs text-slate-400">(leave blank to keep current)</span>}
        </label>
        <input id="password" type="password" {...register('password')}
               className="h-10 w-full bg-sky-700 px-3 text-white rounded-md border border-sky-600 focus:outline-none focus:ring-2 focus:ring-cyan-400" />
        {errors.password && <p className="text-sm text-red-400 mt-1">{errors.password.message}</p>}
      </div>
      <div className="flex justify-end gap-4 pt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-semibold text-white bg-sky-700 hover:bg-sky-600 rounded-md transition-colors">
          Cancel
        </button>
        <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-semibold text-white bg-cyan-500 hover:bg-cyan-600 rounded-md transition-colors disabled:opacity-50">
          {isSubmitting ? 'Saving...' : (isEditing ? 'Save Changes' : 'Create User')}
        </button>
      </div>
    </form>
  );
};
