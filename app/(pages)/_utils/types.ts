export interface Author {
  id: string;
  name: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  author: Author | null;
}

export interface RecipeSummary {
  id: string;
  title: string;
  ingredients: string;
  createdAt: string;
  averageRating: number | null;
  reviewCount: number;
  author: Author | null;
}

export interface RecipeDetail extends RecipeSummary {
  instructions: string;
  reviews: Review[];
}
