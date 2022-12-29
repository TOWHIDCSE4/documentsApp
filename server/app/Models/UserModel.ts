import BaseModel from './BaseModel'
import ApiException from '@app/Exceptions/ApiException'
import RoleModel from "./RoleModel"
const bcrypt = require("bcrypt")
const authConfig = require("@config/auth")

class UserModel extends BaseModel {
  static tableName = "users"

  //fields
  id: number;
  username: string;
  password: string;
  roleId: number;
  firstName: string;
  lastName: string;
  email: string;
  createdBy: number;

  static get relationMappings() {
    return {
      group: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: RoleModel,
        join: {
          from: `${this.tableName}.roleId`,
          to: 'roles.id'
        }
      }
    }
  }

  static async checkLogin({ username, password }) {
    const user = await this.query().findOne({ username: username });
    if (!user) return false;

    let checkPassword = await this.compare(password, user.password);
    delete user.password;

    if (checkPassword) return user;
    return false;
  }

  static async hash(plainPassword) {
    return await bcrypt.hash(plainPassword + authConfig.SECRET_KEY, 10)
  }

  static async compare(plainPassword, encryptedPassword) {
    return await bcrypt.compare(plainPassword + authConfig.SECRET_KEY, encryptedPassword)
  }

  async changePassword(newPassword) {
    newPassword = await UserModel.hash(newPassword)
    return await this.$query().patchAndFetchById(this.id, {
      password: newPassword
    })
  }

  static async getInfoAuth(auth) {
    let result = await this.query().withGraphJoined('group').where('users.id', auth.id).first()
    if (!result) throw new ApiException(6006, "User doesn't exist!")
    return result
  }

  static async getAccountsItCreated(userId) {

    let results = [];
    if (!userId) return results;
    let current = await this.getById(userId);
    if (!current) return results;
    results.push(current);
    let parentIds = [userId]
    let isContinue = true;

    while (isContinue) {
      let children = (parentIds.length) ? await this.query().whereIn("createdBy", parentIds) : [];
      if (children.length) {
        results = results.concat(children);
        parentIds = children.map(e => e.id);
        parentIds = parentIds.filter(e => e);
      } else {
        isContinue = false;
      }
    }


    return results;
  }
}

export default UserModel
