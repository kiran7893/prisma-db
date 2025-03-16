import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // 1️⃣ CREATE Operations
  const newUser = await prisma.user.create({
    data: {
      name: "Kiran",
      email: "kiran@example.com",
      Profile: {
        create: {
          bio: "Full Stack Developer",
        },
      },
      Posts: {
        create: [
          { title: "First Post", content: "This is my first post!" },
          { title: "Second Post", content: "Learning Prisma is fun!" },
        ],
      },
    },
    include: { Profile: true, Posts: true },
  });
  console.log("Created User:", newUser);

  // 2️⃣ READ Operations
  const allUsers = await prisma.user.findMany({
    include: { Profile: true, Posts: true },
  });
  console.log("All Users:", allUsers);

  const singleUser = await prisma.user.findUnique({
    where: { email: "kiran@example.com" },
    include: { Posts: true },
  });
  console.log("Single User with Posts:", singleUser);

  // 3️⃣ UPDATE Operations
  const updatedUser = await prisma.user.update({
    where: { email: "kiran@example.com" },
    data: {
      name: "Kiran Kumar",
      Profile: {
        update: {
          bio: "Senior Full Stack Developer",
        },
      },
    },
    include: { Profile: true },
  });
  console.log("Updated User:", updatedUser);

  // 4️⃣ DELETE Operations
  const deletedPost = await prisma.post.delete({
    where: { id: 1 }, // Delete the first post
  });
  console.log("Deleted Post:", deletedPost);

  // 5️⃣ TRANSACTION (Multiple Operations in One)
  const transactionExample = await prisma.$transaction([
    prisma.user.create({
      data: { name: "Alice", email: "alice@example.com" },
    }),
    prisma.profile.create({
      data: { bio: "Alice's Profile", userId: 2 },
    }),
  ]);
  console.log("Transaction Result:", transactionExample);

  // 6️⃣ RELATIONAL QUERIES (With Nested Filters)
  const userWithPosts = await prisma.user.findMany({
    where: {
      Posts: {
        some: { title: { contains: "Prisma" } },
      },
    },
    include: { Posts: true },
  });
  console.log("User with Prisma Posts:", userWithPosts);

  // 7️⃣ AGGREGATIONS (Count, Sum, Avg, Min, Max)
  const postStats = await prisma.post.aggregate({
    _count: true,
    _avg: { id: true },
    _min: { id: true },
    _max: { id: true },
  });
  console.log("Post Statistics:", postStats);
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
