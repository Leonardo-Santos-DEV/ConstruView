import Permission from '../models/Permission';

export async function hasPermission(userId: number, projectId: number, requiredLevel: number): Promise<boolean> {
  let permission: Permission | null;
  if (projectId) {
    permission = await Permission.findOne({where: {userId, projectId}});
  } else {
    permission = await Permission.findOne({where: {userId}});
    if (!permission) {
      return true;
    }
  }
  return (permission && permission.level >= requiredLevel) || false;
}
