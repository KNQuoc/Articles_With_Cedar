import { z } from 'zod';

// Define schemas for product roadmap actions
const FeatureNodeDataSchema = z.object({
  title: z.string(),
  description: z.string(),
  status: z.enum(['done', 'planned', 'backlog', 'in progress']).default('planned'),
  nodeType: z.literal('feature').default('feature'),
  upvotes: z.number().default(0),
  comments: z
    .array(
      z.object({
        id: z.string(),
        author: z.string(),
        text: z.string(),
      }),
    )
    .default([]),
});

const NodeSchema = z.object({
  id: z.string().optional(),
  position: z
    .object({
      x: z.number(),
      y: z.number(),
    })
    .optional(),
  data: FeatureNodeDataSchema,
});

// Define schemas for book actions
const BookSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  author: z.string().optional(),
  imageUrl: z.string(),
  bookLink: z.string(),
  tldr: z.string(),
  genre: z.string().optional(),
  rating: z.number().optional(),
});

// Action schemas for roadmap
const AddNodeActionSchema = z.object({
  type: z.literal('action'),
  stateKey: z.literal('nodes'),
  setterKey: z.literal('addNode'),
  args: z.array(NodeSchema),
});

const RemoveNodeActionSchema = z.object({
  type: z.literal('action'),
  stateKey: z.literal('nodes'),
  setterKey: z.literal('removeNode'),
  args: z.array(z.string()), // Just the node ID
});

const ChangeNodeActionSchema = z.object({
  type: z.literal('action'),
  stateKey: z.literal('nodes'),
  setterKey: z.literal('changeNode'),
  args: z.array(NodeSchema),
});

// Action schemas for books
const AddBookActionSchema = z.object({
  type: z.literal('action'),
  stateKey: z.literal('books'),
  setterKey: z.literal('addBook'),
  args: z.array(BookSchema),
});

const RemoveBookActionSchema = z.object({
  type: z.literal('action'),
  stateKey: z.literal('books'),
  setterKey: z.literal('removeBook'),
  args: z.array(z.string()), // Just the book ID
});

const UpdateBookActionSchema = z.object({
  type: z.literal('action'),
  stateKey: z.literal('books'),
  setterKey: z.literal('updateBook'),
  args: z.array(BookSchema),
});

// Union of all action responses
export const ActionResponseSchema = z.union([
  AddNodeActionSchema,
  RemoveNodeActionSchema,
  ChangeNodeActionSchema,
  AddBookActionSchema,
  RemoveBookActionSchema,
  UpdateBookActionSchema,
]);

// Final agent response shape – either a plain chat message (content only)
// or a chat message accompanied by an action.
export const ExecuteFunctionResponseSchema = z.object({
  content: z.string(),
  action: ActionResponseSchema.optional(),
});
