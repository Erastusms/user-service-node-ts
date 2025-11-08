export interface UserEntity {
  id?: string;
  username: string;
  email: string;
  phone?: string;
  fullName: string;
  gender?: string;
  dateOfBirth?: Date;
  address?: string;
  avatarUrl?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
