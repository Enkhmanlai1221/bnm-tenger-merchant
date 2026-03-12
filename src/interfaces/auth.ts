import { IUser } from "./user";

export interface IAuth {
  username?: string | null;
  password?: string | null;
  accessToken: string | null;
  sessionScope: string | null;
  user: IUser | null;
  remember: string | null;
  accountType: string | null;
}
