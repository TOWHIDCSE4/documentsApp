import BaseController from './BaseController'
import UserModel from '@root/server/app/Models/UserModel'
import RoleModel from '@app/Models/RoleModel'
import ApiException from '@app/Exceptions/ApiException'
import { removeVietnameseTones ,hashNumber} from '@helpers/utils'
export default class AdminController extends BaseController {
  Model: typeof UserModel = UserModel
  RoleModel: any = RoleModel

  async index() {
    const { auth } = this.request;
    let inputs = this.request.all()
    let project = [
      "users.username",
      "users.firstName",
      "users.lastName",
      "users.email",
      "users.roleId",
      "users.code",
      "users.id",
      "roles.name as roleName"
    ]
    let getAccountsItCreated = await this.Model.getAccountsItCreated(auth.id)
    let getAccountsItCreatedId = getAccountsItCreated.map(item => item.id)
    let result = await this.Model.query()
      .leftJoin('roles', 'users.roleId', 'roles.id')
      .whereNot('roles.key', 'root')
      .whereIn('users.id',getAccountsItCreatedId)
      .select(project)
      .getForGridTable(inputs)

    return result;
  }

  async detail() {
    const allowFields = {
      id: "string!"
    }
    let inputs = this.request.all();
    let params = this.validate(inputs, allowFields, { removeNotAllow: true });

    let result = await this.Model.getOne({ code: params.id });
    if (!result) throw new ApiException(6000, "user doesn't exist!")
    delete result['password']
    return result
  }

  async store() {
    const { auth } = this.request
    let inputs = this.request.all()
    const allowFields = {
      firstName: "string!",
      lastName: "string!",
      username: "string!",
      password: "string!",
      roleId: "number!",
      email: "string!"
    }

    let params = this.validate(inputs, allowFields, { removeNotAllow: true });

    let username = params.username.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '')
    let usernameExist = await this.Model.findExist(username, 'username')
    if (usernameExist) throw new ApiException(6007, "Username already exists!")

    let emailExist = await this.Model.findExist(params.email, 'email')
    if (emailExist) throw new ApiException(6021, "Email already exists!")

    let role = await this.RoleModel.getById(params.roleId)
    if (!role) throw new ApiException(6000, "User role not exists!")

    if (params['password']) params['password'] = await this.Model.hash(params['password']);

    params = {
      ...params,
      roleId: role.id,
      createdBy: auth.id
    }

    let result = await this.Model.insertOne(params);
    let code = hashNumber(String(result.id));
    let resultUpdate = await this.Model.updateOne(result.id, { code: code });
    delete resultUpdate['password']
    return resultUpdate
  }

  async update() {
    let inputs = this.request.all()
    const allowFields = {
      id: "number!",
      firstName: "string!",
      lastName: "string!",
      email: "string!"
    }
    let params = this.validate(inputs, allowFields, { removeNotAllow: true });

    const { id } = params
    delete params.id

    let exist = await this.Model.getById(id)
    if (!exist) throw new ApiException(6006, "User doesn't exists!")

    let emailExist = await this.Model.getOne({ email: params.email })
    if (emailExist && emailExist.id !== exist.id) throw new ApiException(6021, "Email already exists!")

    let result = await this.Model.updateOne(id, { ...params });
    delete result['password']

    return {
      result,
      old: exist
    }
  }

  async destroy() {
    const { auth } = this.request
    let params = this.request.all();

    let id = params.id;
    if (!id) throw new ApiException(9996, "ID is required!");

    let exist = await this.Model.getById(id)
    if (!exist) throw new ApiException(6006, "User doesn't exists!")
    if ([id].includes(auth.id)) throw new ApiException(6022, "You can not remove your account.")

    let user = await this.Model.query().where('id', params.id).first()
    await user.$query().delete()

    return {
      message: `Delete successfully`,
      old: user
    }
  }

  async delete() {
    const { auth } = this.request
    const allowFields = {
      ids: ["number!"]
    }
    const inputs = this.request.all();
    let params = this.validate(inputs, allowFields);

    let exist = await this.Model.query().whereIn('id', params.ids)
    if (!exist || exist.length !== params.ids.length) throw new ApiException(6006, "User doesn't exists!")
    if (params.ids.includes(auth.id)) throw new ApiException(6022, "You can not remove your account.")

    let users = await this.Model.query().whereIn('id', params.ids)
    for (let user of users) {
      await user.$query().delete()
    }

    return {
      old: {
        usernames: (users || []).map(user => user.username).join(', ')
      }
    };
  }

  async getInfo() {
    const { auth } = this.request;
    let result = await this.Model.getById(auth.id);
    delete result['password']

    if (!result) throw new ApiException(6006, "User doesn't exist")

    return result
  }
}
