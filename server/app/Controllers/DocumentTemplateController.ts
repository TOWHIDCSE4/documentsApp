import BaseController from './BaseController'
import DocumentTemplateModel from '@root/server/app/Models/DocumentTemplateModel'
import UserModel from '@root/server/app/Models/UserModel'
import ApiException from '@app/Exceptions/ApiException'
import constantConfig from '@config/constant'

export default class DocumentTemplateController extends BaseController {
    Model: any = DocumentTemplateModel
    UserModel: any = UserModel

  async index() {
    const data = this.request.all()
    let result = await this.Model.query().getForGridTable(data);
    return result;
  }

  async detail({ allowFields = '*' }) {
    let params = this.request.all()
    let id = params.id
    if (!id) throw new ApiException(9996, "ID is required!");
    let result = await this.Model.query().findById(id, allowFields);
    if (!result) {
      throw new ApiException(7002, 'Data not found')
    }
    return result
  }

  async store({ allowFields = {} } = {}) {
    let inputs = this.request.all()
    let data = this.validate(inputs, allowFields, { removeNotAllow: false });
    return await this.Model.query().insert(data);
  }

  async update({ allowFields = {} } = {}) {
    let inputs = this.request.all()
    let data = this.validate(inputs, allowFields, { removeNotAllow: false });
    let id = data.id;
    delete data.id

    return await this.Model.query().patchAndFetchById(id, data)
  }

//   async destroy() {
//     let params = this.request.all();
//     let id = params.id;
//     if (!id) throw new ApiException(9996, "ID is required!");
//     return { message: `Delete successfully` }
//   }

//   async delete({ request, response }) {
//     let { ids = [] } = this.request.all();
//     if (!ids || !Array.isArray(ids)) throw new ApiException(9996, "ID is required. Expected: Array!");
//     return await this.Model.query().where('id', 'in', ids).delete();
//   }
}
