import Base from "./baseService";

class RolePermissionService extends Base {
  getPermissionByRoleCode = async (data: {roleCode: string}) => {
    return this.request({
      url: "/api/v1/rolePermissions/getPermissionByGroupId",
      method: "GET",
      data: data,
    });
  }
}

export default () => new RolePermissionService();
