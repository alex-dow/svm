import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  resources: {
    en: {
      appTitle: "Satisfactory Vehicle Manager",
      save: "Save",
      delete: "Delete",
      signup: "Signup",
      login: "Login",
      username: "Username",
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm Password",
    },
    fr: {
      appTitle: "Gestionnaire de Véhicules Satisfactory",
      save: "Enregistrer",
      delete: "Supprimer",
      signup: "Inscription",
      login: "Connexion",
      username: "Nom d'utilisateur",
      email: "Email",
      password: "Mot de passe",
      confirmPassword: "Confirmer le mot de passe",
    },
  },
});

export default i18n;
