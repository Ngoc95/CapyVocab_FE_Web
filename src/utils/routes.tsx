import { createBrowserRouter } from "react-router";
import { RootLayout } from "../components/RootLayout";
import { HomePage } from "../components/pages/HomePage";
import { BrowseCoursesPage } from "../components/pages/BrowseCoursesPage";
import { CourseDetailPage } from "../components/pages/CourseDetailPage";
import { LearnFlashcardsPage } from "../components/pages/LearnFlashcardsPage";
import { MyLearningPage } from "../components/pages/MyLearningPage";
import { ReviewPage } from "../components/pages/ReviewPage";
import { CreateContentPage } from "../components/pages/CreateContentPage";
import { MarketplacePage } from "../components/pages/MarketplacePage";
import { CartPage } from "../components/pages/CartPage";
import { ProfilePage } from "../components/pages/ProfilePage";
import { NotFoundPage } from "../components/pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: HomePage },
      { path: "browse", Component: BrowseCoursesPage },
      { path: "course/:id", Component: CourseDetailPage },
      { path: "learn/:id", Component: LearnFlashcardsPage },
      { path: "my-learning", Component: MyLearningPage },
      { path: "review", Component: ReviewPage },
      { path: "create", Component: CreateContentPage },
      { path: "marketplace", Component: MarketplacePage },
      { path: "cart", Component: CartPage },
      { path: "profile", Component: ProfilePage },
      { path: "*", Component: NotFoundPage },
    ],
  },
]);
