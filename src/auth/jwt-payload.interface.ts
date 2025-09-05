export interface JwtPayload {
  identifier: string | null;
  name: string | null;
  email: string;
  userType: string;
  company_id: number;
}
