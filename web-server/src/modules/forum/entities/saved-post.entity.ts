export type SavedPostEntity = {
  id: string;
  userId: string;
  postId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};
