import Permission from '../models/Permission';

export async function hasPermission(userId: number, projectId: number, requiredLevel: number): Promise<boolean> {
  console.log(userId, projectId, requiredLevel);
  let permission: Permission | null;
  if (!projectId) {
    permission = await Permission.findOne({where: {userId}});
  } else {
    permission = await Permission.findOne({where: {userId, projectId}});
  }
  return (permission && permission.level >= requiredLevel) || false;
}
