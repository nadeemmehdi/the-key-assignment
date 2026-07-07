export type Locale = "en" | "es";

type Messages = {
  appMetaTitle: string;
  appMetaDescription: string;
  appTitle: string;
  appDescription: string;
  filtersTitle: string;
  feedTitle: string;
  feedDescription: string;
  savedTitle: string;
  savedDescription: string;
  pageLabel: (page: number, totalPages: number) => string;
  currentPageCountLabel: (count: number) => string;
  totalCountLabel: (count: number) => string;
  previousLabel: string;
  nextLabel: string;
  emptySaved: string;
  loadFailed: string;
  apiStatus: string;
  authLabel: string;
  demoUserLabel: string;
  courseLabel: string;
  allCoursesLabel: string;
  forumViewsLabel: string;
  localeLabel: string;
  localeEnglish: string;
  localeSpanish: string;
  save: string;
  unsave: string;
  remove: string;
  removing: string;
  saved: string;
  notSaved: string;
  courseFrontend: string;
  courseBackend: string;
  courseData: string;
  courseCloud: string;
  courseDesign: string;
  courseSecurity: string;
  likesLabel: (count: number) => string;
  viewsLabel: (count: number) => string;
  commentsLabel: (count: number) => string;
  itemsLabel: string;
  saves: (count: number) => string;
};

export const messages: Record<Locale, Messages> = {
  en: {
    appMetaTitle: "Saved Posts Demo",
    appMetaDescription: "Forum feed and saved posts demo",
    appTitle: "Community forum",
    appDescription:
      "A small end-to-end slice showing feed, saved posts, stub auth, and clean client/server boundaries.",
    filtersTitle: "Demo controls",
    feedTitle: "Course feed",
    feedDescription: "Visible posts for the selected user and course.",
    savedTitle: "Saved posts",
    savedDescription: "Bookmarks for the selected user, newest saved first.",
    pageLabel: (page, totalPages) => `Page ${page} of ${totalPages || 1}`,
    currentPageCountLabel: (count) => `${count} post${count === 1 ? "" : "s"} on this page`,
    totalCountLabel: (count) => `${count} total post${count === 1 ? "" : "s"}`,
    previousLabel: "Previous",
    nextLabel: "Next",
    emptySaved: "No saved posts yet. Bookmark a post from the feed to populate this list.",
    loadFailed: "Something went wrong while loading data.",
    apiStatus: "API status",
    authLabel: "Signed in as",
    demoUserLabel: "Demo user",
    courseLabel: "Course",
    allCoursesLabel: "All courses",
    forumViewsLabel: "Forum views",
    localeLabel: "Locale",
    localeEnglish: "English",
    localeSpanish: "Spanish",
    save: "Save",
    unsave: "Unsave",
    remove: "Remove",
    removing: "Removing...",
    saved: "Saved",
    notSaved: "Not saved",
    courseFrontend: "Frontend Systems",
    courseBackend: "Backend Systems",
    courseData: "Data Modeling",
    courseCloud: "Cloud Foundations",
    courseDesign: "Product Design",
    courseSecurity: "Security Essentials",
    likesLabel: (count) => `${count} likes`,
    viewsLabel: (count) => `${count} views`,
    commentsLabel: (count) => `${count} comments`,
    itemsLabel: "items",
    saves: (count) => `${count} ${count === 1 ? "save" : "saves"}`
  },
  es: {
    appMetaTitle: "Demo de publicaciones guardadas",
    appMetaDescription: "Demo del feed del foro y publicaciones guardadas",
    appTitle: "Foro de la comunidad",
    appDescription:
      "Una demo pequena con feed, publicaciones guardadas, autenticacion simulada y capas separadas.",
    filtersTitle: "Controles demo",
    feedTitle: "Feed del curso",
    feedDescription: "Publicaciones visibles para el usuario y curso seleccionados.",
    savedTitle: "Publicaciones guardadas",
    savedDescription: "Marcadores del usuario seleccionado, ordenados por guardado reciente.",
    pageLabel: (page, totalPages) => `Pagina ${page} de ${totalPages || 1}`,
    currentPageCountLabel: (count) => `${count} publicacion${count === 1 ? "" : "es"} en esta pagina`,
    totalCountLabel: (count) => `${count} publicacion${count === 1 ? "" : "es"} en total`,
    previousLabel: "Anterior",
    nextLabel: "Siguiente",
    emptySaved:
      "Todavia no hay publicaciones guardadas. Guarda una publicacion desde el feed para verla aqui.",
    loadFailed: "Ocurrio un error al cargar los datos.",
    apiStatus: "Estado del API",
    authLabel: "Sesion actual",
    demoUserLabel: "Usuario demo",
    courseLabel: "Curso",
    allCoursesLabel: "Todos los cursos",
    forumViewsLabel: "Vistas del foro",
    localeLabel: "Idioma",
    localeEnglish: "Ingles",
    localeSpanish: "Espanol",
    save: "Guardar",
    unsave: "Quitar",
    remove: "Eliminar",
    removing: "Eliminando...",
    saved: "Guardado",
    notSaved: "No guardado",
    courseFrontend: "Sistemas Frontend",
    courseBackend: "Sistemas Backend",
    courseData: "Modelado de Datos",
    courseCloud: "Fundamentos de Nube",
    courseDesign: "Diseno de Producto",
    courseSecurity: "Fundamentos de Seguridad",
    likesLabel: (count) => `${count} me gusta`,
    viewsLabel: (count) => `${count} vistas`,
    commentsLabel: (count) => `${count} comentarios`,
    itemsLabel: "items",
    saves: (count) => `${count} ${count === 1 ? "guardado" : "guardados"}`
  }
};
