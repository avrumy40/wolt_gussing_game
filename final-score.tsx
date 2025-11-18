import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, RotateCcw, Grid3x3, Check, X } from "lucide-react";
import { motion } from "framer-motion";
import { type GameState } from "@shared/schema";

interface FinalScoreProps {
  gameState: GameState;
  onPlayAgain: () => void;
  onChooseCategory: () => void;
}

function getScoreMessage(score: number, total: number): string {
  const percentage = (score / total) * 100;
  if (percentage === 100) return "Perfect! You're a Tel Aviv food expert!";
  if (percentage >= 80) return "Amazing! You know your Tel Aviv restaurants!";
  if (percentage >= 60) return "Great job! Almost perfect!";
  if (percentage >= 40) return "Not bad! Keep exploring!";
  return "Keep trying! You'll get better!";
}

export default function FinalScore({
  gameState,
  onPlayAgain,
  onChooseCategory,
}: FinalScoreProps) {
  const { score, totalQuestions, answers, selectedCategory } = gameState;
  const scoreMessage = getScoreMessage(score, totalQuestions);
  const percentage = Math.round((score / totalQuestions) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 overflow-auto">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header with 3D Trophy Animation */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 mb-4 shadow-2xl"
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatDelay: 1
            }}
          >
            <Trophy className="h-8 w-8 md:h-12 md:w-12 text-primary drop-shadow-lg" />
          </motion.div>
          
          <motion.h1 
            className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Quiz Complete!
          </motion.h1>
          
          <motion.div 
            className="mb-4"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          >
            <div className="text-5xl md:text-6xl font-bold text-primary mb-2 drop-shadow-lg" data-testid="text-final-score">
              {score}/{totalQuestions}
            </div>
            <div className="text-xl md:text-2xl text-muted-foreground">
              {percentage}% Correct
            </div>
          </motion.div>
          
          <motion.p 
            className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {scoreMessage}
          </motion.p>
          
          {selectedCategory && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Badge variant="outline" className="mt-4 text-sm md:text-base px-4 py-1 capitalize shadow-md">
                Category: {selectedCategory}
              </Badge>
            </motion.div>
          )}
        </motion.div>

        {/* Action Buttons with 3D hover effects */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-8 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <motion.div
            whileHover={{ scale: 1.05, rotateX: 5 }}
            whileTap={{ scale: 0.95 }}
            style={{ perspective: 1000 }}
          >
            <Button
              size="lg"
              onClick={onPlayAgain}
              className="w-full sm:w-auto text-base md:text-lg px-6 md:px-8 shadow-xl"
              data-testid="button-play-again"
            >
              <RotateCcw className="mr-2 h-5 w-5" />
              Play Again
            </Button>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05, rotateX: 5 }}
            whileTap={{ scale: 0.95 }}
            style={{ perspective: 1000 }}
          >
            <Button
              size="lg"
              variant="outline"
              onClick={onChooseCategory}
              className="w-full sm:w-auto text-base md:text-lg px-6 md:px-8 shadow-lg"
              data-testid="button-choose-category"
            >
              <Grid3x3 className="mr-2 h-5 w-5" />
              Choose Different Category
            </Button>
          </motion.div>
        </motion.div>

        {/* Answers Breakdown with staggered animations */}
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <h2 className="text-xl md:text-2xl font-bold text-center mb-4">Your Answers</h2>
          <div className="grid gap-3">
            {answers.map((answer, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.05 }}
                whileHover={{ scale: 1.02, x: 5 }}
              >
                <Card
                  className={`p-3 md:p-4 border-2 relative overflow-hidden ${
                    answer.isCorrect
                      ? "border-green-500/30 bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/20 dark:to-green-900/10"
                      : "border-red-500/30 bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-950/20 dark:to-red-900/10"
                  }`}
                  data-testid={`card-answer-${index}`}
                >
                  <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
                    {answer.isCorrect ? (
                      <Check className="w-full h-full text-green-500" />
                    ) : (
                      <X className="w-full h-full text-red-500" />
                    )}
                  </div>
                  
                  <div className="relative flex items-center gap-3 md:gap-4">
                    {/* Question Number with 3D effect */}
                    <motion.div 
                      className="flex-shrink-0"
                      whileHover={{ rotateY: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <div
                        className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-white shadow-lg ${
                          answer.isCorrect ? "bg-green-500" : "bg-red-500"
                        }`}
                      >
                        {index + 1}
                      </div>
                    </motion.div>

                    {/* Dish Image Thumbnail */}
                    <div className="flex-shrink-0 hidden sm:block">
                      <img
                        src={answer.dishImage}
                        alt={answer.dishName}
                        className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-md shadow-md"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                        }}
                      />
                    </div>

                    {/* Answer Details */}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm md:text-base truncate mb-1">
                        {answer.dishName || "Unknown Dish"}
                      </div>
                      {answer.isCorrect ? (
                        <div className="text-xs md:text-sm text-green-700 dark:text-green-400 flex items-center gap-1">
                          <Check className="h-3 w-3 md:h-4 md:w-4" />
                          <span className="truncate">Correct: {answer.correctAnswer}</span>
                        </div>
                      ) : (
                        <div className="text-xs md:text-sm space-y-0.5">
                          <div className="text-red-700 dark:text-red-400 flex items-center gap-1">
                            <X className="h-3 w-3 md:h-4 md:w-4" />
                            <span className="truncate">Your answer: {answer.selectedAnswer}</span>
                          </div>
                          <div className="text-green-700 dark:text-green-400 flex items-center gap-1">
                            <Check className="h-3 w-3 md:h-4 md:w-4" />
                            <span className="truncate">Correct: {answer.correctAnswer}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Status Badge */}
                    <div className="flex-shrink-0">
                      <Badge
                        variant={answer.isCorrect ? "default" : "destructive"}
                        className={`text-xs shadow-md ${
                          answer.isCorrect
                            ? "bg-green-500 hover:bg-green-600"
                            : ""
                        }`}
                      >
                        {answer.isCorrect ? "✓" : "✗"}
                      </Badge>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
