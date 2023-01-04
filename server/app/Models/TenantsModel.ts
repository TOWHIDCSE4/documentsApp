import BaseModel from './BaseModel'

class TenantsModel extends BaseModel {
  static tableName = "tenants"

  //fields
  id: number;
  code: string;
  name: string;
  email: string;
  phone: number;
  address: string;
  state: string;
  others: any;
  createdBy: number;
  updatedBy: number;


}

export default TenantsModel
