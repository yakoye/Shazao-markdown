import { createBrowserRouter } from "react-router";
import {
  BlogPage,
  DownloadPage,
  HomePage,
  NotFoundPage,
  RootLayout,
  StoryPage,
} from "./pages";
import { GuidePage } from "./guide";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      Component: RootLayout,
      children: [
        { index: true, Component: HomePage },
        { path: "download", Component: DownloadPage },
        { path: "guide", Component: GuidePage },
        { path: "blog", Component: BlogPage },
        { path: "blog/shazao-story", Component: StoryPage },
        { path: "*", Component: NotFoundPage },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL },
);
