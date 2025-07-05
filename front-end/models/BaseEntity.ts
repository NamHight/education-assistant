export interface BaseEntity {
  id: string; // UUID string
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
