
import { useCartStore } from "@/store/cartStore";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import QuantitySelector from "@/components/QuantitySelector";
import { Minus, ShoppingBag, Download, Trash2, Store } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import DownloadVisitSummary from "@/components/DownloadVisitSummary";
import { Button } from "@/components/ui/button";

const VisitList = () => {
  const items = useCartStore(state => state.items);
  const remove = useCartStore(state => state.removeFromCart);
  const updateQuantity = useCartStore(state => state.updateQuantity);
  const clear = useCartStore(state => state.clearCart);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const subtotal = Array.isArray(items)
    ? items.reduce((s, i) => s + i.price * i.quantity, 0)
    : 0;
  const total = subtotal;

  if (!Array.isArray(items) || !items.length) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-16">
        <div className="text-center bg-ssblue-card dark:bg-ssblue-primary rounded-2xl p-12 shadow-lg border border-ssblue-secondary">
          <div className="mb-6">
            <ShoppingBag className="mx-auto text-ssblue-secondary dark:text-ssblue-accent w-16 h-16" />
          </div>
          <h2 className="text-3xl font-bold mb-4 text-ssblue-primary dark:text-ssblue-onblue">
            {t("visitListEmpty") || "Your In-Store Reservation Summary is Empty"}
          </h2>
          <p className="text-ssblue-primary/70 dark:text-ssblue-onblue/70 mb-8 text-lg">
            Start adding items to create your visit list
          </p>
          <div className="flex justify-center">
           <Link to="/">
            <Button className="bg-ssblue-primary hover:bg-ssblue-secondary text-ssblue-onblue px-8 py-3 text-lg font-semibold">
             {t("browseReserveNow") || "Browse & Reserve Now"}
            </Button>
           </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleQuantityChange = (item: any, newQty: number) => {
    if (newQty < 1) {
      remove(item._id);
      toast({
        duration: 1000,
        title: t("removedFromVisitList") || "Removed from Visit List",
        description: (
          <div className="flex items-center gap-2">
            <Minus className="inline text-red-600 w-4 h-4" />
            {t("removedFromVisitList") || "Removed from Visit List"}
          </div>
        ),
        variant: "destructive"
      });
    } else {
      updateQuantity(item._id, newQty);
    }
  };

  const handleDownloadJSON = () => {
    const blob = new Blob([JSON.stringify(items, null, 2)], {
      type: "application/json"
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "ssmart-visit-list.json";
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 1500);
  };

  return (
    <div className="container max-w-5xl mx-auto px-2 sm:px-4 py-8">
      <div className="bg-gradient-to-r from-ssblue-primary to-ssblue-secondary rounded-2xl p-4 sm:p-8 mb-8 text-center shadow-lg">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Store className="text-ssblue-onblue w-6 sm:w-8 h-6 sm:h-8" />
          <h1 className="text-xl sm:text-3xl font-bold text-ssblue-onblue">
            {t("visitListTitle") || "Your In-Store Reservation Summary"}
          </h1>
        </div>
        <p className="text-ssblue-onblue/90 text-sm sm:text-lg">
          {t("visitListSubtitle") || "Please show this summary at SS MART, Shankarpally counter to complete your purchase."}
        </p>
      </div>

      <div className="bg-white dark:bg-ssblue-primary rounded-2xl shadow-lg border border-ssblue-secondary overflow-hidden mb-8">
        <div className="bg-ssblue-card dark:bg-ssblue-secondary px-3 sm:px-6 py-4 border-b border-ssblue-secondary">
          <h2 className="text-lg sm:text-xl font-semibold text-ssblue-primary dark:text-ssblue-onblue">
            Reserved Items ({items.length})
          </h2>
        </div>

        <div className="divide-y divide-ssblue-border dark:divide-ssblue-secondary/30">
          {items.map(item => (
            <div key={item._id} className="p-3 sm:p-6 hover:bg-ssblue-card/50 dark:hover:bg-ssblue-secondary/10 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                <div className="flex-shrink-0 self-center sm:self-auto">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl bg-ssblue-card dark:bg-ssblue-secondary border border-ssblue-secondary shadow-sm"
                    onError={e =>
                      (e.currentTarget.src =
                        "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=80&q=80")
                    }
                  />
                </div>

                <div className="flex-1 min-w-0 text-center sm:text-left">
                  <h3 className="text-base sm:text-lg font-semibold text-ssblue-primary dark:text-ssblue-onblue mb-2 break-words">
                    {item.name}
                  </h3>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-ssblue-primary/70 dark:text-ssblue-onblue/70">
                    <span>Price: ₹{item.price}</span>
                    <span>Stock: {item.stock}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 mt-2 sm:mt-0">
                  <div className="flex flex-col items-center gap-2">
                    <div className="text-xs sm:text-sm text-ssblue-primary/70 dark:text-ssblue-onblue/70">Quantity</div>
                    <QuantitySelector
                      quantity={item.quantity}
                      stock={item.stock}
                      onInc={() => handleQuantityChange(item, item.quantity + 1)}
                      onDec={() => handleQuantityChange(item, item.quantity - 1)}
                      disabled={item.stock === 0}
                    />
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <div className="text-xs sm:text-sm text-ssblue-primary/70 dark:text-ssblue-onblue/70">Total</div>
                    <div className="text-lg sm:text-xl font-bold text-ssblue-primary dark:text-ssblue-accent">
                      ₹{item.price * item.quantity}
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(item._id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 mt-2 sm:mt-0"
                    aria-label={t("remove")}
                  >
                    <Trash2 className="w-4 sm:w-5 h-4 sm:h-5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-ssblue-card to-white dark:from-ssblue-primary dark:to-ssblue-secondary rounded-2xl p-4 sm:p-8 shadow-lg border border-ssblue-secondary">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="text-center lg:text-left">
            <div className="text-sm sm:text-lg text-ssblue-primary/70 dark:text-ssblue-onblue/70 mb-2">
              {t("estimatedTotal") || "Estimated Total"}
            </div>
            <div className="text-2xl sm:text-4xl font-bold text-ssblue-primary dark:text-ssblue-accent">₹{total}</div>
            <div className="text-xs sm:text-sm text-ssblue-primary/60 dark:text-ssblue-onblue/60 mt-2">
              Final price may vary at store
            </div>
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap gap-3 w-full lg:w-auto">
            <Button
              variant="outline"
              onClick={clear}
              className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/20 text-xs sm:text-sm"
            >
              <Trash2 className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
              {t("clearVisitList") || "Clear Visit List"}
            </Button>

            <DownloadVisitSummary items={items} total={total} />

            <Button
              onClick={handleDownloadJSON}
              variant="outline"
              className="border-ssblue-secondary text-ssblue-primary hover:bg-ssblue-card dark:border-ssblue-accent dark:text-ssblue-accent dark:hover:bg-ssblue-accent/10 text-xs sm:text-sm"
            >
              <Download className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
              {t("downloadVisitListJSON") || "Download JSON"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitList;
