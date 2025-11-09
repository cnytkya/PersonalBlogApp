// C#'taki RegisterDto'ya karşılık gelir
export interface Register {
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
  password?: string; // Formda opsiyonel olabilir
}