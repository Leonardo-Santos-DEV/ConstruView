import Content from '../models/Content';
import Project from "../models/Project";
import { uploadImageToCloudinary } from "../helpers/uploadImageToCloudinary";
import { CreateContentPayload } from '../interfaces/ContentInterfaces';

export default class ContentService {
  static async getAll(payload: { projectId: number, category?: string }) {
    const whereClause: any = {
      projectId: payload.projectId,
      enabled: true
    };

    if (payload.category) {
      whereClause.category = payload.category;
    }

    return Content.findAll({
      where: whereClause,
      include: [{ model: Project, as: 'project' }],
      order: [['createdAt', 'DESC']]
    });
  }

  static async getById(contentId: number) {
    return Content.findByPk(contentId, { include: [{ model: Project, as: 'project' }] });
  }

  static async create(payload: CreateContentPayload) {
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error("Cloudinary configuration is missing.");
      throw new Error('Internal server error: Image upload service not configured.');
    }

    let previewImageUrl = process.env.DEFAULT_IMAGE ?? 'https://res.cloudinary.com/dfpdfsuv3/image/upload/v1749297418/vr6d7yslybmfi4ctrbxt.png';

    if (payload.previewImageFile) {
      previewImageUrl = await uploadImageToCloudinary(payload.previewImageFile.buffer);
    }

    const contentData = {
      projectId: payload.projectId,
      category: payload.category,
      contentName: payload.contentName,
      url: payload.url,
      previewImageUrl,
      enabled: true,
    };

    const newContentInstance = await Content.create(contentData);

    return this.getById(newContentInstance.contentId);
  }

  static async update(contentId: number, payload: any) {
    const content = await Content.findByPk(contentId);
    if (!content) return null;
    await content.update(payload);
    return content;
  }

  static async disable(contentId: number) {
    const content = await Content.findByPk(contentId);
    if (!content) return null;
    await content.update({ enabled: false });
    return content;
  }
}
