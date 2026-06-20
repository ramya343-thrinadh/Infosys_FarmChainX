import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Truck, ShoppingCart } from "lucide-react";
import { useTranslation } from "react-i18next";

const options = [
  { role: "farmer", Icon: User, labelKey: "farmers", subtitleKey: "growAndList" },
  { role: "distributor", Icon: Truck, labelKey: "distributors", subtitleKey: "transportAndDeliver" },
  { role: "consumer", Icon: ShoppingCart, labelKey: "consumers", subtitleKey: "buyAndTrace" },
];

const RoleSelection = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-10 px-4">
      <div className="max-w-5xl w-full">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">{t("selectYourRole")}</h1>
        <div className="grid gap-4 md:grid-cols-3">
          {options.map(({ role, Icon, labelKey, subtitleKey }) => (
            <Card key={role} className="border border-border hover:shadow-lg transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon className="w-5 h-5" /> {t(labelKey)}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{t(subtitleKey)}</p>
                <Link to={`/register?role=${role}`}>
                  <Button className="w-full">{t("registerAs", { role: t(labelKey) })}</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center mt-6">
          <Link to="/login" className="text-primary underline">{t("alreadyRegisteredSignIn")}</Link>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
