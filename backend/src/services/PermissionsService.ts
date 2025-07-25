import Permission from '../models/Permission';
import User from '../models/User';
import { loginResponse as AuthenticatedUser } from '../interfaces/AuthInterfaces';
import { PERMISSION_LEVELS } from "../helpers/permissionLevels";

export default class PermissionService {
  static async updateUserPermissionForProject(
    actingUser: AuthenticatedUser,
    projectId: number,
    targetUserId: number,
    newLevel: number
  ): Promise<Permission> {
    const targetUser = await User.findByPk(targetUserId);
    if (!targetUser) {
      throw { statusCode: 404, message: 'Target user not found.' };
    }

    if (!actingUser.isMasterAdmin) {
      const actingUserPermission = await Permission.findOne({ where: { userId: actingUser.userId, projectId } });

      if (!actingUserPermission || actingUserPermission.level < PERMISSION_LEVELS.PROJECT_MANAGER) {
        throw { statusCode: 403, message: 'You do not have permission to manage user permissions for this project.' };
      }

      if (actingUser.userId !== targetUserId) {
        if (newLevel >= actingUserPermission.level) {
          throw { statusCode: 403, message: 'You cannot grant a permission level equal to or higher than your own.' };
        }
      }
      else {
        if (newLevel > actingUserPermission.level) {
          throw { statusCode: 403, message: 'You cannot promote yourself to a higher permission level.' };
        }
        if (newLevel < PERMISSION_LEVELS.PROJECT_MANAGER) {
          throw { statusCode: 403, message: 'A Project Manager cannot lower their own permission below Project Manager level.' };
        }
      }
    }

    const [permission, created] = await Permission.findOrCreate({
      where: { userId: targetUserId, projectId: projectId },
      defaults: { userId: targetUserId, projectId: projectId, level: newLevel }
    });

    if (!created) {
      await permission.update({ level: newLevel });
    }

    return permission;
  }

  static async getPermissionsForProject(projectId: number, clientId: number): Promise<any[]> {
    const users = await User.findAll({
      where: { clientId },
      attributes: ['userId', 'userName', 'isClientAdmin'],
      raw: true,
    });

    const permissions = await Permission.findAll({
      where: { projectId },
      raw: true,
    });

    // Mapeia as permissões para um objeto para fácil consulta: { userId: level }
    const permissionMap = permissions.reduce((acc, p) => {
      acc[p.userId] = p.level;
      return acc;
    }, {} as { [key: number]: number });

    // Combina os dados, garantindo que cada usuário tenha um nível de permissão (padrão 0)
    const result = users.map(user => ({
      userId: user.userId,
      userName: user.userName,
      isClientAdmin: user.isClientAdmin,
      level: permissionMap[user.userId] || 0, // Nível 0 (Sem Acesso) se não houver registro
    }));

    return result;
  }
}
