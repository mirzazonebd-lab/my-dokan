import { Product } from './types';

export interface ProductContent {
  ingredients: string;
  howToUse: string[];
  benefits: string[];
  warnings: string[];
  size: string;
  shelfLife: string;
  madeIn: string;
}

export function getProductContent(product: Product): ProductContent {
  const cat = product.category.toLowerCase();
  const sub = product.category.toLowerCase();
  const isKorean = product.category === 'Korean Skincare';

  // Ingredients by type
  const ingredientMap: Record<string, string> = {
    'essence & serum': `Aqua/Water, ${
      product.name.includes('Snail') ? 'Snail Secretion Filtrate (96%), ' : ''
    }${
      product.name.includes('Vitamin C') ? 'Ascorbic Acid (Vitamin C 70%), ' : ''
    }${
      product.name.includes('Niacinamide') ? 'Niacinamide (10%), Zinc PCA (1%), ' : ''
    }${
      product.name.includes('Centella') ? 'Centella Asiatica Extract (100%), ' : ''
    }Butylene Glycol, Sodium Hyaluronate, Glycerin, Panthenol, Allantoin, Carbomer, Arginine, Disodium EDTA, Ethylhexylglycerin, Phenoxyethanol`,
    'toner': `Aqua/Water, Glycerin, Butylene Glycol, Propanediol, Niacinamide, Sodium Hyaluronate, Betaine, Panthenol, Allantoin, Centella Asiatica Extract, Tea Tree Leaf Oil, Salicylic Acid, AHA (Glycolic Acid, Lactic Acid), BHA (Betahydroxy Acid), PHA (Gluconolactone), Carbomer, Sodium Hydroxide, Disodium EDTA, 1,2-Hexanediol, Phenoxyethanol`,
    'moisturizer': `Aqua/Water, Glycerin, Cetearyl Alcohol, Sodium Hyaluronate, Caprylic/Capric Triglyceride, Butylene Glycol, Cetyl Alcohol, Squalane, Allantoin, Panthenol, Niacinamide, Tocopheryl Acetate, Dimethicone, Carbomer, Triethanolamine, Disodium EDTA, Phenoxyethanol, Ethylhexylglycerin`,
    'cleanser': `Aqua/Water, Cocamidopropyl Betaine, Sodium Cocoyl Isethionate, Glycerin, Propylene Glycol, Sodium Lauroyl Sarcosinate, Panthenol, Allantoin, Betaine, Sodium PCA, Niacinamide, Tea Tree Leaf Extract, Salicylic Acid, Disodium EDTA, Sodium Chloride, Citric Acid, Phenoxyethanol`,
    'sunscreen': `Aqua/Water, Ethylhexyl Methoxycinnamate, Zinc Oxide, Titanium Dioxide, Niacinamide, Glycerin, Butylene Glycol, Sodium Hyaluronate, Pentylene Glycol, Allantoin, Panthenol, Tocopheryl Acetate, Carbomer, Triethanolamine, Phenoxyethanol`,
    'sleeping mask': `Aqua/Water, Glycerin, Butylene Glycol, Mineral Water, Whey Protein, Beta-Glucan, Sodium Hyaluronate, Hydrolyzed Hyaluronic Acid, Phospholipids, Evening Primrose Oil, Apple Extract, Lemon Balm Leaf Extract, Dimethicone, Carbomer, Triethanolamine, Disodium EDTA, Phenoxyethanol`,
    'foundation': `Aqua/Water, Cyclopentasiloxane, Dimethicone, Titanium Dioxide, Talc, Zinc Stearate, PEG-10 Dimethicone, Niacinamide, Tocopheryl Acetate, Bisabolol, Sodium Hyaluronate, Methylparaben, Butylparaben, CI 77891, CI 77492, CI 77491, CI 77499`,
    'lipstick': `Ricinus Communis (Castor) Seed Oil, Tridecyl Trimellitate, Isopropyl Palmitate, Isododecane, Bis-Diglyceryl Polyacyladipate-2, Ozokerite, Copernicia Cerifera (Carnauba) Wax, Candelilla Cera, Beeswax, Tocopheryl Acetate, Vitamin E, Aloe Barbadensis Leaf Extract, [+/- CI 15850, CI 45410, CI 77891, CI 77742]`,
    'hair mask': `Aqua/Water, Cetearyl Alcohol, Behentrimonium Chloride, Glycerin, Coconut Oil, Argan Oil, Keratin Hydrolysate, Panthenol, Biotin, Allantoin, DMDM Hydantoin, Citric Acid, Parfum/Fragrance`,
    'shampoo': `Aqua/Water, Sodium Laureth Sulfate, Cocamidopropyl Betaine, Sodium Chloride, Panthenol (Vitamin B5), Niacinamide, Guar Hydroxypropyltrimonium Chloride, Sodium Benzoate, Citric Acid, Parfum/Fragrance, Keratin Protein`,
    'body lotion': `Aqua/Water, Glycerin, Cetearyl Alcohol, Caprylic/Capric Triglyceride, Sodium Hyaluronate, Shea Butter, Cocoa Butter, Dimethicone, Niacinamide, Tocopheryl Acetate, Allantoin, Panthenol, Phenoxyethanol, Carbomer, Triethanolamine`,
    'body scrub': `Sucrose, Walnut Shell Powder, Apricot Kernel Oil, Sodium Laureth Sulfate, Glycerin, Propylene Glycol, Panthenol, Aloe Barbadensis Leaf Juice, Vitamin E, Citric Acid, Methylparaben, Propylparaben, Fragrance/Parfum`,
    'body wash': `Aqua/Water, Sodium Laureth Sulfate, Cocamidopropyl Betaine, Glycerin, Sodium Chloride, Sodium Benzoate, Citric Acid, Parfum/Fragrance, Glycol Distearate, Laureth-4, Sodium Hyaluronate`,
    'eye care': `Aqua/Water, Glycerin, Butylene Glycol, Niacinamide, Sodium Hyaluronate, Caffeine, Peptides (Palmitoyl Tripeptide-1, Palmitoyl Tetrapeptide-7), Collagen Hydrolysate, Allantoin, Bisabolol, Centella Asiatica Extract, Carbomer, Phenoxyethanol`,
    'lip care': `Beeswax, Cera Carnauba, Petrolatum, Lanolin, Vitamin E, Shea Butter, Peppermint Oil, Castor Oil, Propolis Extract, Honey Extract`,
    'perfume': `Alcohol Denat., Parfum (Fragrance), Aqua/Water, Benzyl Benzoate, Linalool, Geraniol, Limonene, Citronellol, Hexyl Cinnamal, Amyl Cinnamal, Butylphenyl Methylpropional`,
    'contour': `Talc, Dimethicone, Mica, Synthetic Wax, Boron Nitride, Silica, Nylon-12, Phenoxyethanol, Tocopheryl Acetate, Retinyl Palmitate [+/- CI 77891, CI 77491, CI 77492, CI 77499, CI 15850]`,
    'spot treatment': `Aqua/Water, Niacinamide (5%), Salicylic Acid (2%), Tea Tree Oil (0.5%), Centella Asiatica Extract, Allantoin, Panthenol, Zinc PCA, Glycerin, Butylene Glycol, Phenoxyethanol`,
    'default': `Aqua/Water, Glycerin, Butylene Glycol, Niacinamide, Sodium Hyaluronate, Panthenol, Allantoin, Dimethicone, Carbomer, Triethanolamine, Disodium EDTA, Phenoxyethanol, Ethylhexylglycerin`,
  };

  const ingredients = ingredientMap[sub] || ingredientMap['default'];

  // How to use steps by type
  const howToUseMap: Record<string, string[]> = {
    'essence & serum': [
      'After cleansing and toning, dispense 2–3 drops onto your palm.',
      'Gently pat the serum onto your face and neck, starting from the center outward.',
      'Allow to absorb fully for 1–2 minutes before applying moisturizer.',
      'Use morning and night for best results.',
      'Always follow with SPF during the day.',
    ],
    'toner': [
      'After cleansing, dispense a small amount onto a cotton pad or into your palm.',
      'Gently swipe across your face and neck — avoid the eye area.',
      'Pat any excess into skin until fully absorbed.',
      'Follow with serum or moisturizer.',
      'For the 7-skin method, apply up to 7 thin layers for intense hydration.',
    ],
    'moisturizer': [
      'After serum has been fully absorbed, take a pea-sized amount.',
      'Warm between your fingertips and press gently onto face and neck.',
      'Use upward sweeping motions to encourage circulation.',
      'Apply morning and evening as the last step of your skincare routine.',
      'Wait 5 minutes before applying makeup or sunscreen.',
    ],
    'cleanser': [
      'Wet your face with lukewarm water.',
      'Apply a small amount to your fingertips and work into a lather.',
      'Massage gently onto face in circular motions for 30–60 seconds.',
      'Rinse thoroughly with lukewarm water.',
      'Pat dry with a clean towel. Follow with toner.',
    ],
    'sunscreen': [
      'Apply as the final step of your skincare routine, before makeup.',
      'Dispense about 2 finger-lengths of product for full face coverage.',
      'Apply evenly to face and neck, pat gently to blend.',
      'Allow to dry for 2–3 minutes before applying makeup.',
      'Reapply every 2 hours when outdoors or after sweating.',
    ],
    'sleeping mask': [
      'Use as the last step of your evening skincare routine.',
      'Apply a generous layer over your entire face and neck.',
      'Leave on overnight — do not rinse off before sleeping.',
      'Rinse off with lukewarm water in the morning.',
      'Use 2–3 times per week or as needed for intense hydration.',
    ],
    'foundation': [
      'Start with a primed, moisturized face.',
      'Apply with a brush, sponge, or your fingertips.',
      'Blend from the center of the face outward for even coverage.',
      'Build up in thin layers for more coverage if needed.',
      'Set with a powder or setting spray for longer wear.',
    ],
    'lipstick': [
      'Exfoliate and moisturize lips beforehand for best application.',
      'Outline lips with a liner for precision (optional).',
      'Apply directly from the bullet or with a lip brush.',
      'Blot with a tissue and reapply for longer-lasting color.',
      'Remove with a gentle oil-based makeup remover.',
    ],
    'shampoo': [
      'Wet hair thoroughly with warm water.',
      'Apply a coin-sized amount and work into a lather from roots to ends.',
      'Massage gently into scalp for 1–2 minutes.',
      'Rinse thoroughly with lukewarm water.',
      'Follow with a conditioner or hair mask for best results.',
    ],
    'hair mask': [
      'Shampoo hair first and squeeze out excess water.',
      'Apply mask generously from mid-lengths to ends — avoid the roots.',
      'Leave on for 5–10 minutes for deep conditioning.',
      'Rinse thoroughly with cool water.',
      'Use 1–2 times per week.',
    ],
    'body lotion': [
      'Apply to clean, dry or slightly damp skin after bathing.',
      'Massage in circular motions until fully absorbed.',
      'Focus on dry areas like elbows, knees, and heels.',
      'Use daily for best results.',
      'Allow a few minutes to absorb before dressing.',
    ],
    'body scrub': [
      'Use in the shower or bath on wet skin.',
      'Apply a generous amount and massage in circular motions.',
      'Focus on rough patches and areas prone to dryness.',
      'Rinse thoroughly with warm water.',
      'Follow with a body lotion or oil for maximum hydration.',
    ],
    'eye care': [
      'Using your ring finger (lightest pressure), dot the eye cream around the orbital bone.',
      'Gently tap — never rub — until fully absorbed.',
      'Apply morning and evening after serum, before moisturizer.',
      'Avoid applying too close to the waterline.',
      'Consistent use over 4–6 weeks shows best results.',
    ],
    'lip care': [
      'Apply a generous layer to clean, dry lips.',
      'Gently massage in using circular motions.',
      'For best results, apply before bed and leave on overnight.',
      'Reapply throughout the day as needed.',
      'Exfoliate lips weekly for smoother application.',
    ],
    'default': [
      'Read the instructions on the packaging before first use.',
      'Perform a patch test on your inner arm 24 hours before use.',
      'Apply as directed for your skin or hair type.',
      'Store in a cool, dry place away from direct sunlight.',
      'Discontinue use if irritation occurs.',
    ],
  };

  const howToUse = howToUseMap[sub] || howToUseMap['default'];

  // Benefits
  const extraBenefits: Record<string, string[]> = {
    'essence & serum': ['Boosts skin radiance and clarity', 'Strengthens the skin barrier', 'Reduces the appearance of fine lines', 'Compatible with all skin types'],
    'toner': ['Restores skin pH balance after cleansing', 'Prepares skin to absorb subsequent products', 'Minimizes the appearance of pores', 'Refreshes and revitalizes dull skin'],
    'moisturizer': ['Provides 24-hour hydration', 'Strengthens the natural skin barrier', 'Smooths skin texture over time', 'Improves skin elasticity with consistent use'],
    'sunscreen': ['Protects against UVA and UVB radiation', 'Prevents premature aging from sun exposure', 'Reduces risk of hyperpigmentation', 'Lightweight enough for daily use'],
    'sleeping mask': ['Intensive overnight repair and renewal', 'Locks in moisture throughout the night', 'Wakes up to plumper, more radiant skin', 'Packed with active ingredients for maximum absorption'],
    'default': ['Dermatologist-tested and approved', 'Suitable for daily use', 'Cruelty-free formula', 'Free from harsh chemicals'],
  };

  const allBenefits = extraBenefits[sub] || extraBenefits['default'];

  return {
    ingredients,
    howToUse,
    benefits: allBenefits,
    warnings: [
      'For external use only. Avoid contact with eyes.',
      'Discontinue use if irritation or rash develops.',
      'Keep out of reach of children.',
      'Perform a patch test before first use.',
      'Store in a cool, dry place below 25°C.',
    ],
    size: product.name.includes('100ml') ? '100 ml' : product.name.includes('200ml') ? '200 ml' : product.name.includes('50ml') ? '50 ml' : '100 ml',
    shelfLife: '24 months unopened / 12 months after opening',
    madeIn: isKorean ? 'South Korea' : product.brand === 'Neutrogena' || product.brand === 'Cetaphil' ? 'USA' : product.brand === "L'Oreal Paris" ? 'France' : 'USA',
  };
}
