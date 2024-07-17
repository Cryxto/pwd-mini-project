
export interface AuthInputInterface {
  username : string,
  firstName : string,
  lastName : string,
  password : string,
  email : string,
  middleName ?: string,
}

export interface AuthCompleteInterface extends AuthInputInterface {
  createdAt ?: Date | string,
  deletedAt ?: Date | string,
  updatedAt ?: Date | string,
  createdBy ?: bigint,
  updatedBy ?: bigint,
  deletedBy ?: bigint,
}

export interface AuthResultInterface {
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date | null;
}