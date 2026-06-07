const INTENT_SYNONYMS = {
  biryani: ["rice", "masala", "chicken", "mutton", "meal"],
  breakfast: ["brunch", "idli", "dosa", "upma", "poori"],
  cheap: ["budget", "deal", "discount", "sale", "low price"],
  deal: ["discount", "sale", "offer"],
  dessert: ["sweet", "sweets", "gulab", "jamun", "desserts"],
  drink: ["drinks", "beverage", "juice", "soda", "cold"],
  frozen: ["frozen", "parata", "vegetables"],
  healthy: ["fresh", "vegetable", "vegetables", "fruit", "organic"],
  meat: ["chicken", "mutton", "fish", "non veg", "nonveg"],
  rice: ["bowl", "biryani", "meals"],
  snack: ["snacks", "chat", "chaat", "samosa", "pani puri"],
  spicy: ["masala", "pickle", "chilli", "curry", "chat", "chaat"],
  vegetarian: ["veg", "vegetable", "vegetables", "paneer"],
};

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "for",
  "from",
  "get",
  "i",
  "item",
  "items",
  "me",
  "of",
  "show",
  "the",
  "to",
  "under",
  "with",
]);

const normalize = (value = "") =>
  String(value)
    .toLowerCase()
    .replace(/[#/_-]/g, " ")
    .replace(/[^a-z0-9.\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const tokenize = (value = "") =>
  normalize(value)
    .split(" ")
    .filter((token) => token && !STOP_WORDS.has(token));

const getSearchText = (product = {}) =>
  normalize(
    [
      product.product_name,
      product.product_category,
      product.product_description,
      product.quantity_measure,
      product.product_size,
    ].join(" ")
  );

const parsePriceLimit = (query = "") => {
  const priceMatch = normalize(query).match(
    /(?:under|below|less than|max|maximum|upto|up to|<)\s*\$?\s*(\d+(?:\.\d{1,2})?)/
  );
  return priceMatch ? Number(priceMatch[1]) : null;
};

const expandTokens = (tokens) => {
  const expanded = new Set(tokens);

  tokens.forEach((token) => {
    const synonyms = INTENT_SYNONYMS[token] || [];
    synonyms.forEach((synonym) => {
      tokenize(synonym).forEach((word) => expanded.add(word));
    });

    Object.entries(INTENT_SYNONYMS).forEach(([intent, intentSynonyms]) => {
      if (intentSynonyms.some((synonym) => tokenize(synonym).includes(token))) {
        expanded.add(intent);
      }
    });
  });

  return [...expanded];
};

const scoreProduct = (product, rawQuery) => {
  const query = normalize(rawQuery);
  const directTokens = tokenize(query);
  const expandedTokens = expandTokens(directTokens);
  const searchText = getSearchText(product);
  const productName = normalize(product.product_name);
  const category = normalize(product.product_category);
  const priceLimit = parsePriceLimit(query);

  if (!query) return 1;

  let score = 0;

  if (productName.includes(query)) score += 18;
  if (searchText.includes(query)) score += 10;

  directTokens.forEach((token) => {
    if (productName.includes(token)) score += 8;
    if (category.includes(token)) score += 6;
    if (searchText.includes(token)) score += 3;
  });

  expandedTokens.forEach((token) => {
    if (directTokens.includes(token)) return;
    if (productName.includes(token)) score += 4;
    if (category.includes(token)) score += 3;
    if (searchText.includes(token)) score += 2;
  });

  if (/\b(discount|deal|sale|offer|cheap|budget)\b/.test(query) && product.discount > 0) {
    score += 8;
  }

  if (/\b(in stock|available)\b/.test(query) && !product.outOfStock) {
    score += 5;
  }

  if (/\b(out of stock|sold out)\b/.test(query) && product.outOfStock) {
    score += 5;
  }

  if (priceLimit !== null) {
    score += Number(product.product_price) <= priceLimit ? 10 : -20;
  }

  return score;
};

export const smartFilterProducts = (products = [], options = {}) => {
  const {
    query = "",
    category = "",
    categoryMatcher,
    onlyDiscount = false,
    onlyInStock = false,
    onlyOutOfStock = false,
  } = options;

  const normalizedQuery = normalize(query);
  const normalizedCategory = normalize(category);

  return [...products]
    .map((product) => ({
      product,
      score: scoreProduct(product, normalizedQuery),
    }))
    .filter(({ product, score }) => {
      const matchesQuery = !normalizedQuery || score > 0;
      const matchesCategory = categoryMatcher
        ? categoryMatcher(product, category)
        : !normalizedCategory || normalize(product.product_category).includes(normalizedCategory);
      const matchesDiscount = !onlyDiscount || product.discount > 0;
      const matchesInStock = !onlyInStock || !product.outOfStock;
      const matchesOutOfStock = !onlyOutOfStock || product.outOfStock;

      return (
        matchesQuery &&
        matchesCategory &&
        matchesDiscount &&
        matchesInStock &&
        matchesOutOfStock
      );
    })
    .sort((left, right) => {
      if (normalizedQuery && right.score !== left.score) {
        return right.score - left.score;
      }
      return new Date(right.product.createdAt || 0) - new Date(left.product.createdAt || 0);
    })
    .map(({ product }) => product);
};

export const getRecommendedProducts = (products = [], options = {}) => {
  const {
    currentProduct = null,
    cartItems = [],
    category = "",
    limit = 6,
  } = options;

  const cartProductIds = new Set(
    cartItems.map((item) => item?.product?._id || item?.product).filter(Boolean)
  );
  const cartCategories = new Set(
    cartItems.map((item) => normalize(item?.product?.product_category)).filter(Boolean)
  );
  const currentCategory = normalize(currentProduct?.product_category || category);
  const currentCafeSubcategory = normalize(currentProduct?.product_name?.split("#")?.[1]);

  return [...products]
    .filter((product) => product?._id !== currentProduct?._id)
    .filter((product) => !cartProductIds.has(product?._id))
    .map((product) => {
      const productCategory = normalize(product.product_category);
      const productCafeSubcategory = normalize(product.product_name?.split("#")?.[1]);
      let score = 0;

      if (!product.outOfStock) score += 4;
      if (product.discount > 0) score += 3;
      if (currentCategory && productCategory === currentCategory) score += 8;
      if (currentCafeSubcategory && productCafeSubcategory === currentCafeSubcategory) score += 8;
      if (cartCategories.has(productCategory)) score += 7;
      if (Number(product.total_products) > 0) score += 1;

      return { product, score };
    })
    .filter(({ score }) => score > 0)
    .sort((left, right) => {
      if (right.score !== left.score) return right.score - left.score;
      return new Date(right.product.createdAt || 0) - new Date(left.product.createdAt || 0);
    })
    .slice(0, limit)
    .map(({ product }) => product);
};
