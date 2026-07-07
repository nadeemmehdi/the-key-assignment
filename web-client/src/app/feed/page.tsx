import { ForumDashboard } from "@/features/forum/components/forum-dashboard";
import { forumApi } from "@/features/forum/api/forum-api";

export default async function FeedPage() {
  const health = await forumApi.getHealth();
  return <ForumDashboard health={health} view="feed" />;
}
