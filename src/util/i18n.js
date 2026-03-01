let CURRENT_LANG = "en";

export function setLanguage(lang) {
  if (lang === "en" || lang === "fr" || lang === "sp") {
    CURRENT_LANG = lang;
  } else {
    CURRENT_LANG = "en";
  }
}

const translations = {
  en: {
    messages: "Messages",
    matches: "Matches",
    events: "Events",
    settings: "Settings",
    logout: "Log out",
    profile: "Profile",
    language: "Language",
    notifications: "Notifications",
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email",
    bio: "Bio",
    comingSoon: "Coming soon...",
    loading: "Loading...",
    noMatches: "No matches yet.",
    message: "Message",
    viewProfile: "View profile",
    notificationsTitle: "Notifications",
    emailNotifications: "Email notifications",
    pushNotifications: "Push notifications",
    matchAlerts: "Match alerts",
    save: "Save"
  },

  fr: {
    messages: "Messages",
    matches: "Correspondances",
    events: "Événements",
    settings: "Paramètres",
    logout: "Se déconnecter",
    profile: "Profil",
    language: "Langue",
    notifications: "Notifications",
    firstName: "Prénom",
    lastName: "Nom",
    email: "Courriel",
    bio: "Bio",
    comingSoon: "Bientôt disponible...",
    loading: "Chargement...",
    noMatches: "Aucune correspondance pour le moment.",
    message: "Message",
    viewProfile: "Voir le profil",
    notificationsTitle: "Notifications",
    emailNotifications: "Notifications par courriel",
    pushNotifications: "Notifications push",
    matchAlerts: "Alertes de correspondance",
    save: "Enregistrer"
  },

  sp: {
    messages: "Mensajes",
    matches: "Coincidencias",
    events: "Eventos",
    settings: "Configuración",
    logout: "Cerrar sesión",
    profile: "Perfil",
    language: "Idioma",
    notifications: "Notificaciones",
    firstName: "Nombre",
    lastName: "Apellido",
    email: "Correo",
    bio: "Biografía",
    comingSoon: "Próximamente...",
    loading: "Cargando...",
    noMatches: "Aún no hay coincidencias.",
    message: "Mensaje",
    viewProfile: "Ver perfil",
    notificationsTitle: "Notificaciones",
    emailNotifications: "Notificaciones por correo",
    pushNotifications: "Notificaciones push",
    matchAlerts: "Alertas de coincidencia",
    save: "Guardar"
  }
};

export function t(key) {
  return translations[CURRENT_LANG]?.[key] || translations.en[key] || key;
}