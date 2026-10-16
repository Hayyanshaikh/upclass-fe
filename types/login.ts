export enum Role {
  SUPERADMIN = "SUPERADMIN",
  ADMIN = "ADMIN",
  TEACHER = "TEACHER",
  STUDENT = "STUDENT",
  PARENT = "PARENT",
}

export type Login = {
  email: string;
  password: string;
  role: Role;
};
