import { z } from "zod";

// Game data types from JSON files
export const dishSchema = z.object({
  dish_name: z.string(),
  dish_price: z.string(),
  dish_description: z.string(),
  dish_image: z.string(),
});

export const venueSchema = z.object({
  venue_id: z.string(),
  rate: z.number(),
  estimate: z.number(),
  estimate_range: z.string(),
  delivery_price: z.string(),
  location: z.array(z.number()),
  img_url: z.string(),
  restaurant_link: z.string(),
  slug: z.string(),
  venue_details: z.object({
    address: z.string(),
    tag: z.array(z.string()),
    short_description: z.string(),
  }),
});

// Game types
export const categorySchema = z.object({
  name: z.string(),
  count: z.number(),
  icon: z.string().optional(),
});

export const quizQuestionSchema = z.object({
  dishImage: z.string(),
  dishName: z.string(),
  correctRestaurant: z.string(),
  options: z.array(z.string()), // 4 restaurant names
  category: z.string(),
});

export const gameStateSchema = z.object({
  currentQuestion: z.number(),
  score: z.number(),
  totalQuestions: z.number().default(10),
  selectedCategory: z.string().nullable(),
  questions: z.array(quizQuestionSchema),
  answers: z.array(z.object({
    questionIndex: z.number(),
    selectedAnswer: z.string(),
    correctAnswer: z.string(),
    isCorrect: z.boolean(),
    dishImage: z.string(),
    dishName: z.string(),
  })),
});

export const startGameRequestSchema = z.object({
  category: z.string().nullable(),
});

export const submitAnswerRequestSchema = z.object({
  questionIndex: z.number(),
  selectedAnswer: z.string(),
});

export type Dish = z.infer<typeof dishSchema>;
export type Venue = z.infer<typeof venueSchema>;
export type Category = z.infer<typeof categorySchema>;
export type QuizQuestion = z.infer<typeof quizQuestionSchema>;
export type GameState = z.infer<typeof gameStateSchema>;
export type StartGameRequest = z.infer<typeof startGameRequestSchema>;
export type SubmitAnswerRequest = z.infer<typeof submitAnswerRequestSchema>;
