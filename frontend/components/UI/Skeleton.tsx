import React from 'react';

interface SkeletonProps {
  width?: string;
  height?: string;
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
}

export default function Skeleton({
  width = '100%',
  height = '20px',
  className = '',
  variant = 'rectangular',
}: SkeletonProps) {
  const baseStyles = 'animate-pulse bg-gray-200';
  
  const variants = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  return (
    <div
      className={`${baseStyles} ${variants[variant]} ${className}`}
      style={{ width, height }}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <Skeleton height="200px" className="mb-4" />
      <Skeleton height="24px" width="80%" className="mb-2" />
      <Skeleton height="20px" width="60%" className="mb-4" />
      <Skeleton height="40px" />
    </div>
  );
}
