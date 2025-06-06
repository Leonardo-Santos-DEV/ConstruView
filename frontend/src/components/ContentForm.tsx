import React, { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const contentSchema = z.object({
  contentName: z.string().min(3, { message: "View name is too short." }),
  url: z.string().url({ message: "Please enter a valid Matterport URL." }),
  previewImageFile: z.instanceof(FileList)
    .refine(files => files.length > 0, { message: "A preview image is required." })
    .refine(files => files[0]?.type.startsWith("image/"), { message: "Only image files are accepted." }),
});

type ContentFormData = z.infer<typeof contentSchema>;

interface ContentFormProps {
  onSubmit: SubmitHandler<ContentFormData>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const ContentForm: React.FC<ContentFormProps> = ({ onSubmit, onCancel, isSubmitting }) => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<ContentFormData>({
    resolver: zodResolver(contentSchema),
  });

  const [preview, setPreview] = useState<string | null>(null);
  const imageFile = watch('previewImageFile');

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
      <div>
        <label htmlFor="contentName" className="block text-sm font-medium text-sky-200 mb-1">View Name</label>
        <input id="contentName" type="text" {...register('contentName')}
               className="h-10 w-full bg-sky-700 px-3 text-white rounded-md border border-sky-600 focus:outline-none focus:ring-2 focus:ring-cyan-400" />
        {errors.contentName && <p className="text-sm text-red-400 mt-1">{errors.contentName.message}</p>}
      </div>

      <div>
        <label htmlFor="url" className="block text-sm font-medium text-sky-200 mb-1">Matterport URL</label>
        <input id="url" type="url" {...register('url')} placeholder="https://my.matterport.com/show/?m=..."
               className="h-10 w-full bg-sky-700 px-3 text-white rounded-md border border-sky-600 focus:outline-none focus:ring-2 focus:ring-cyan-400" />
        {errors.url && <p className="text-sm text-red-400 mt-1">{errors.url.message}</p>}
      </div>

      <div>
        <label htmlFor="previewImageFile" className="block text-sm font-medium text-sky-200 mb-1">Preview Image</label>
        <input id="previewImageFile" type="file" accept="image/*" {...register('previewImageFile')}
               className="w-full text-sm text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-500 file:text-white hover:file:bg-cyan-600" />
        {errors.previewImageFile && <p className="text-sm text-red-400 mt-1">{errors.previewImageFile.message as string}</p>}
        {preview && <img src={preview} alt="Preview" className="mt-4 rounded-lg max-h-40 w-auto" />}
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-semibold rounded-md text-sky-200 hover:bg-sky-700">Cancel</button>
        <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-semibold text-white bg-cyan-500 hover:bg-cyan-600 rounded-md disabled:opacity-50">
          {isSubmitting ? 'Creating...' : 'Create 360 View'}
        </button>
      </div>
    </form>
  );
};
