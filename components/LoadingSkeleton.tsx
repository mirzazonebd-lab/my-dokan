'use client';

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
      <div className="relative aspect-square bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-gray-200 rounded w-1/3" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="flex items-center gap-1">
          <div className="h-3 bg-gray-200 rounded w-16" />
        </div>
        <div className="flex items-center justify-between pt-2">
          <div className="h-5 bg-gray-200 rounded w-20" />
          <div className="h-8 w-8 bg-gray-200 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function CategoryBannerSkeleton() {
  return (
    <div className="relative h-48 md:h-64 bg-gray-200 animate-pulse overflow-hidden rounded-xl">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center space-y-3 p-8">
          <div className="h-8 bg-gray-300 rounded w-48 mx-auto" />
          <div className="h-4 bg-gray-300 rounded w-64 mx-auto" />
        </div>
      </div>
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="grid md:grid-cols-2 gap-8 animate-pulse">
      <div className="space-y-4">
        <div className="aspect-square bg-gray-200 rounded-xl" />
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-square bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>
      <div className="space-y-6">
        <div className="h-3 bg-gray-200 rounded w-1/4" />
        <div className="h-8 bg-gray-200 rounded w-3/4" />
        <div className="flex items-center gap-2">
          <div className="h-4 bg-gray-200 rounded w-24" />
          <div className="h-4 bg-gray-200 rounded w-16" />
        </div>
        <div className="h-6 bg-gray-200 rounded w-32" />
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded" />
          <div className="h-3 bg-gray-200 rounded w-5/6" />
          <div className="h-3 bg-gray-200 rounded w-4/6" />
        </div>
        <div className="h-12 bg-gray-200 rounded-lg w-full" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-12 bg-gray-200 rounded-lg" />
          <div className="h-12 bg-gray-200 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function OrderSkeleton() {
  return (
    <div className="bg-white rounded-xl p-4 space-y-4 animate-pulse">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-32" />
          <div className="h-3 bg-gray-200 rounded w-24" />
        </div>
        <div className="h-6 bg-gray-200 rounded w-20" />
      </div>
      <div className="flex gap-3">
        <div className="w-16 h-16 bg-gray-200 rounded" />
        <div className="w-16 h-16 bg-gray-200 rounded" />
        <div className="w-16 h-16 bg-gray-200 rounded" />
      </div>
      <div className="flex justify-between">
        <div className="h-4 bg-gray-200 rounded w-24" />
        <div className="h-4 bg-gray-200 rounded w-20" />
      </div>
    </div>
  );
}

export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="p-4">
          <div className="h-4 bg-gray-200 rounded" />
        </td>
      ))}
    </tr>
  );
}

export function BrandCardSkeleton() {
  return (
    <div className="bg-white rounded-xl p-6 text-center animate-pulse">
      <div className="w-20 h-20 mx-auto bg-gray-200 rounded-full mb-4" />
      <div className="h-4 bg-gray-200 rounded w-24 mx-auto mb-2" />
      <div className="h-3 bg-gray-200 rounded w-16 mx-auto" />
    </div>
  );
}
