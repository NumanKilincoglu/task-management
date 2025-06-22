export class LoginResponseDto {
  message: string;
  user: {
    id: number;
    email: string;
    name: string;
    phone: string;
    created_at: Date;
    updated_at: Date;
  };
  token: string;
}
