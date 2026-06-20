import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const FeedbackPage = () => {
  const { t } = useTranslation();
  const [rating, setRating] = useState(0);
  const [product, setProduct] = useState("");
  const [comment, setComment] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || rating === 0) {
      toast({ title: t("errorTitle"), description: t("productRatingRequired"), variant: "destructive" });
      return;
    }
    toast({ title: t("feedbackSubmittedTitle"), description: t("thankYouReview") });
    setRating(0); setProduct(""); setComment("");
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2"><MessageSquare className="w-6 h-6 text-primary" /> {t("feedbackTitle")}</h1>
        <p className="text-muted-foreground text-sm">{t("feedbackDescription")}</p>
      </div>
      <Card>
        <CardHeader><CardTitle>{t("submitReview")}</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>{t("productLabel")}</Label>
              <Select value={product} onValueChange={setProduct}>
                <SelectTrigger><SelectValue placeholder={t("selectProductPlaceholder")} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="wheat">Organic Wheat</SelectItem>
                  <SelectItem value="rice">Basmati Rice</SelectItem>
                  <SelectItem value="tomatoes">Fresh Tomatoes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("ratingLabel")}</Label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button key={s} type="button" onClick={() => setRating(s)}>
                    <Star className={`w-6 h-6 ${s <= rating ? "fill-secondary text-secondary" : "text-muted-foreground"}`} />
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t("commentLabel")}</Label>
              <Textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder={t("commentPlaceholder")} rows={4} />
            </div>
            <Button type="submit" className="gradient-primary border-0 text-primary-foreground w-full">{t("submitFeedbackButton")}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeedbackPage;
