import BaseController from './BaseController'
import Model from '@root/server/app/Models/UserModel'
import RoleModel from '@root/server/app/Models/RoleModel';
import RolePermissionModel from '@root/server/app/Models/RolePermissionModel';
import ApiException from '@app/Exceptions/ApiException'
import Auth from '@libs/Auth'
import authConfig from '@config/auth'
import to from 'await-to-js'
import redis from '@app/Services/Redis/index'

export default class AuthController extends BaseController {
  Model: any = Model
  RoleModel: any = RoleModel
  RolePermissionModel: any = RolePermissionModel

  async login() {
    const inputs = this.request.all();
    const allowFields = {
      username: "string!",
      password: "string!"
    }

    const data = this.validate(inputs, allowFields, { removeNotAllow: true });
    let user = await this.Model.checkLogin({
      username: data.username,
      password: data.password
    })
    if (!user) throw new ApiException(7000, "Can not login")

    let role = await this.RoleModel.getById(user.roleId)
    if (!role) throw new ApiException(6000, "User role doesn't exist!")

    let permissions = await this.RolePermissionModel.getPermissions(role.id);

    let token = Auth.generateJWT({
      id: user.id,
      username: user.username,
      permissions: permissions,
      roleId: user.roleId
    }, {
      key: authConfig['SECRET_KEY_ADMIN'],
      expiresIn: authConfig['JWT_EXPIRE_ADMIN']
    });

    return {
      token,
      user: {
        ...user,
        permissions
      }
    }
  }

  async logout() {
    const inputs = this.request.all();
    const { auth } = this.request;
    const allowFields = {
      username: "string!",
    }
    const data = this.validate(inputs, allowFields, { removeNotAllow: true });

    let tokenOld = auth.token
    let TimeExp = auth.exp - Date.now() / 1000
    redis.set(`${tokenOld}`, `${tokenOld}`, "EX", TimeExp.toFixed())

    return data
  }

  async forgotPassword() {
    const allowFields = {
      email: "string!"
    }
    let inputs = this.request.all()
    let params = this.validate(inputs, allowFields, { removeNotAllow: true });

    let exist = await this.Model.getOne({ email: params.email })
    if (!exist) throw new ApiException(6006, "User does't exist!")

    //sent email
    let variables = {
      resetPasswordLink: this.makeForgotPasswordLink(exist),
      name: exist.name,
      email: exist.email,
    }
    //MailService.send(exist.email, subject, content, variables)

    return exist
  }

  makeForgotPasswordLink(user) {
    let token = Auth.generateJWT({
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email
    }, {
      key: authConfig['SECRET_KEY_ADMIN'],
      expiresIn: authConfig['JWT_EXPIRE_VERYFY_EMAIL']
    })

    return `${this.request.get('origin')}/reset-password/${token}`
  }

  async checkToken() {
    const allowFields = {
      token: "string!"
    }
    let inputs = this.request.all()
    let params = this.validate(inputs, allowFields, { removeNotAllow: true });

    let [error, auth] = await to(Auth.verify(params.token, {
      key: authConfig['SECRET_KEY_ADMIN']
    }))
    if (error) throw new ApiException(6012, "The token has expired")

    let user = await this.Model.getById(auth.id);
    if (!user) throw new ApiException(6006, "User doesn't exist!")

    delete user.password

    return user
  }

  async resetPassword() {
    const allowFields = {
      token: "string!",
      newPassword: "string!"
    }
    let inputs = this.request.all()
    let params = this.validate(inputs, allowFields, { removeNotAllow: true });

    let [error, auth] = await to(Auth.verify(params.token, {
      key: authConfig['SECRET_KEY_ADMIN']
    }))
    if (error) throw new ApiException(6012, "The token has expired")

    let user = await this.Model.getById(auth.id);
    if (!user) throw new ApiException(6006, "User doesn't exist!")

    let hash = await this.Model.hash(params.newPassword)

    return await this.Model.updateOne(user.id, { password: hash })
  }

  async changePassword() {
    let inputs = this.request.all()
    const allowFields = {
      password: "string!"
    }
    let data = this.validate(inputs, allowFields, { removeNotAllow: true });
    const auth = this.request.auth || {};
    const id = auth.id;

    let user = await this.Model.query().findById(id);
    if (!user) throw new ApiException(6006, "User doesn't exist!")

    let result = await user.changePassword(data['password'])
    delete result['password']

    return result
  }

  async refreshToken() {
    let input = this.request.all()
    const { auth } = this.request
    const allowFields = {
      isApp: "boolean",
    }
    let data = this.validate(input, allowFields)

    let user = await this.Model.getOne({ id: auth.id })
    if (!user) throw new ApiException(6006, "User doesn't exist")

    let role = await this.RoleModel.getById(user.roleId)
    if (!role) throw new ApiException(6000, "User role doesn't exist!")

    let permissions = await this.RolePermissionModel.getPermissions(role.roleId);

    let tokenNew = Auth.generateJWT({
      id: user.id,
      username: user.username,
      permissions: permissions,
      roleId: role.id,
    }, {
      key: authConfig['SECRET_KEY_ADMIN'],
      expiresIn: authConfig['JWT_REFRESH_TIME']
    });

    let tokenOld = auth.token
    let TimeExp = auth.exp - Date.now() / 1000
    redis.set(`${tokenOld}`, `${tokenOld}`, "EX", TimeExp.toFixed())

    return {
      token: tokenNew
    }
  }
}