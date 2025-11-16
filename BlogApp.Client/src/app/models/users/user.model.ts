// API'den gelen UserDto'ya karşılık gelir
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  roles: string[];
}

// API'deki CreateUserDto'ya karşılık gelir
export interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
  password?: string;
  roleName?: string; // API'miz varsayılan olarak 'User' atar
}

// API'deki UpdateUserDto'ya karşılık gelir
export interface UpdateUserDto {
  firstName: string;
  lastName: string;
  email: string;
}