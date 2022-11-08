export interface IUser {
  user?: {
    email: string;
    password: string;
    id: string;
  };
}

export interface IContext {
  req: Request & IUser;
  res: Response;
}
