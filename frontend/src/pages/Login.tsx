import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth, UserRole } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import bgWheatField from "@/assets/bg-wheat-field.jpg";
import logoMain from "@/assets/logo-main.png";
import { useTranslation } from "react-i18next";

const Login = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("farmer");
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const validate = () => {
    const e: typeof errors = {};
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
    const success = await login(email, password, role);
    if (success) {
      toast({ title: t("welcomeBack"), description: t("loginSuccessful") });
      navigate("/dashboard");
    } else {
      toast({ title: t("loginFailed"), description: t("loginDescription"), variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0">
        <img src={bgWheatField} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-foreground/50 backdrop-blur-[1px]" />
      </div>
      <div className="relative z-10">
        <div className="app-stripe" />
        <div className="app-header text-primary-foreground py-3 px-4">
          <div className="max-w-md mx-auto flex items-center gap-3">
            <img src={logoMain} alt="FarmChainX" className="w-9 h-9 rounded object-contain" />
            <div>
              <p className="font-bold text-sm">FarmChainX</p>
              <p className="text-xs text-primary-foreground/60">Agricultural Supply Chain Platform</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center p-4 mt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="border border-border">
            <CardHeader>
              <CardTitle>{t("signin")}</CardTitle>
              <CardDescription>{t("accessYourDashboard")}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{t("email")}</Label>
                  <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                  {errors.email && <p className="text-destructive text-xs">{errors.email}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">{t("selectRole")}</Label>
                  <select id="role" value={role} onChange={(e) => setRole(e.target.value as UserRole)} className="w-full p-2 border rounded">
                    <option value="farmer">{t("farmer")}</option>
                    <option value="distributor">{t("distributors")}</option>
                    <option value="consumer">{t("consumers")}</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">{t("password")}</Label>
                  <div className="relative">
                    <Input id="password" type={showPass ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" onClick={() => setShowPass(!showPass)}>
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-destructive text-xs">{errors.password}</p>}
                </div>
                <Button type="submit" className="w-full gradient-primary border-0 text-primary-foreground">{t("signin")}</Button>
                <p className="text-center text-sm text-muted-foreground">
                  {t("dontHaveAccount")} <Link to="/register" className="text-primary font-medium hover:underline">{t("register")}</Link>
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

export default Login;
