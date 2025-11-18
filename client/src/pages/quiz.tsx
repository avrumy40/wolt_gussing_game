import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Check, X, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { type QuizQuestion } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

interface QuizProps {
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  score: number;
  onAnswerSelect: (answer: string) => void;
  onNextQuestion: () => void;
  selectedAnswer: string | null;
  isCorrect: boolean | null;
}

export default function Quiz({
  questions,
  currentQuestionIndex,
  score,
  onAnswerSelect,
  onNextQuestion,
  selectedAnswer,
  isCorrect,
}: QuizProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  // Reset image loaded state when question changes
  useEffect(() => {
    setImageLoaded(false);
  }, [currentQuestionIndex]);

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-wolt-gradient flex items-center justify-center">
        <p className="text-muted-foreground">Loading question...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden bg-wolt-gradient flex flex-col">
      {/* Fixed Header */}
      <div className="flex-shrink-0 px-4 pt-4 pb-2">
        <div className="max-w-5xl mx-auto glass-panel shadow-soft px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <motion.div
              key={`question-${currentQuestionIndex}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <span className="text-sm md:text-base font-semibold text-muted-foreground" data-testid="text-question-counter">
                Question {currentQuestionIndex + 1}/{questions.length}
              </span>
            </motion.div>
            <Badge variant="secondary" className="text-sm md:text-base px-3 py-1 shadow-md" data-testid="badge-score">
              Score: {score}/{questions.length}
            </Badge>
          </div>
          <Progress value={progress} className="h-1.5 md:h-2" data-testid="progress-quiz" />
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-32 md:pb-36">
        <div className="max-w-5xl mx-auto glass-panel shadow-soft p-4 md:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {/* Dish Image - Compact for viewport fit */}
              <motion.div
                whileHover={{ scale: 1.02, rotateX: 2 }}
                style={{ perspective: 1000 }}
              >
                <Card className="overflow-hidden bg-white/85 dark:bg-slate-900/70 shadow-soft border border-[var(--glass-stroke)]">
                  <div className="relative aspect-[16/9] md:aspect-[21/9] bg-muted rounded-xl">
                    {!imageLoaded && (
                      <Skeleton className="absolute inset-0" />
                    )}
                    <img
                      src={currentQuestion.dishImage}
                      alt="Dish to identify"
                      className={`w-full h-full object-cover transition-opacity duration-300 ${
                        imageLoaded ? "opacity-100" : "opacity-0"
                      }`}
                      onLoad={() => setImageLoaded(true)}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23f0f0f0' width='400' height='300'/%3E%3Ctext fill='%23999' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle' font-family='sans-serif' font-size='18'%3EImage not available%3C/text%3E%3C/svg%3E";
                        setImageLoaded(true);
                      }}
                      data-testid="img-dish"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                  </div>
                </Card>
              </motion.div>

              {/* Question */}
              <div className="text-center py-2 space-y-2">
                <h2 className="text-lg md:text-xl font-semibold leading-snug">
                  Which restaurant serves this dish?
                </h2>
                {currentQuestion.category && (
                  <Badge
                    variant="outline"
                    className="text-xs md:text-sm capitalize shadow-sm pill-muted text-center leading-tight break-words"
                    data-testid="badge-category"
                  >
                    {currentQuestion.category}
                  </Badge>
                )}
              </div>

              {/* Answer Options Grid - Compact 2x2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-20">
                {currentQuestion.options.map((option, index) => {
                  const isSelected = selectedAnswer === option;
                  const isCorrectOption = option === currentQuestion.correctRestaurant;
                  const showCorrect = selectedAnswer && isCorrectOption;
                  const showWrong = isSelected && !isCorrect;

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={!selectedAnswer ? { 
                        scale: 1.03, 
                        rotateX: 3,
                        z: 20
                      } : {}}
                      whileTap={!selectedAnswer ? { scale: 0.97 } : {}}
                      style={{ perspective: 1000 }}
                    >
                      <Card
                        className={`p-4 md:p-5 border transition-all duration-300 cursor-pointer relative overflow-hidden ${
                          selectedAnswer
                            ? "cursor-not-allowed"
                            : "hover:border-primary hover:shadow-xl"
                        } ${
                          showCorrect
                            ? "border-green-500 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/20 shadow-green-500/50 shadow-lg"
                            : showWrong
                            ? "border-red-500 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/20 shadow-red-500/50 shadow-lg"
                            : isSelected
                            ? "border-primary/70 bg-white/90 dark:bg-slate-900/70"
                            : "bg-white/80 dark:bg-slate-900/70 border-[var(--glass-stroke)]"
                        }`}
                        onClick={() => !selectedAnswer && onAnswerSelect(option)}
                        data-testid={`card-option-${index}`}
                      >
                        {!selectedAnswer && (
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-secondary/0 group-hover:from-primary/5 group-hover:to-secondary/5 transition-all duration-300" />
                        )}
                        
                        <div className="relative flex items-center justify-between gap-3">
                          <span
                            className="text-sm md:text-base font-medium flex-1 text-center break-words leading-tight"
                            data-testid={`text-option-${index}`}
                          >
                            {option}
                          </span>
                          <AnimatePresence>
                            {showCorrect && (
                              <motion.div 
                                className="flex-shrink-0" 
                                data-testid={`icon-correct-${index}`}
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", stiffness: 200 }}
                              >
                                <div className="bg-green-500 rounded-full p-1 shadow-lg">
                                  <Check className="h-4 w-4 md:h-5 md:w-5 text-white" />
                                </div>
                              </motion.div>
                            )}
                            {showWrong && (
                              <motion.div 
                                className="flex-shrink-0" 
                                data-testid={`icon-wrong-${index}`}
                                initial={{ scale: 0, rotate: 180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", stiffness: 200 }}
                              >
                                <div className="bg-red-500 rounded-full p-1 shadow-lg">
                                  <X className="h-4 w-4 md:h-5 md:w-5 text-white" />
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Fixed Bottom Next Button */}
      <AnimatePresence>
        {selectedAnswer && (
          <motion.div
            className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--glass-stroke)] bg-white/90 dark:bg-slate-900/85 backdrop-blur-2xl shadow-2xl"
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 120, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
          >
            <div className="max-w-5xl mx-auto px-4 py-4">
              <Button
                size="lg"
                className="w-full text-base md:text-lg shadow-xl hover:shadow-2xl"
                onClick={onNextQuestion}
                data-testid="button-next"
              >
                {currentQuestionIndex < questions.length - 1 ? (
                  <>
                    Next Question
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </>
                ) : (
                  "See Results"
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
