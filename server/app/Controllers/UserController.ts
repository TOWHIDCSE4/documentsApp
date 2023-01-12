import BaseController from './BaseController'
import UserModel from '@root/server/app/Models/UserModel'
import RoleModel from '@app/Models/RoleModel'
import ApiException from '@app/Exceptions/ApiException'
import { removeVietnameseTones ,hashNumber ,makeKey} from '@helpers/utils'
import TenantsModel from '@app/Models/TenantsModel'
const speakeasy = require('speakeasy');
export default class AdminController extends BaseController {
  Model: typeof UserModel = UserModel
  RoleModel: any = RoleModel
  TenantsModel: any = TenantsModel

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
      "tenants.name as tenantName",
      "roles.name as roleName",
      "users.createdAt",
      "ag.username as agUsername",
    ]
    // let getAccountsItCreated = await this.Model.getAccountsItCreated(auth.id)
    let tenantId = await this.Model.getTenantId(auth.id)
    // let getAccountsItCreatedId = getAccountsItCreated.map(item => item.id)

    let role = await this.RoleModel.getById(auth.roleId);
    let query = this.Model.query()
      .leftJoin('users as ag', 'users.createdBy', 'ag.id')
      .leftJoin('roles', 'users.roleId', 'roles.id')
      .leftJoin('tenants', 'users.tenantId', 'tenants.id')
      .whereNot('users.id', auth.id)

    if(role.key != 'root'){
      query = query
      .where('users.tenantId', tenantId)
      .whereNot('roles.key', 'root')
      // .whereIn('users.id',getAccountsItCreatedId)
    }

    let result = await query
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
    delete result['twofaKey']
    delete result['isFirst']
    delete result['twofa']
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
      email: "string!",
      twofa: "boolean",
      tenantId: "number"
    }

    let params = this.validate(inputs, allowFields, { removeNotAllow: true });
    let twoFa = typeof params.twofa === 'undefined' ? 1 : params.twofa ? 1 : 0;
    let tenantId = null
    if(!params.tenantId) {
      tenantId = await this.Model.getTenantId(auth.id)
      if(!tenantId) throw new ApiException(6000, "Tenant doesn't exist!")
    }else {
      let checkTenant = await this.TenantsModel.getById(params.tenantId)
      if(!checkTenant) throw new ApiException(6000, "Tenant doesn't exist!")
      tenantId = checkTenant.id
    }
    let username = params.username.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '')
    let usernameExist = await this.Model.findExist(username, 'username')
    if (usernameExist) throw new ApiException(6007, "Username already exists!")

    let emailExist = await this.Model.findExist(params.email, 'email')
    if (emailExist) throw new ApiException(6021, "Email already exists!")

    let role = await this.RoleModel.getById(params.roleId)
    if (!role) throw new ApiException(6000, "User role not exists!")

    if (params['password']) params['password'] = await this.Model.hash(params['password']);
    let twofaKey = makeKey(32);
    do {
      twofaKey = makeKey(32);
    } while (!!await this.Model.getOne({ twofaKey: twofaKey }))

    params = {
      ...params,
      roleId: role.id,
      createdBy: auth.id,
      twofaKey: twofaKey,
      twofa: twoFa,
      isFirst: 1,
      tenantId: tenantId
    }
    let result = await this.Model.insertOne(params);
    let code = hashNumber(String(result.id));
    let resultUpdate = await this.Model.updateOne(result.id, { code: code });
    delete resultUpdate['password']
    delete resultUpdate['twofaKey']
    delete resultUpdate['isFirst']
    delete resultUpdate['twofa']
    return resultUpdate
  }

  async update() {
    let inputs = this.request.all()
    const allowFields = {
      id: "number!",
      firstName: "string!",
      lastName: "string!",
      email: "string!",
      twofa: "boolean"
    }
    let params = this.validate(inputs, allowFields, { removeNotAllow: true });
    let twoFa = typeof params.twofa === 'undefined' ? 1 : params.twofa ? 1 : 0;
    const { id } = params
    delete params.id

    let exist = await this.Model.getById(id)
    if (!exist) throw new ApiException(6006, "User doesn't exists!")

    let emailExist = await this.Model.getOne({ email: params.email })
    if (emailExist && emailExist.id !== exist.id) throw new ApiException(6021, "Email already exists!")
    
    let dataUpdate = {
      ...params,
      twofa: twoFa 
    }

    let result = await this.Model.updateOne(id, { ...dataUpdate });
    delete result['password']
    delete result['twofaKey']
    delete result['isFirst']
    delete result['twofa']
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
    delete result['twofaKey']
    delete result['isFirst']
    delete result['twofa']
    if (!result) throw new ApiException(6006, "User doesn't exist")

    return result
  }
}
