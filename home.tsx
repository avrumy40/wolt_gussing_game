import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import CategorySelection from "./category-selection";
import Quiz from "./quiz";
import FinalScore from "./final-score";
import { type Category, type GameState, type QuizQuestion } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type GameScreen = "category" | "quiz" | "results";

export default function Home() {
  const [screen, setScreen] = useState<GameScreen>("category");
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const { toast } = useToast();

  // Fetch categories
  const { data: categories, isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
    enabled: screen === "category",
  });

  // Start new game
  const [isLoadingGame, setIsLoadingGame] = useState(false);

  const handleSelectCategory = async (category: string | null) => {
    try {
      setIsLoadingGame(true);
      const response = await apiRequest("POST", "/api/game/start", {
        category,
      });
      const gameState = await response.json() as GameState;
      setGameState(gameState);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setIsLoadingGame(false);
      setScreen("quiz");
    } catch (error) {
      console.error("Failed to start game:", error);
      setIsLoadingGame(false);
      toast({
        title: "Error",
        description: "Failed to start game. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle answer selection
  const handleAnswerSelect = (answer: string) => {
    if (!gameState || selectedAnswer) return;

    setSelectedAnswer(answer);
    const currentQuestion = gameState.questions[gameState.currentQuestion];
    const correct = answer === currentQuestion.correctRestaurant;
    setIsCorrect(correct);

    // Update game state
    const updatedGameState: GameState = {
      ...gameState,
      score: correct ? gameState.score + 1 : gameState.score,
      answers: [
        ...gameState.answers,
        {
          questionIndex: gameState.currentQuestion,
          selectedAnswer: answer,
          correctAnswer: currentQuestion.correctRestaurant,
          isCorrect: correct,
          dishImage: currentQuestion.dishImage,
          dishName: currentQuestion.dishName,
        },
      ],
    };
    setGameState(updatedGameState);
  };

  // Handle next question
  const handleNextQuestion = () => {
    if (!gameState) return;

    if (gameState.currentQuestion < gameState.totalQuestions - 1) {
      setGameState({
        ...gameState,
        currentQuestion: gameState.currentQuestion + 1,
      });
      setSelectedAnswer(null);
      setIsCorrect(null);
    } else {
      setScreen("results");
    }
  };

  // Play again with same category
  const handlePlayAgain = () => {
    if (gameState) {
      handleSelectCategory(gameState.selectedCategory);
    }
  };

  // Choose different category
  const handleChooseCategory = () => {
    setScreen("category");
    setGameState(null);
    setSelectedAnswer(null);
    setIsCorrect(null);
    queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
  };

  if (isLoadingGame) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-primary border-r-transparent mb-4"></div>
          <p className="text-muted-foreground">Preparing your quiz...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {screen === "category" && (
        <CategorySelection
          categories={categories || []}
          onSelectCategory={handleSelectCategory}
          isLoading={categoriesLoading}
        />
      )}

      {screen === "quiz" && gameState && (
        <Quiz
          questions={gameState.questions}
          currentQuestionIndex={gameState.currentQuestion}
          score={gameState.score}
          onAnswerSelect={handleAnswerSelect}
          onNextQuestion={handleNextQuestion}
          selectedAnswer={selectedAnswer}
          isCorrect={isCorrect}
        />
      )}

      {screen === "results" && gameState && (
        <FinalScore
          gameState={gameState}
          onPlayAgain={handlePlayAgain}
          onChooseCategory={handleChooseCategory}
        />
      )}
    </>
  );
}
