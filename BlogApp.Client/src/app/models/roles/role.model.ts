export interface Role {
  id: string;
  name: string;
}

/**
 * Yeni bir rol oluşturmak (POST) için kullanılacak DTO.
 */
export interface CreateRoleDto {
  name: string;
}