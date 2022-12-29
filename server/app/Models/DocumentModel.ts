import BaseModel from './BaseModel'

class DocumentModel extends BaseModel {
  static tableName = "documents"

  //fields
  id: number;
  formId: string;
  formName: string;
  data: Array<string>;
  issuedBy: string;
  issuedDate: Date;
  submitter: string;
  company: string;
  tenant: string;
  status: string;
  updatedDate: Date;
  createdBy: number;
  updatedBy: number;
}
export default DocumentModel
