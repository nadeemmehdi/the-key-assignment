import { db } from "./client";
import { courses, enrollments, posts, savedPosts, users } from "./schema";

const now = new Date("2026-01-01T10:00:00.000Z");

const minutesAgo = (minutes: number) => new Date(now.getTime() - 1000 * 60 * minutes);

const studentCatalog = [
  {
    id: "student-1",
    name: "Asha",
    enrolledCourseIds: ["course-frontend", "course-backend", "course-cloud"]
  },
  {
    id: "student-2",
    name: "Mateo",
    enrolledCourseIds: ["course-backend", "course-data", "course-frontend", "course-design"]
  },
  {
    id: "student-3",
    name: "Priya",
    enrolledCourseIds: ["course-data", "course-security", "course-backend", "course-frontend"]
  },
  {
    id: "student-4",
    name: "Liam",
    enrolledCourseIds: ["course-frontend", "course-design", "course-cloud"]
  },
  {
    id: "student-5",
    name: "Zoe",
    enrolledCourseIds: [
      "course-security",
      "course-backend",
      "course-cloud",
      "course-data",
      "course-design"
    ]
  }
] as const;

const courseCatalog = [
  { id: "course-frontend", title: "Frontend Systems" },
  { id: "course-backend", title: "Backend Systems" },
  { id: "course-data", title: "Data Modeling" },
  { id: "course-cloud", title: "Cloud Foundations" },
  { id: "course-design", title: "Product Design" },
  { id: "course-security", title: "Security Essentials" }
] as const;

const seededPosts = [
  {
    id: "post-1",
    courseId: "course-frontend",
    authorId: "student-1",
    title: "Best way to organize a design system?",
    body: "I am comparing tokens-first structure versus component-first folders. What has worked well for your team in larger React projects?",
    likeCount: 3,
    viewCount: 18,
    commentCount: 2
  },
  {
    id: "post-2",
    courseId: "course-frontend",
    authorId: "student-1",
    title: "How do you keep forms readable on mobile?",
    body: "My long settings form feels cramped on smaller screens. Looking for layout patterns that still feel simple for users.",
    likeCount: 7,
    viewCount: 24,
    commentCount: 4
  },
  {
    id: "post-3",
    courseId: "course-backend",
    authorId: "student-2",
    title: "How should I handle duplicate requests safely?",
    body: "For actions like bookmarking or registration, what is the cleanest way to prevent accidental duplicate records?",
    likeCount: 5,
    viewCount: 20,
    commentCount: 1
  },
  {
    id: "post-4",
    courseId: "course-frontend",
    authorId: "student-1",
    title: "What makes a loading state feel polished?",
    body: "I want the interface to feel responsive without flashing too much. Do you prefer skeletons, subtle fades, or optimistic updates?",
    likeCount: 11,
    viewCount: 31,
    commentCount: 6
  },
  {
    id: "post-5",
    courseId: "course-backend",
    authorId: "student-2",
    title: "How do you keep query code easy to explain?",
    body: "Some repository queries become hard to read after a few joins. What patterns help keep data access clear for the next engineer?",
    likeCount: 8,
    viewCount: 29,
    commentCount: 3
  },
  {
    id: "post-6",
    courseId: "course-backend",
    authorId: "student-2",
    title: "Where should access rules live in an API?",
    body: "I am trying to keep controllers thin. Do you usually place authorization checks in services, policies, or middleware?",
    likeCount: 4,
    viewCount: 14,
    commentCount: 2
  },
  {
    id: "post-7",
    courseId: "course-frontend",
    authorId: "student-1",
    title: "How do you stop dashboards from feeling jumpy?",
    body: "When filters change, the whole page shifts around. Looking for practical layout ideas that keep the screen feeling stable.",
    likeCount: 6,
    viewCount: 17,
    commentCount: 2
  },
  {
    id: "post-8",
    courseId: "course-backend",
    authorId: "student-2",
    title: "What pagination details actually help users?",
    body: "I want list pages to feel clear instead of mechanical. Which pagination cues make it easier for people to understand where they are?",
    likeCount: 9,
    viewCount: 22,
    commentCount: 5
  }
] as const;

const generatedTopics = {
  "course-frontend": [
    {
      title: "How do you make filter changes feel stable?",
      body: "I am testing fixed panels, reserved loading space, and transitions. Which approach keeps the layout feeling calm?"
    },
    {
      title: "When do you split a component into smaller pieces?",
      body: "Some screens become hard to reason about after a few states. What signals tell you the component has grown too far?"
    },
    {
      title: "What is a good pattern for empty states?",
      body: "I want the screen to explain what to do next without looking like an error. What content has worked well for you?"
    },
    {
      title: "How should a bookmark action respond instantly?",
      body: "I want people to trust the save interaction. Should the label change immediately, or only after the request returns?"
    }
  ],
  "course-backend": [
    {
      title: "How do you structure service methods for clarity?",
      body: "I am trying to keep endpoints thin while still making the workflow easy to follow. What balance has worked for you?"
    },
    {
      title: "What makes repository code easy to review?",
      body: "Once a query grows past a few joins it becomes harder to reason about. How do you keep data access straightforward?"
    },
    {
      title: "How should APIs communicate pagination state?",
      body: "I want the response to be practical for UI developers. Which metadata fields do you consider essential?"
    },
    {
      title: "How do you prevent duplicate side effects?",
      body: "For a save or subscription flow, what is the cleanest way to make repeated calls safe and boring?"
    }
  ],
  "course-data": [
    {
      title: "When do you normalize versus denormalize?",
      body: "I am modeling a reporting feature and trying to balance write simplicity against read performance. How do you decide?"
    },
    {
      title: "What makes a migration easy to review?",
      body: "I want schema changes to feel predictable and reversible. What details do you expect in a well-prepared migration?"
    },
    {
      title: "How do you seed useful demo data?",
      body: "Tiny data sets hide real pagination and filtering issues. What rules do you use when preparing demo records?"
    },
    {
      title: "How do you name tables and columns clearly?",
      body: "I am looking for naming patterns that still make sense six months later when someone new joins the team."
    }
  ],
  "course-cloud": [
    {
      title: "How do you explain environments to new teammates?",
      body: "I want dev, test, and production differences to be obvious without requiring a long onboarding call. What has helped most?"
    },
    {
      title: "What belongs in local docker setup?",
      body: "I am deciding which dependencies should run locally for a demo and which can stay mocked. How do you draw that line?"
    },
    {
      title: "How should health checks be used in demos?",
      body: "I want something simple that still proves the stack is wired correctly. What do you usually expose?"
    },
    {
      title: "What makes runtime configuration easy to audit?",
      body: "I need environment variables to stay understandable across projects. What conventions reduce confusion?"
    }
  ],
  "course-design": [
    {
      title: "How do you keep UI sections visually balanced?",
      body: "I am working on a two-panel layout and one side keeps feeling cramped. What principles help you balance panels?"
    },
    {
      title: "What makes a settings page easy to scan?",
      body: "Long vertical forms quickly become tiring. Which grouping patterns help people find what they need faster?"
    },
    {
      title: "How do you choose accent colors for status pills?",
      body: "I want states like saved, warning, and inactive to stand out without feeling noisy. What is your approach?"
    },
    {
      title: "How do you keep demo interfaces from feeling generic?",
      body: "I want the layout to be simple but still intentional. What details create that impression quickly?"
    }
  ],
  "course-security": [
    {
      title: "Where should authorization checks live?",
      body: "I am stubbing auth today but want clean seams for real enforcement later. Where do you usually place the rules?"
    },
    {
      title: "How do you model soft delete rules safely?",
      body: "I want records to stay recoverable without confusing later reads. What patterns keep that behavior explicit?"
    },
    {
      title: "What makes audit-friendly API behavior?",
      body: "I need state-changing actions to be easy to explain during a review. Which fields or records matter most?"
    },
    {
      title: "How do you keep moderator actions obvious?",
      body: "I want privileged actions to be visible but not casually triggered. What UX patterns have worked well for you?"
    }
  ]
} as const;

const generatedPosts = (() => {
  const generated: Array<{
    id: string;
    courseId: string;
    authorId: string;
    title: string;
    body: string;
    likeCount: number;
    viewCount: number;
    commentCount: number;
    createdAt: Date;
  }> = [];

  let nextPostNumber = seededPosts.length + 1;
  let nextMinuteOffset = seededPosts.length + 1;

  for (const student of studentCatalog) {
    for (const courseId of student.enrolledCourseIds) {
      const existingCount = seededPosts.filter(
        (post) => post.authorId === student.id && post.courseId === courseId
      ).length;
      const templates = generatedTopics[courseId];

      for (let index = existingCount; index < 4; index += 1) {
        const template = templates[index % templates.length];
        generated.push({
          id: `post-${nextPostNumber}`,
          courseId,
          authorId: student.id,
          title: `${template.title} (${student.name})`,
          body: template.body,
          likeCount: 2 + ((nextPostNumber * 3) % 12),
          viewCount: 15 + ((nextPostNumber * 5) % 40),
          commentCount: nextPostNumber % 6,
          createdAt: minutesAgo(nextMinuteOffset)
        });
        nextPostNumber += 1;
        nextMinuteOffset += 1;
      }
    }
  }

  return generated;
})();

const allPosts = [
  ...seededPosts.map((post, index) => ({
    ...post,
    createdAt: minutesAgo(20 - index)
  })),
  ...generatedPosts
];

const seed = async () => {
  await db.delete(savedPosts);
  await db.delete(posts);
  await db.delete(enrollments);
  await db.delete(courses);
  await db.delete(users);

  await db.insert(users).values([
    ...studentCatalog.map((student) => ({
      id: student.id,
      name: student.name,
      role: "student" as const
    })),
    { id: "moderator-1", name: "Jordan", role: "moderator" as const }
  ]);

  await db.insert(courses).values([...courseCatalog]);

  await db.insert(enrollments).values(
    studentCatalog.flatMap((student) =>
      student.enrolledCourseIds.map((courseId) => ({
        userId: student.id,
        courseId
      }))
    )
  );

  await db.insert(posts).values(allPosts);

  await db.insert(savedPosts).values([
    {
      id: "save-1",
      userId: "student-1",
      postId: "post-1",
      createdAt: minutesAgo(12),
      updatedAt: minutesAgo(12),
      deletedAt: null
    },
    {
      id: "save-2",
      userId: "student-1",
      postId: "post-4",
      createdAt: minutesAgo(4),
      updatedAt: minutesAgo(4),
      deletedAt: null
    },
    {
      id: "save-3",
      userId: "student-2",
      postId: "post-3",
      createdAt: minutesAgo(9),
      updatedAt: minutesAgo(9),
      deletedAt: null
    },
    {
      id: "save-4",
      userId: "student-2",
      postId: "post-6",
      createdAt: minutesAgo(2),
      updatedAt: minutesAgo(2),
      deletedAt: null
    },
    {
      id: "save-5",
      userId: "student-2",
      postId: "post-5",
      createdAt: minutesAgo(5),
      updatedAt: minutesAgo(1),
      deletedAt: minutesAgo(1)
    },
    {
      id: "save-6",
      userId: "moderator-1",
      postId: "post-2",
      createdAt: minutesAgo(11),
      updatedAt: minutesAgo(11),
      deletedAt: null
    },
    {
      id: "save-7",
      userId: "moderator-1",
      postId: "post-5",
      createdAt: minutesAgo(7),
      updatedAt: minutesAgo(7),
      deletedAt: null
    },
    {
      id: "save-8",
      userId: "student-1",
      postId: "post-7",
      createdAt: minutesAgo(1),
      updatedAt: minutesAgo(1),
      deletedAt: null
    },
    {
      id: "save-9",
      userId: "student-2",
      postId: "post-8",
      createdAt: minutesAgo(0),
      updatedAt: minutesAgo(0),
      deletedAt: null
    },
    {
      id: "save-10",
      userId: "student-3",
      postId: "post-13",
      createdAt: minutesAgo(25),
      updatedAt: minutesAgo(25),
      deletedAt: null
    },
    {
      id: "save-11",
      userId: "student-4",
      postId: "post-21",
      createdAt: minutesAgo(28),
      updatedAt: minutesAgo(28),
      deletedAt: null
    },
    {
      id: "save-12",
      userId: "student-5",
      postId: "post-35",
      createdAt: minutesAgo(30),
      updatedAt: minutesAgo(30),
      deletedAt: null
    }
  ]);
};

seed()
  .then(() => {
    console.log("Seed complete");
  })
  .finally(async () => {
    process.exit(0);
  });
