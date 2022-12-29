import BaseModel from './BaseModel'

class RolePermissionModel extends BaseModel {
  static tableName = "role_permissions"

  //fields
  id: number;
  roleId: number;
  permissionId: number;
  key: string;
  value: number;
  createdAt: Date;
  createdBy: number;

  static async getByPermissionKey(condition) {
    return await this.getOne(condition)
  }

  static async getPermissions(roleId) {
    let permissions = await this.getByCondition({ roleId: roleId })
    let result = {}
    for (let permission of permissions) {
      result[permission.key] = permission.value
    }
    return result
  }
}

export default RolePermissionModel
