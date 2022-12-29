interface Role {
  id: number;
  name: string;
  description: string;
  parentId: number;
  key: string;
  createdAt: string;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  roleId: number;
  createdAt: string;
}

interface Role {
  id: number;
  name: string;
  description: string;
  parentId: number;
  key: number;
  createdAt: string;
  code: string;
}