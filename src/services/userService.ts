import Base from "./baseService";

class usersService extends Base {
  index = async (filter: any) => {
    return this.request({
      url: "/api/v1/users",
      method: "GET",
      data: filter,
    });
  };

  create = async (data: any) => {
    return this.request({
      url: "/api/v1/users",
      method: "POST",
      data: data,
    });
  };

  detail = async (data: any) => {
    return this.request({
      url: "/api/v1/users/:id",
      method: "GET",
      data: data,
    });
  };

  edit = async (data: any) => {
    return this.request({
      url: "/api/v1/users/:id",
      method: "PUT",
      data: data,
    });
  };

  delete = async (data: any) => {
    return this.request({
      url: "/api/v1/users",
      method: "DELETE",
      data: data,
    });
  };

  destroy = async (data: any) => {
    return this.request({
      url: "/api/v1/users/:id",
      method: "DELETE",
      data: data,
    });
  };
}

export default () => new usersService();
