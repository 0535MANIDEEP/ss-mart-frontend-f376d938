
import React from "react";

type Props = { stock: number };

const ProductOutOfStockLabel = React.memo(({ stock }: Props) =>
  stock <= 0 ? (
    <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded z-10 text-xs font-bold shadow-lg">
      Out of Stock
    </div>
  ) : null
);

export default ProductOutOfStockLabel;
