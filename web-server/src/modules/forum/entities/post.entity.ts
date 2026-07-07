export type PostEntity = {
  id: string;
  courseId: string;
  authorId: string;
  title: string;
  body: string;
  likeCount: number;
  viewCount: number;
  commentCount: number;
  isRemoved: boolean;
  createdAt: Date;
};
