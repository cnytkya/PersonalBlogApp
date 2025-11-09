import { IdentityError } from "./identity-error.model";

// C#'taki AuthResponseDto'ya karşılık gelir
export interface AuthResponse {
  isSuccess: boolean;
  message: string;
  token: string;
  tokenExpires?: Date;
  
  // Angular'da kullanacağımız ekstra bilgiler
  userId?: string;
  email?: string;
  firstName?: string;
  roles?: string[];

  // Hata durumunda
  errors?: IdentityError[];
}