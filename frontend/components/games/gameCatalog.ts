import {
  ArrowDownUp,
  Code2,
  GitFork,
  Layers,
  Link2,
  ListOrdered,
  Search,
  type LucideIcon,
} from "lucide-react";

export type GameCategory = "Algorithms" | "Data structures";

export interface MiniGame {
  slug: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  category: GameCategory;
  Icon: LucideIcon;
  accent: string;
  iconColor: string;
}

export const miniGames: MiniGame[] = [
  {
    slug: "logic-builder",
    number: "01",
    title: "Logic Builder",
    subtitle: "Sequencing & algorithms",
    description: "Arrange clear steps and build the logic behind a working algorithm.",
    category: "Algorithms",
    Icon: Code2,
    accent: "cyan",
    iconColor: "text-cyan-200",
  },
  {
    slug: "number-sorting-challenge",
    number: "02",
    title: "Number Sorting Challenge",
    subtitle: "Sorting arrays visually",
    description: "See how values move as an array is organized into the right order.",
    category: "Algorithms",
    Icon: ArrowDownUp,
    accent: "violet",
    iconColor: "text-violet-200",
  },
  {
    slug: "stack-tower",
    number: "03",
    title: "Stack Tower",
    subtitle: "LIFO · push and pop",
    description: "Build a tower one block at a time and explore last-in, first-out.",
    category: "Data structures",
    Icon: Layers,
    accent: "amber",
    iconColor: "text-amber-200",
  },
  {
    slug: "queue-ticket-counter",
    number: "04",
    title: "Queue Ticket Counter",
    subtitle: "FIFO · line management",
    description: "Help tickets move through a line in first-in, first-out order.",
    category: "Data structures",
    Icon: ListOrdered,
    accent: "emerald",
    iconColor: "text-emerald-200",
  },
  {
    slug: "linked-list-node-connection",
    number: "05",
    title: "Linked List Node Connection",
    subtitle: "Pointers and nodes",
    description: "Follow the links between nodes and explore how a list connects.",
    category: "Data structures",
    Icon: Link2,
    accent: "pink",
    iconColor: "text-pink-200",
  },
  {
    slug: "tree-traversal-challenge",
    number: "06",
    title: "Tree Traversal Challenge",
    subtitle: "Inorder · preorder · postorder",
    description: "Explore a tree and compare three ways to visit its nodes.",
    category: "Data structures",
    Icon: GitFork,
    accent: "lime",
    iconColor: "text-lime-200",
  },
  {
    slug: "treasure-search",
    number: "07",
    title: "Treasure Search",
    subtitle: "Linear & binary search",
    description: "Hunt for treasure while comparing two ways to search a collection.",
    category: "Algorithms",
    Icon: Search,
    accent: "sky",
    iconColor: "text-sky-200",
  },
];

export function findMiniGameByTitle(title?: string) {
  if (!title) return undefined;
  const normalizedTitle = title.trim().toLocaleLowerCase();
  return miniGames.find((game) => game.title.toLocaleLowerCase() === normalizedTitle);
}
