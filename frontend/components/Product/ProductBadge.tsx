import React from 'react';

interface ProductBadgeProps {
  badge: 'new' | 'popular' | 'sale' | 'out_of_stock';
}

export default function ProductBadge({ badge }: ProductBadgeProps) {
  const badges = {
    new: {
      text: 'New',
      className: 'bg-blue-500 text-white',
    },
    popular: {
      text: 'Popular',
      className: 'bg-orange-500 text-white',
    },
    sale: {
      text: 'Sale',
      className: 'bg-red-500 text-white',
    },
    out_of_stock: {
      text: 'Out of Stock',
      className: 'bg-gray-500 text-white',
    },
  };

  const { text, className } = badges[badge] || badges.new;

  return (
    <span
      className={`inline-block px-2 py-1 text-xs font-bold rounded ${className}`}
    >
      {text}
    </span>
  );
}
