
import React from "react";

type Props = {
  quantity: number;
  stock: number;
  onInc: () => void;
  onDec: () => void;
  incDisabled?: boolean;
  decDisabled?: boolean;
};

// This compact qty selector is intended for the product card (not for cart page).
export default function ProductMiniQtyControl({
  quantity,
  stock,
  onInc,
  onDec,
  incDisabled,
  decDisabled,
}: Props) {
  // Only show minus, count when qty > 0
  return (
    <div className="flex items-center gap-2 select-none">
      {quantity > 0 && (
        <button
          type="button"
          onClick={onDec}
          disabled={decDisabled || quantity <= 0}
          className={`
            bg-white text-black border border-gray-300 shadow rounded-full w-8 h-8 flex items-center justify-center
            text-xl font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400
            hover:bg-gray-100 active:bg-gray-200
            disabled:opacity-50 disabled:pointer-events-none
          `}
          aria-label="Decrease"
          tabIndex={0}
        >
          −
        </button>
      )}
      {quantity > 0 && (
        <span className="font-semibold min-w-[22px] text-center">{quantity}</span>
      )}
      <button
        type="button"
        onClick={onInc}
        disabled={incDisabled || quantity >= stock}
        className={`
          bg-white text-black border border-gray-300 shadow rounded-full w-8 h-8 flex items-center justify-center
          text-xl font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400
          hover:bg-gray-100 active:bg-gray-200
          disabled:opacity-50 disabled:pointer-events-none
        `}
        aria-label="Increase"
        tabIndex={0}
      >
        +
      </button>
    </div>
  );
}
