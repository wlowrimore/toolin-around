import type { StructureResolver } from "sanity/structure";

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.documentTypeListItem("author").title("Authors"),
      S.documentTypeListItem("category").title("Categories"),
      S.documentTypeListItem("listing").title("Listings"),
      S.documentTypeListItem("playlist").title("Playlists"),
      S.documentTypeListItem("rating").title("Ratings"),
      S.documentTypeListItem("ratingKey").title("Rating Keys"),
      S.documentTypeListItem("role").title("Roles"),
      S.documentTypeListItem("user").title("Users"),
    ]);
