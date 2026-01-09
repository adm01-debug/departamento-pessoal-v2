import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Heart } from "lucide-react";

interface ProductCardProps {
  name: string;
  price: number;
  originalPrice?: number;
  image?: string;
  category?: string;
  inStock?: boolean;
  rating?: number;
  onAddToCart?: () => void;
  onFavorite?: () => void;
  className?: string;
}

export function ProductCard({ name, price, originalPrice, image, category, inStock = true, rating, onAddToCart, onFavorite, className }: ProductCardProps) {
  const discount = originalPrice ? Math.round((1 - price / originalPrice) * 100) : 0;
  const formatPrice = (v: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

  return (
    <Card className={cn("overflow-hidden group", className)}>
      <div className="relative aspect-square overflow-hidden bg-muted">
        {image && <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />}
        {discount > 0 && <Badge className="absolute top-2 left-2 bg-red-500">-{discount}%</Badge>}
        {!inStock && <Badge variant="secondary" className="absolute top-2 right-2">Esgotado</Badge>}
        {onFavorite && <Button variant="ghost" size="icon" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={onFavorite}><Heart className="h-4 w-4" /></Button>}
      </div>
      <CardContent className="p-4">
        {category && <p className="text-xs text-muted-foreground mb-1">{category}</p>}
        <h3 className="font-medium line-clamp-2">{name}</h3>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-lg font-bold">{formatPrice(price)}</span>
          {originalPrice && <span className="text-sm text-muted-foreground line-through">{formatPrice(originalPrice)}</span>}
        </div>
        {onAddToCart && <Button className="w-full mt-3" disabled={!inStock} onClick={onAddToCart}><ShoppingCart className="h-4 w-4 mr-2" />{inStock ? "Adicionar" : "Indisponível"}</Button>}
      </CardContent>
    </Card>
  );
}
export default ProductCard;
