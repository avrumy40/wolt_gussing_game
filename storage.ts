import { type Dish, type Venue, type Category, type QuizQuestion, type GameState } from "@shared/schema";
import * as fs from "fs";
import * as path from "path";

interface DishesData {
  [restaurantName: string]: Array<{ venue_id: string } | { [key: string]: Dish }>;
}

interface VenuesData {
  [restaurantName: string]: Venue;
}

interface RestaurantDishes {
  restaurantName: string;
  dishes: Dish[];
  category: string;
}

export interface IStorage {
  getCategories(): Promise<Category[]>;
  generateQuiz(category: string | null): Promise<GameState>;
}

export class MemStorage implements IStorage {
  private dishesData: DishesData = {};
  private venuesData: VenuesData = {};
  private initialized = false;

  constructor() {
    this.loadData();
  }

  private loadData() {
    try {
      // Load dishes data
      const dishesPath = path.join(process.cwd(), "attached_assets", "dishes_1763419547138.json");
      const dishesRaw = fs.readFileSync(dishesPath, "utf-8");
      this.dishesData = JSON.parse(dishesRaw);

      // Load venues data
      const venuesPath = path.join(process.cwd(), "attached_assets", "venues_information_1763412625528.json");
      const venuesRaw = fs.readFileSync(venuesPath, "utf-8");
      this.venuesData = JSON.parse(venuesRaw);

      this.initialized = true;
      console.log("✅ Successfully loaded game data");
      console.log(`   - Restaurants: ${Object.keys(this.venuesData).length}`);
      console.log(`   - Total dishes loaded from ${Object.keys(this.dishesData).length} restaurants`);
    } catch (error) {
      console.error("❌ Failed to load game data:", error);
      this.initialized = false;
    }
  }

  async getCategories(): Promise<Category[]> {
    if (!this.initialized) {
      throw new Error("Game data not loaded");
    }

    // Extract unique categories from venue tags
    const categoryMap = new Map<string, number>();

    Object.values(this.venuesData).forEach((venue) => {
      if (venue.venue_details?.tag) {
        venue.venue_details.tag.forEach((tag) => {
          const normalized = tag.toLowerCase().trim();
          categoryMap.set(normalized, (categoryMap.get(normalized) || 0) + 1);
        });
      }
    });

    // Convert to Category array and sort by count
    const categories: Category[] = Array.from(categoryMap.entries())
      .map(([name, count]) => ({ name, count }))
      .filter((cat) => cat.count >= 3) // Only include categories with at least 3 restaurants
      .sort((a, b) => b.count - a.count);

    return categories;
  }

  private extractDishesFromRestaurant(restaurantName: string): Dish[] {
    const dishesArray = this.dishesData[restaurantName];
    if (!dishesArray || dishesArray.length < 2) return [];

    const dishes: Dish[] = [];
    // Extract all dishes (skip first element which is venue_id)
    for (let i = 1; i < dishesArray.length; i++) {
      const item = dishesArray[i];
      if (typeof item === "object" && !("venue_id" in item)) {
        const dishKeys = Object.keys(item);
        dishKeys.forEach((key) => {
          const dish = item[key];
          if (dish && typeof dish === "object" && "dish_image" in dish && "dish_name" in dish) {
            const typedDish = dish as Dish;
            // Filter out non-food items and items without valid images
            if (
              typedDish.dish_image &&
              typedDish.dish_image.startsWith("http") &&
              typedDish.dish_name &&
              !typedDish.dish_name.toLowerCase().includes("cutlery") &&
              !typedDish.dish_name.toLowerCase().includes("utensil") &&
              !typedDish.dish_name.toLowerCase().includes("napkin")
            ) {
              dishes.push(typedDish);
            }
          }
        });
      }
    }
    return dishes;
  }

  private getRestaurantCategory(restaurantName: string): string {
    const venue = this.venuesData[restaurantName];
    return venue?.venue_details?.tag?.[0] || "";
  }

  private getRestaurantsInCategory(category: string | null): RestaurantDishes[] {
    let eligibleRestaurants = Object.keys(this.venuesData);

    if (category) {
      eligibleRestaurants = eligibleRestaurants.filter((restaurantName) => {
        const venue = this.venuesData[restaurantName];
        return venue.venue_details?.tag?.some(
          (tag) => tag.toLowerCase().trim() === category.toLowerCase().trim()
        );
      });
    }

    // Extract dishes for each restaurant
    const restaurantsWithDishes: RestaurantDishes[] = [];
    
    for (const restaurantName of eligibleRestaurants) {
      const dishes = this.extractDishesFromRestaurant(restaurantName);
      if (dishes.length > 0) {
        restaurantsWithDishes.push({
          restaurantName,
          dishes,
          category: this.getRestaurantCategory(restaurantName),
        });
      }
    }

    return restaurantsWithDishes;
  }

  async generateQuiz(category: string | null): Promise<GameState> {
    if (!this.initialized) {
      throw new Error("Game data not loaded");
    }

    const totalQuestions = 10;
    const questions: QuizQuestion[] = [];

    // Get all restaurants with their dishes
    const restaurantsWithDishes = this.getRestaurantsInCategory(category);

    if (restaurantsWithDishes.length < 4) {
      throw new Error("Not enough restaurants in this category");
    }

    // Shuffle restaurants to ensure variety
    const shuffledRestaurants = [...restaurantsWithDishes].sort(() => Math.random() - 0.5);

    // Track used restaurants to ensure variety across questions
    const usedRestaurantsCount = new Map<string, number>();
    const maxUsagePerRestaurant = Math.max(2, Math.ceil(totalQuestions / restaurantsWithDishes.length));

    // Generate questions
    for (let i = 0; i < totalQuestions; i++) {
      let attempts = 0;
      const maxAttempts = 100;
      let questionCreated = false;

      while (!questionCreated && attempts < maxAttempts) {
        attempts++;

        // Select a restaurant that hasn't been used too many times
        const availableRestaurants = shuffledRestaurants.filter(
          (r) => (usedRestaurantsCount.get(r.restaurantName) || 0) < maxUsagePerRestaurant
        );

        if (availableRestaurants.length === 0) {
          // Reset counts if we've exhausted all restaurants
          usedRestaurantsCount.clear();
          continue;
        }

        const selectedRestaurant = availableRestaurants[i % availableRestaurants.length];

        // Pick a random dish from this restaurant
        const randomDish = selectedRestaurant.dishes[
          Math.floor(Math.random() * selectedRestaurant.dishes.length)
        ];

        // Find 3 other restaurants in the same category for wrong options
        const sameCategory = category || selectedRestaurant.category;
        const potentialWrongOptions = shuffledRestaurants.filter(
          (r) =>
            r.restaurantName !== selectedRestaurant.restaurantName &&
            (category || r.category === sameCategory)
        );

        if (potentialWrongOptions.length < 3) {
          // If not enough in same category, use any other restaurants
          const fallbackOptions = shuffledRestaurants.filter(
            (r) => r.restaurantName !== selectedRestaurant.restaurantName
          );
          
          if (fallbackOptions.length < 3) continue;
          
          // Select 3 random wrong options
          const wrongOptions = fallbackOptions
            .sort(() => Math.random() - 0.5)
            .slice(0, 3)
            .map((r) => r.restaurantName);

          // Create options array with correct answer + 3 wrong answers
          const options = [...wrongOptions, selectedRestaurant.restaurantName];
          
          // Shuffle options
          options.sort(() => Math.random() - 0.5);

          questions.push({
            dishImage: randomDish.dish_image,
            dishName: randomDish.dish_name,
            correctRestaurant: selectedRestaurant.restaurantName,
            options,
            category: sameCategory,
          });

          usedRestaurantsCount.set(
            selectedRestaurant.restaurantName,
            (usedRestaurantsCount.get(selectedRestaurant.restaurantName) || 0) + 1
          );
          questionCreated = true;
        } else {
          // Select 3 random wrong options from same category
          const wrongOptions = potentialWrongOptions
            .sort(() => Math.random() - 0.5)
            .slice(0, 3)
            .map((r) => r.restaurantName);

          // Create options array with correct answer + 3 wrong answers
          const options = [...wrongOptions, selectedRestaurant.restaurantName];
          
          // Shuffle options
          options.sort(() => Math.random() - 0.5);

          // Verify all options are unique
          const uniqueOptions = new Set(options);
          if (uniqueOptions.size !== 4) continue;

          questions.push({
            dishImage: randomDish.dish_image,
            dishName: randomDish.dish_name,
            correctRestaurant: selectedRestaurant.restaurantName,
            options,
            category: sameCategory,
          });

          usedRestaurantsCount.set(
            selectedRestaurant.restaurantName,
            (usedRestaurantsCount.get(selectedRestaurant.restaurantName) || 0) + 1
          );
          questionCreated = true;
        }
      }

      if (!questionCreated) {
        throw new Error(`Could not generate question ${i + 1}`);
      }
    }

    if (questions.length < totalQuestions) {
      throw new Error("Could not generate enough valid questions");
    }

    return {
      currentQuestion: 0,
      score: 0,
      totalQuestions,
      selectedCategory: category,
      questions,
      answers: [],
    };
  }
}

export const storage = new MemStorage();
