export const PERMISSIONS = {
  USER: {
    CREATE: "user:create",
    VIEW: "user:view",
    UPDATE: "user:update",
    DELETE: "user:delete",
  },
  CATEGORY: {
    CREATE: "category:create",
    VIEW: "category:view",
    UPDATE: "category:update",
    DELETE: "category:delete",
  },
  SUBCATEGORY: {
    CREATE: "subcategory:create",
    VIEW: "subcategory:view",
    UPDATE: "subcategory:update",
    DELETE: "subcategory:delete",
  },
  PRODUCT: {
    CREATE: "product:create",
    VIEW: "product:view",
    UPDATE: "product:update",
    DELETE: "product:delete",
  },
} as const;
