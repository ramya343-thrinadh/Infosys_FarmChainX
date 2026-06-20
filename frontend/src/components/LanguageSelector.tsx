import { useTranslation } from "react-i18next";

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const currentLanguage = i18n.resolvedLanguage || i18n.language || "en";

  return (
    <select
      value={currentLanguage}
      onChange={(e) => changeLanguage(e.target.value)}
      className="px-2 py-1 rounded text-black text-sm"
    >
      <option value="en">English</option>
      <option value="te">తెలుగు</option>
      <option value="hi">हिंदी</option>
      <option value="ta">தமிழ்</option>
    </select>
  );
};

export default LanguageSelector;
