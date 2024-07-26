
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
  createdBy ?: number,
  updatedBy ?: number,
  deletedBy ?: number,
}

export interface AuthResultInterface {
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date | null;
  referalCode: string | null;
  referedBy? : number | string | null
}

export interface AuthJWTInterface {
  id:number|string;
  username: string;
  email: string;
  referalCode: string;
  firstName : string;
  lastName : string;
  middleName ?: string;
}