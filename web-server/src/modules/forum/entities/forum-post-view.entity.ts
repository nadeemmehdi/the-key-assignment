export type ForumPostViewEntity = {
  id: string;
  courseId: string;
  authorId: string;
  title: string;
  body: string;
  likeCount: number;
  viewCount: number;
  commentCount: number;
  createdAt: Date;
  hasSaved: boolean;
  savesCount: number;
};
