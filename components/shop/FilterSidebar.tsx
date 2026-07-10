'use client';

import { useState } from 'react';
import { ChevronDown, RotateCcw, Star, X } from 'lucide-react';
import { products } from '@/lib/data/products';

export interface FilterState {
  categories: string[];
  brands: string[];
  priceMin: number;
  priceMax: number;
  rating: number;
  skinTypes: string[];
  inStockOnly: boolean;
  isKorean: boolean;
}

const DEFAULT_FILTERS: FilterState = {
  categories: [],
  brands: [],
  priceMin: 0,
  priceMax: 10000,
  rating: 0,
  skinTypes: [],
  inStockOnly: false,
  isKorean: false,
};

const PRICE_MAX = 10000;

interface FilterSidebarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onClose?: () => void;
  totalFiltered?: number;
}

function FilterSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 pb-5 mb-5 last:border-0 last:mb-0 last:pb-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-left mb-3"
      >
        <span className="font-semibold text-[#1C1C2E] text-sm">{title}</span>
        <ChevronDown
          size={16}
          className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && children}
    </div>
  );
}

function CheckItem({
  label,
  count,
  checked,
  onChange,
}: {
  label: string;
  count?: number;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center justify-between gap-2 cursor-pointer group py-1">
      <div className="flex items-center gap-2.5">
        <div
          className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
            checked
              ? 'bg-[#C4818A] border-[#C4818A]'
              : 'border-gray-300 group-hover:border-[#C4818A]'
          }`}
          onClick={onChange}
        >
          {checked && (
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
        <span
          className={`text-sm transition-colors ${checked ? 'text-[#C4818A] font-medium' : 'text-gray-600 group-hover:text-[#C4818A]'}`}
          onClick={onChange}
        >
          {label}
        </span>
      </div>
      {count !== undefined && (
        <span className="text-[11px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">
          {count}
        </span>
      )}
    </label>
  );
}

// Compute counts from all products
const allCategories = Array.from(new Set(products.map(p => p.category))).sort();
const allBrands = Array.from(new Set(products.map(p => p.brand))).sort();
const allSkinTypes = Array.from(new Set(products.flatMap(p => p.skinType))).sort();

function getCategoryCount(cat: string) {
  return products.filter(p => p.category === cat).length;
}
function getBrandCount(brand: string) {
  return products.filter(p => p.brand === brand).length;
}

export default function FilterSidebar({ filters, onChange, onClose, totalFiltered }: FilterSidebarProps) {
  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.brands.length > 0 ||
    filters.priceMin > 0 ||
    filters.priceMax < PRICE_MAX ||
    filters.rating > 0 ||
    filters.skinTypes.length > 0 ||
    filters.inStockOnly ||
    filters.isKorean;

  const toggleCategory = (cat: string) => {
    const cats = filters.categories.includes(cat)
      ? filters.categories.filter(c => c !== cat)
      : [...filters.categories, cat];
    onChange({ ...filters, categories: cats });
  };

  const toggleBrand = (brand: string) => {
    const brands = filters.brands.includes(brand)
      ? filters.brands.filter(b => b !== brand)
      : [...filters.brands, brand];
    onChange({ ...filters, brands });
  };

  const toggleSkinType = (type: string) => {
    const types = filters.skinTypes.includes(type)
      ? filters.skinTypes.filter(t => t !== type)
      : [...filters.skinTypes, type];
    onChange({ ...filters, skinTypes: types });
  };

  const resetAll = () => onChange(DEFAULT_FILTERS);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 h-fit">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-100">
        <div>
          <h2 className="font-poppins font-bold text-[#1C1C2E] text-base">Filters</h2>
          {totalFiltered !== undefined && (
            <p className="text-xs text-gray-400 mt-0.5">{totalFiltered} products found</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={resetAll}
              className="flex items-center gap-1 text-xs text-[#C4818A] hover:text-[#B06E77] font-medium"
            >
              <RotateCcw size={12} />
              Clear All
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center lg:hidden"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {filters.categories.map(c => (
            <button
              key={c}
              onClick={() => toggleCategory(c)}
              className="flex items-center gap-1 text-[11px] px-2.5 py-1 bg-rose-50 text-[#C4818A] rounded-full border border-rose-200"
            >
              {c} <X size={10} />
            </button>
          ))}
          {filters.brands.map(b => (
            <button
              key={b}
              onClick={() => toggleBrand(b)}
              className="flex items-center gap-1 text-[11px] px-2.5 py-1 bg-rose-50 text-[#C4818A] rounded-full border border-rose-200"
            >
              {b} <X size={10} />
            </button>
          ))}
          {filters.rating > 0 && (
            <button
              onClick={() => onChange({ ...filters, rating: 0 })}
              className="flex items-center gap-1 text-[11px] px-2.5 py-1 bg-rose-50 text-[#C4818A] rounded-full border border-rose-200"
            >
              {filters.rating}+ Stars <X size={10} />
            </button>
          )}
          {filters.inStockOnly && (
            <button
              onClick={() => onChange({ ...filters, inStockOnly: false })}
              className="flex items-center gap-1 text-[11px] px-2.5 py-1 bg-rose-50 text-[#C4818A] rounded-full border border-rose-200"
            >
              In Stock <X size={10} />
            </button>
          )}
          {filters.isKorean && (
            <button
              onClick={() => onChange({ ...filters, isKorean: false })}
              className="flex items-center gap-1 text-[11px] px-2.5 py-1 bg-rose-50 text-[#C4818A] rounded-full border border-rose-200"
            >
              K-Beauty <X size={10} />
            </button>
          )}
        </div>
      )}

      {/* Category */}
      <FilterSection title="Category">
        <div className="space-y-0.5 max-h-56 overflow-y-auto scrollbar-hide">
          {allCategories.map(cat => (
            <CheckItem
              key={cat}
              label={cat}
              count={getCategoryCount(cat)}
              checked={filters.categories.includes(cat)}
              onChange={() => toggleCategory(cat)}
            />
          ))}
        </div>
      </FilterSection>

      {/* Brand */}
      <FilterSection title="Brand">
        <div className="space-y-0.5 max-h-56 overflow-y-auto scrollbar-hide">
          {allBrands.map(brand => (
            <CheckItem
              key={brand}
              label={brand}
              count={getBrandCount(brand)}
              checked={filters.brands.includes(brand)}
              onChange={() => toggleBrand(brand)}
            />
          ))}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price Range">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <label className="text-[10px] text-gray-400 mb-1 block">Min (৳)</label>
              <input
                type="number"
                min={0}
                max={filters.priceMax}
                value={filters.priceMin}
                onChange={e => onChange({ ...filters, priceMin: Math.max(0, Number(e.target.value)) })}
                className="w-full px-2.5 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C4818A]/20 focus:border-[#C4818A]"
              />
            </div>
            <span className="text-gray-300 mt-4">—</span>
            <div className="flex-1">
              <label className="text-[10px] text-gray-400 mb-1 block">Max (৳)</label>
              <input
                type="number"
                min={filters.priceMin}
                max={PRICE_MAX}
                value={filters.priceMax}
                onChange={e => onChange({ ...filters, priceMax: Math.min(PRICE_MAX, Number(e.target.value)) })}
                className="w-full px-2.5 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C4818A]/20 focus:border-[#C4818A]"
              />
            </div>
          </div>
          <input
            type="range"
            min={0}
            max={PRICE_MAX}
            value={filters.priceMax}
            onChange={e => onChange({ ...filters, priceMax: Number(e.target.value) })}
            className="w-full accent-[#C4818A]"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>৳0</span>
            <span>৳{PRICE_MAX.toLocaleString()}</span>
          </div>
          {/* Quick Price Presets */}
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { label: 'Under ৳500', min: 0, max: 500 },
              { label: '৳500–1000', min: 500, max: 1000 },
              { label: '৳1000–2000', min: 1000, max: 2000 },
              { label: 'Over ৳2000', min: 2000, max: PRICE_MAX },
            ].map(preset => (
              <button
                key={preset.label}
                onClick={() => onChange({ ...filters, priceMin: preset.min, priceMax: preset.max })}
                className={`text-[11px] px-2 py-1.5 rounded-lg border transition-colors text-center ${
                  filters.priceMin === preset.min && filters.priceMax === preset.max
                    ? 'bg-[#C4818A] text-white border-[#C4818A]'
                    : 'border-gray-200 text-gray-500 hover:border-[#C4818A] hover:text-[#C4818A]'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </FilterSection>

      {/* Rating */}
      <FilterSection title="Customer Rating">
        <div className="space-y-1">
          {[4, 3, 2].map(r => (
            <button
              key={r}
              onClick={() => onChange({ ...filters, rating: filters.rating === r ? 0 : r })}
              className={`flex items-center gap-2 w-full py-1.5 px-2 rounded-lg text-sm transition-colors ${
                filters.rating === r
                  ? 'bg-rose-50 text-[#C4818A]'
                  : 'hover:bg-gray-50 text-gray-600'
              }`}
            >
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    size={13}
                    className={i < r ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}
                  />
                ))}
              </div>
              <span className="text-xs">{r}+ Stars</span>
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Skin Type */}
      <FilterSection title="Skin Type">
        <div className="space-y-0.5 max-h-40 overflow-y-auto scrollbar-hide">
          {allSkinTypes.filter(t => t !== 'All').map(type => (
            <CheckItem
              key={type}
              label={type}
              checked={filters.skinTypes.includes(type)}
              onChange={() => toggleSkinType(type)}
            />
          ))}
        </div>
      </FilterSection>

      {/* Availability */}
      <FilterSection title="Availability" defaultOpen={false}>
        <div className="space-y-1.5">
          <CheckItem
            label="In Stock Only"
            checked={filters.inStockOnly}
            onChange={() => onChange({ ...filters, inStockOnly: !filters.inStockOnly })}
          />
          <CheckItem
            label="K-Beauty Products"
            checked={filters.isKorean}
            onChange={() => onChange({ ...filters, isKorean: !filters.isKorean })}
          />
          <CheckItem
            label="On Sale"
            checked={filters.priceMax < PRICE_MAX && filters.priceMin === 0}
            onChange={() =>
              onChange({
                ...filters,
                priceMin: 0,
                priceMax: filters.priceMax < PRICE_MAX ? PRICE_MAX : 5000,
              })
            }
          />
        </div>
      </FilterSection>
    </div>
  );
}

export { DEFAULT_FILTERS };
