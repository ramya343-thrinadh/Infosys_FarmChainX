import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useAuth, UserRole } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Truck, ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import bgCropField from "@/assets/bg-crop-field.jpg";
import logoMain from "@/assets/logo-main.png";
import { useTranslation } from "react-i18next";

const roles: { value: UserRole; labelKey: string; icon: React.ReactNode; descKey: string }[] = [
  { value: "farmer", labelKey: "farmers", icon: <User className="w-5 h-5" />, descKey: "growAndList" },
  { value: "distributor", labelKey: "distributors", icon: <Truck className="w-5 h-5" />, descKey: "transportAndDeliver" },
  { value: "consumer", labelKey: "consumers", icon: <ShoppingCart className="w-5 h-5" />, descKey: "buyAndTrace" },
];

const Register = () => {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("farmer");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [searchParams] = useSearchParams();
  const { register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const roleParam = searchParams.get("role") as UserRole | null;
    if (roleParam && ["farmer", "distributor", "consumer"].includes(roleParam)) {
      setRole(roleParam);
    }
  }, [searchParams]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = t("nameIsRequired");
    if (!email) e.email = t("emailIsRequired");
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = t("invalidEmail");
    if (!password) e.password = t("passwordIsRequired");
    else if (password.length < 6) e.password = t("minPassword");
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const result = await register(name, email, password, role);
    if (result.success) {
      toast({ title: t("accountCreated"), description: t("registrationWelcome", { name }) });
      navigate("/dashboard");
    } else {
      toast({ title: t("registrationFailed"), description: result.error || t("pleaseTryAgain"), variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0">
        <img src={bgCropField} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-foreground/50 backdrop-blur-[1px]" />
      </div>
      <div className="relative z-10">
      <div className="app-stripe" />
      <div className="app-header text-primary-foreground py-3 px-4">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <img src={logoMain} alt="FarmChainX" className="w-9 h-9 rounded object-contain" />
          <div>
            <p className="font-bold text-sm">FarmChainX</p>
            <p className="text-xs text-primary-foreground/60">{t("agriculturalSupplyChainPlatform")}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center p-4 mt-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <Card className="border border-border">
            <CardHeader>
              <CardTitle>{t("register")}</CardTitle>
              <CardDescription>{t("createYourAccount")}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>{t("selectRole")}</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {roles.map((r) => (
                      <button
                        key={r.value}
                        type="button"
                        onClick={() => setRole(r.value)}
                        className={`p-3 rounded border text-center transition-all ${
                          role === r.value ? "border-primary bg-accent" : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="flex justify-center mb-1">
                          <span className={role === r.value ? "text-primary" : "text-muted-foreground"}>{r.icon}</span>
                        </div>
                        <span className="text-sm font-medium text-foreground block">{t(r.labelKey)}</span>
                        <p className="text-xs text-muted-foreground">{t(r.descKey)}</p>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">{t("fullName")}</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" />
                  {errors.name && <p className="text-destructive text-xs">{errors.name}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t("email")}</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
                  {errors.email && <p className="text-destructive text-xs">{errors.email}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">{t("password")}</Label>
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
                  {errors.password && <p className="text-destructive text-xs">{errors.password}</p>}
                </div>
                <Button type="submit" className="w-full gradient-primary border-0 text-primary-foreground">{t("register")}</Button>
                <p className="text-center text-sm text-muted-foreground">
                  {t("alreadyRegisteredSignIn")} <Link to="/login" className="text-primary font-medium hover:underline">{t("signin")}</Link>
                </p>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      </div>
    </div>
  );
};

export default Register;
