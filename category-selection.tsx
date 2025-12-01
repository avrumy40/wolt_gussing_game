import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  Utensils, 
  Pizza, 
  Soup, 
  Salad,
  Drumstick,
  Cake,
  IceCream,
  Sandwich,
  Flame,
  Leaf,
  Baby,
  Linkedin,
  Instagram,
  Facebook,
  type LucideIcon
} from "lucide-react";
import { type Category } from "@shared/schema";

interface CategorySelectionProps {
  categories: Category[];
  onSelectCategory: (category: string | null) => void;
  isLoading?: boolean;
}

const categoryIcons: Record<string, LucideIcon> = {
  burger: Drumstick,
  hamburger: Drumstick,
  pizza: Pizza,
  sushi: Utensils,
  japanese: Utensils,
  asian: Soup,
  italian: Pizza,
  mexican: Flame,
  dessert: Cake,
  "ice cream": IceCream,
  chinese: Soup,
  thai: Soup,
  indian: Soup,
  mediterranean: Salad,
  "street food": Sandwich,
  sandwich: Sandwich,
  chicken: Drumstick,
  grill: Flame,
  bbq: Flame,
  shawarma: Sandwich,
  falafel: Salad,
  pita: Sandwich,
  salad: Salad,
  noodles: Soup,
  soup: Soup,
  "middle eastern": Salad,
  vegetarian: Leaf,
  kids: Baby,
  kosher: Utensils,
};

function getCategoryIcon(categoryName: string): LucideIcon {
  const lowerName = categoryName.toLowerCase();
  return categoryIcons[lowerName] || Utensils;
}

export default function CategorySelection({
  categories,
  onSelectCategory,
  isLoading,
}: CategorySelectionProps) {
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-primary border-r-transparent mb-4"></div>
          <p className="text-muted-foreground">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 overflow-auto">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header with 3D effect */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col items-center justify-center gap-4 mb-4 md:flex-row">
            <motion.img
              src="/logo-game.svg"
              alt="Wolt Food Quiz logo"
              className="h-14 w-14 md:h-16 md:w-16 drop-shadow-xl"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="text-center md:text-left space-y-1">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Wolt Food Quiz
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground">
                Sleek Tel Aviv challenge
              </p>
              <div className="flex flex-col items-center md:items-start gap-2">
                <p className="text-xs md:text-sm text-muted-foreground">Created by Avrumy Schreiber</p>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <a
                    href="https://www.linkedin.com/in/avrumy-schreiber/"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-primary transition-colors"
                    aria-label="LinkedIn profile"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                  <a
                    href="https://www.instagram.com/avrumy.sch/"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-primary transition-colors"
                    aria-label="Instagram profile"
                  >
                    <Instagram className="h-4 w-4" />
                  </a>
                  <a
                    href="https://www.facebook.com/avrumy.schreiber"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-primary transition-colors"
                    aria-label="Facebook profile"
                  >
                    <Facebook className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
            Test your knowledge of Tel Aviv's best restaurants!
          </p>
        </motion.div>

        {/* All Categories Card with 3D hover */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.02, rotateX: 2 }}
          style={{ perspective: 1000 }}
        >
          <Card
            className="p-4 md:p-6 border-2 hover:border-primary cursor-pointer relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5 backdrop-blur-sm shadow-xl"
            onClick={() => onSelectCategory(null)}
            data-testid="card-category-all"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 opacity-0 hover:opacity-100 transition-opacity duration-300" />
            <div className="relative flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="h-8 w-8 md:h-10 md:w-10 text-primary flex-shrink-0" />
                </motion.div>
                <div className="min-w-0">
                  <h2 className="text-xl md:text-2xl font-bold truncate">All Categories</h2>
                  <p className="text-xs md:text-sm text-muted-foreground truncate">
                    Mix it up with all restaurants
                  </p>
                </div>
              </div>
              <Button size="lg" className="shadow-lg flex-shrink-0" data-testid="button-start-all">
                Start Game
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Category Grid with 3D cards */}
        <div className="mb-4 text-center">
          <h3 className="text-sm font-semibold text-muted-foreground">
            Or choose a category:
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
          {categories.map((category, index) => {
            const IconComponent = getCategoryIcon(category.name);
            return (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ 
                  scale: 1.05, 
                  rotateY: 5,
                  z: 50
                }}
                style={{ perspective: 1000 }}
              >
                <Card
                  className="p-4 md:p-6 border-2 hover:border-primary cursor-pointer relative overflow-hidden group bg-gradient-to-br from-background to-muted/30 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-shadow duration-300"
                  onClick={() => onSelectCategory(category.name)}
                  data-testid={`card-category-${category.name}`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-secondary/0 group-hover:from-primary/10 group-hover:to-secondary/10 transition-all duration-300" />
                  <div className="relative text-center space-y-2">
                    <motion.div 
                      className="flex justify-center"
                      whileHover={{ rotateY: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <IconComponent className="h-8 w-8 md:h-10 md:w-10 text-primary drop-shadow-lg" />
                    </motion.div>
                    <div>
                      <h3 className="text-sm md:text-base font-semibold capitalize truncate">
                        {category.name}
                      </h3>
                      <p className="text-xs text-muted-foreground truncate">
                        {category.count} places
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Footer */}
        <motion.div 
          className="text-center mt-6 text-xs md:text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p>10 questions per round • Good luck!</p>
        </motion.div>
      </div>
    </div>
  );
}
