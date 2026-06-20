import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ShoppingCart, Star, Search, Heart, ShieldCheck, Leaf, Plus, Minus, Phone, Mail, MapPin, CreditCard, Banknote, Smartphone, Trash2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useProductsContext } from "@/context/ProductContext";
import { useOrders } from "@/context/OrderContext";

import tomatoesImg from "@/assets/products/tomatoes.jpg";
import wheatImg from "@/assets/products/wheat.jpg";
import riceImg from "@/assets/products/rice.jpg";
import spinachImg from "@/assets/products/spinach.jpg";
import carrotsImg from "@/assets/products/carrots.jpg";
import lentilsImg from "@/assets/products/lentils.jpg";
import potatoesImg from "@/assets/products/potatoes.jpg";
import peppersImg from "@/assets/products/peppers.jpg";

const categories = ["All", "Vegetables", "Grains", "Legumes"];

const products = [
  { id: 5, name: "Organic Carrots", price: 50, unit: "kg", image: carrotsImg, category: "Vegetables", farmer: "Vikram Singh", location: "Rajasthan", rating: 4.5, reviews: 45, quality: 91, organic: true, inStock: true, phone: "+91 98765 43214", email: "vikram.singh@farm.in" },
  { id: 1, name: "Fresh Tomatoes", price: 45, unit: "kg", image: tomatoesImg, category: "Vegetables", farmer: "Ram Kumar", location: "Punjab", rating: 4.8, reviews: 124, quality: 95, organic: true, inStock: true, phone: "+91 98765 43210", email: "ram.kumar@farm.in" },
  { id: 8, name: "Bell Peppers", price: 72, unit: "kg", image: peppersImg, category: "Vegetables", farmer: "Priya Kumari", location: "Karnataka", rating: 4.7, reviews: 92, quality: 94, organic: true, inStock: true, phone: "+91 98765 43217", email: "priya.kumari@farm.in" },
  { id: 4, name: "Fresh Spinach", price: 32, unit: "bunch", image: spinachImg, category: "Vegetables", farmer: "Anita Devi", location: "UP", rating: 4.6, reviews: 67, quality: 88, organic: true, inStock: true, phone: "+91 98765 43213", email: "anita.devi@farm.in" },
  { id: 7, name: "Farm Potatoes", price: 29, unit: "kg", image: potatoesImg, category: "Vegetables", farmer: "Rajan Verma", location: "Bihar", rating: 4.4, reviews: 78, quality: 87, organic: false, inStock: false, phone: "+91 98765 43216", email: "rajan.verma@farm.in" },
];

type Product = typeof products[0];

const MarketplacePage = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const categoryLabels = {
    All: t("categoryAll"),
    Vegetables: t("categoryVegetables"),
    Grains: t("categoryGrains"),
    Legumes: t("categoryLegumes"),
  };
  const [cart, setCart] = useState<Record<number, number>>({});
  const [wishlist, setWishlist] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem("farmchainx-wishlist");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showWishlistOnly, setShowWishlistOnly] = useState(false);
  const { toast } = useToast();
  const { products: contextProducts } = useProductsContext();
  const { addOrder } = useOrders();

  const mappedProducts = contextProducts.map((p, index) => ({
    id: index + 1, // temporary id for marketplace
    name: p.name,
    price: p.price || 50, // default price
    unit: "kg",
    image: p.image 
  ? p.image 
  : p.name === "Basmati Rice" 
    ? riceImg 
    : p.name === "Green Lentils" 
      ? lentilsImg 
      : tomatoesImg, 
    category: "Vegetables", // default
    farmer: p.farmer || "Unknown Farmer",
    location: p.location,
    rating: 4.5,
    reviews: 10,
    quality: p.quality,
    organic: true,
    inStock: p.status !== "Delivered",
    phone: "+91 98765 43210",
    email: "farmer@farm.in"
  }));

  const allProducts = [...products, ...mappedProducts];

  const lowerSearch = search.toLowerCase().trim();
  const getMatchedFields = (p: Product) => {
    if (!lowerSearch) return [];
    return [
      { label: "Name", value: p.name },
      { label: "Category", value: p.category },
      { label: "Farmer", value: p.farmer },
      { label: "Location", value: p.location },
      { label: "Email", value: p.email },
      { label: "Organic", value: p.organic ? "organic" : "" },
    ]
      .filter(field => field.value.toLowerCase().includes(lowerSearch))
      .map(field => field.label.toLowerCase());
  };

  const searchMatches = (p: Product) => {
    if (!lowerSearch) return false;
    return getMatchedFields(p).length > 0;
  };

  const visibleProducts = allProducts.filter(p =>
    (category === "All" || p.category === category) &&
    (!showWishlistOnly || wishlist.includes(p.id))
  );

  // Search results at TOP, sorted by relevance, then other products below
  const sortedProducts = lowerSearch 
    ? [
        ...visibleProducts
          .filter(searchMatches)
          .sort((a, b) => {
            const aMatch = getMatchedFields(a).length;
            const bMatch = getMatchedFields(b).length;
            return bMatch - aMatch;
          }),
        ...visibleProducts.filter(p => !searchMatches(p))
      ]
    : visibleProducts;

  const matchedProducts = sortedProducts.filter(searchMatches);

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const cartTotal = Object.entries(cart).reduce((sum, [id, qty]) => {
    const p = allProducts.find(x => x.id === Number(id));
    return sum + (p ? p.price * qty : 0);
  }, 0);

  useEffect(() => {
    localStorage.setItem("farmchainx-wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const addToCart = (id: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    toast({ title: t("toastAddedToCartTitle"), description: allProducts.find(p => p.id === id)?.name });
  };

  const removeFromCart = (id: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCart(prev => {
      const next = { ...prev };
      if (next[id] > 1) next[id]--;
      else delete next[id];
      return next;
    });
  };

  const deleteFromCart = (id: number) => {
    setCart(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const toggleWishlist = (id: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setWishlist(prev => {
      const isIn = prev.includes(id);
      const product = allProducts.find(p => p.id === id);
      toast({ title: isIn ? t("toastRemovedFromFavoritesTitle") : t("toastAddedToFavoritesTitle"), description: product?.name });
      return isIn ? prev.filter(x => x !== id) : [...prev, id];
    });
  };

  const handleCheckout = () => {
    // Create orders for each item in cart
    Object.entries(cart).forEach(([id, qty]) => {
      const product = allProducts.find(p => p.id === Number(id));
      if (product) {
        addOrder({
          product: product.name,
          qty: `${qty} ${product.unit}`,
          total: `₹${(product.price * qty).toFixed(0)}`,
          status: "Pending",
          rating: null,
        });
      }
    });
    
    toast({ title: t("toastOrderPlacedTitle"), description: t("toastOrderPlacedDescription", { total: `₹${cartTotal.toFixed(0)}` }) });
    setCart({}); // Clear cart after checkout
  };

  const cartItems = Object.entries(cart).map(([id, qty]) => ({
    product: allProducts.find(p => p.id === Number(id))!,
    qty
  })).filter(x => x.product);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t("marketplaceTitle")}</h1>
          <p className="text-muted-foreground text-sm">{t("marketplaceDescription")}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button size="sm" className="gap-2 rounded-full bg-emerald-600 border-0 text-white hover:bg-emerald-700 transition-colors">
            <Heart className="w-4 h-4 fill-current" />
            <span className="font-semibold">{wishlist.length}</span>
          </Button>

          <Button variant={showWishlistOnly ? "default" : "outline"} size="sm" onClick={() => setShowWishlistOnly(!showWishlistOnly)} className={showWishlistOnly ? "gradient-primary border-0 text-primary-foreground" : ""}>
            <span>{showWishlistOnly ? t("viewingFavorites") : t("viewFavorites")}</span>
          </Button>

          {/* Cart Sheet */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="relative">
                <ShoppingCart className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full gradient-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
                <span className="ml-2 font-semibold">₹{cartTotal.toFixed(0)}</span>
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" /> {t("yourCartTitle", { count: cartCount })}
                </SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-4 flex-1 overflow-y-auto">
                {cartItems.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-40" />
                    <p>{t("cartEmpty")}</p>
                  </div>
                ) : (
                  cartItems.map(({ product: p, qty }) => (
                    <div key={p.id} className="flex gap-3 p-3 rounded-lg border bg-card">
                      <img src={p.image} alt={p.name} className="w-16 h-16 rounded-md object-cover" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-foreground truncate">{p.name}</h4>
                        <p className="text-xs text-muted-foreground">{p.farmer}</p>
                        <p className="text-sm font-bold text-foreground mt-1">₹{p.price}/{p.unit}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <button onClick={() => deleteFromCart(p.id)} className="text-muted-foreground hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="flex items-center gap-1">
                          <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => removeFromCart(p.id)}>
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="text-sm font-bold w-6 text-center">{qty}</span>
                          <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => addToCart(p.id)}>
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {cartItems.length > 0 && (
                <div className="mt-6 border-t pt-4 space-y-4">
                  <div className="flex justify-between text-lg font-bold text-foreground">
                    <span>{t("cartTotalLabel")}</span>
                    <span>₹{cartTotal.toFixed(0)}</span>
                  </div>
                  <Button className="w-full gradient-primary border-0 text-primary-foreground" size="lg"
                    onClick={() => handleCheckout()}>
                    <CreditCard className="w-4 h-4 mr-2" /> {t("proceedToPay")}
                  </Button>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {wishlist.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 px-1">
          <span className="text-sm font-semibold text-foreground">{t("favoritesLabel")}</span>
          {wishlist.slice(0, 4).map((id) => {
            const product = allProducts.find(p => p.id === id);
            return (
              <span key={id} className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-foreground shadow-sm">
                <Heart className="w-3.5 h-3.5 fill-destructive text-destructive" />
                {product?.name || t("favoritePlaceholder")}
              </span>
            );
          })}
          {wishlist.length > 4 && (
            <span className="text-xs text-muted-foreground">+{wishlist.length - 4} {t("moreLabel")}</span>
          )}
        </div>
      )}

      {(lowerSearch || category !== "All" || showWishlistOnly) && (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p>
              {t("showingCount", { count: sortedProducts.length })}
              {lowerSearch && matchedProducts.length > 0 && (
                <> {t("matchedResults", { count: matchedProducts.length, search })}</>
              )}
              {category !== "All" && (
                <> {t("filteredByCategory", { category: categoryLabels[category] })}</>
              )}
              {showWishlistOnly && <> {t("fromFavorites")}</>}
            </p>
            {lowerSearch && (
              <Button variant="outline" size="sm" onClick={() => setSearch("")}>{t("clearButton")}</Button>
            )}
          </div>
        </div>
      )}

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder={t("searchPlaceholder")} className="pl-10" />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map(cat => (
            <Button key={cat} size="sm" variant={category === cat ? "default" : "outline"}
              onClick={() => setCategory(cat)} className={category === cat ? "gradient-primary border-0 text-primary-foreground" : ""}>
              {categoryLabels[cat]}
            </Button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        <AnimatePresence mode="popLayout">
          {sortedProducts.map((p, i) => {
            const isSearchMatch = lowerSearch && searchMatches(p);
            const matchedFields = getMatchedFields(p);
            return (
              <motion.div key={p.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: i * 0.05 }}>
                <Card className={`overflow-hidden group transition-shadow cursor-pointer ${isSearchMatch ? "ring-2 ring-primary/40 shadow-lg" : "hover:shadow-lg"}`} onClick={() => setSelectedProduct(p)}>
                  <div className="relative aspect-square overflow-hidden">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                    <button onClick={(e) => toggleWishlist(p.id, e)}
                      className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all ${wishlist.includes(p.id) ? "bg-destructive/15 text-destructive shadow-sm" : "bg-card/80 text-muted-foreground hover:bg-card"}`}>
                      <Heart className={`w-4 h-4 ${wishlist.includes(p.id) ? "fill-current" : ""}`} />
                    </button>
                    {isSearchMatch && (
                      <span className="absolute left-3 top-3 rounded-full bg-primary/10 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                        {t("matchedLabel")}
                      </span>
                    )}
                  {p.organic && (
                    <Badge className="absolute top-3 left-3 bg-success/90 text-success-foreground border-0 gap-1">
                      <Leaf className="w-3 h-3" /> {t("organicLabel")}
                    </Badge>
                  )}
                  {!p.inStock && (
                    <div className="absolute inset-0 bg-foreground/40 flex items-center justify-center">
                      <span className="bg-card px-4 py-2 rounded-lg font-semibold text-foreground">{t("outOfStockLabel")}</span>
                    </div>
                  )}
                </div>
                <CardContent className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-foreground">{p.name}</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-success" /> {p.farmer} · {p.location}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5">
                      <Star className="w-3.5 h-3.5 fill-secondary text-secondary" />
                      <span className="text-sm font-medium text-foreground">{p.rating}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{t("reviewsLabel", { count: p.reviews })}</span>
                    <Badge variant="outline" className="ml-auto text-xs bg-accent/50 text-accent-foreground border-accent">
                      {t("qualityScoreLabel")} {p.quality}%
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-foreground">₹{p.price}</span>
                      <span className="text-xs text-muted-foreground">/{p.unit}</span>
                    </div>
                    {p.inStock && (
                      cart[p.id] ? (
                        <div className="flex items-center gap-2">
                          <Button size="icon" variant="outline" className="h-8 w-8" onClick={(e) => removeFromCart(p.id, e)}>
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="text-sm font-bold text-foreground w-6 text-center">{cart[p.id]}</span>
                          <Button size="icon" className="h-8 w-8 gradient-primary border-0 text-primary-foreground" onClick={(e) => addToCart(p.id, e)}>
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      ) : (
                        <Button size="sm" className="gradient-primary border-0 text-primary-foreground" onClick={(e) => addToCart(p.id, e)}>
                          <ShoppingCart className="w-3.5 h-3.5 mr-1" /> {t("addButtonLabel")}
                        </Button>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {sortedProducts.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Search className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p>{showWishlistOnly ? t("noWishlistItems") : t("noProductsFound")}</p>
        </div>
      )}

      {/* Product Detail Dialog */}
      <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        {selectedProduct && (
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">{selectedProduct.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-5">
              {/* Product Image */}
              <div className="relative rounded-lg overflow-hidden aspect-video">
                <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
                {selectedProduct.organic && (
                  <Badge className="absolute top-3 left-3 bg-success/90 text-success-foreground border-0 gap-1">
                    <Leaf className="w-3 h-3" /> {t("organicLabel")}
                  </Badge>
                )}
              </div>

              {/* Price & Rating */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold text-foreground">₹{selectedProduct.price}</span>
                  <span className="text-muted-foreground">/{selectedProduct.unit}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 fill-secondary text-secondary" />
                  <span className="font-medium">{selectedProduct.rating}</span>
                  <span className="text-xs text-muted-foreground">{t("reviewsLabel", { count: selectedProduct.reviews })}</span>
                </div>
                {selectedProduct.inStock ? (
                  <Badge className="bg-success/20 text-success border-success/30">{t("inStockLabel")}</Badge>
                ) : (
                  <Badge variant="destructive">{t("outOfStockLabel")}</Badge>
                )}
              </div>

              <Separator />

              {/* Farmer Contact */}
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-success" /> {t("farmerDetailsTitle")}
                </h4>
                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-foreground">{selectedProduct.farmer}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" /> {selectedProduct.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="w-4 h-4" /> {selectedProduct.phone}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="w-4 h-4" /> {selectedProduct.email}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <a href={`tel:${selectedProduct.phone}`}><Phone className="w-4 h-4 mr-1" /> {t("callLabel")}</a>
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <a href={`mailto:${selectedProduct.email}`}><Mail className="w-4 h-4 mr-1" /> {t("emailLabel")}</a>
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Payment Options */}
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">{t("paymentOptionsTitle")}</h4>
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/30 transition-colors">
                    <Smartphone className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{t("paymentOptionUPI")}</p>
                      <p className="text-xs text-muted-foreground">{t("paymentOptionUPIDescription")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/30 transition-colors">
                    <CreditCard className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{t("paymentOptionCard")}</p>
                      <p className="text-xs text-muted-foreground">{t("paymentOptionCardDescription")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/30 transition-colors">
                    <Banknote className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{t("paymentOptionCOD")}</p>
                      <p className="text-xs text-muted-foreground">{t("payOnDelivery")}</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => toggleWishlist(selectedProduct.id)}>
                  <Heart className={`w-4 h-4 mr-1 ${wishlist.includes(selectedProduct.id) ? "fill-destructive text-destructive" : ""}`} />
                  {wishlist.includes(selectedProduct.id) ? t("wishlistedLabel") : t("wishlistLabel")}
                </Button>
                {selectedProduct.inStock && (
                  <Button className="flex-1 gradient-primary border-0 text-primary-foreground" onClick={() => { addToCart(selectedProduct.id); setSelectedProduct(null); }}>
                    <ShoppingCart className="w-4 h-4 mr-1" /> {t("addToCartButton")}
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default MarketplacePage;
