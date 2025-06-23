import Content from '../models/Content';
import Project from "../models/Project";
import {CreateContentPayload, UpdateContentPayload} from '../interfaces/ContentInterfaces';

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
      order: [['date', 'DESC'], ['createdAt', 'DESC']]
    });
  }

  static async getById(contentId: number) {
    return Content.findByPk(contentId, { include: [{ model: Project, as: 'project' }] });
  }

  static async create(payload: CreateContentPayload) {
    const contentData = {
      projectId: payload.projectId,
      category: payload.category,
      contentName: payload.contentName,
      url: payload.url,
      date: new Date(payload.date),
      enabled: true,
    };

    const newContentInstance = await Content.create(contentData);
    return this.getById(newContentInstance.contentId);
  }

  static async update(contentId: number, payload: UpdateContentPayload): Promise<Content | null> {
    const content = await Content.findByPk(contentId);
    if (!content) return null;

    const dataToUpdate: { [key: string]: any } = { ...payload };
    if (payload.date) {
      dataToUpdate.date = new Date(payload.date);
    }

    await content.update(dataToUpdate);
    return this.getById(contentId);
  }

  static async disable(contentId: number): Promise<Content | null> {
    const content = await Content.findByPk(contentId);
    if (!content) return null;
    await content.update({ enabled: false });
    return content;
  }
}
