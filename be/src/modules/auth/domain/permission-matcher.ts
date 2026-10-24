export const hasPermission = (
  permissions: readonly string[],
  feature: string,
  action: string,
): boolean => {
  return permissions.some((permission) => {
    const [rawFeature, rawAction] = permission.split(':');

    // Check permission có đúng format FEATURE:ACTION không
    if (rawAction === undefined) {
      return false;
    }

    if (rawFeature.trim() !== feature.trim()) {
      return false;
    }

    // Action là * thì cho phép tất cả
    const permAction = rawAction.trim();
    if (permAction === '*') {
      return true;
    }

    return permAction === action.trim();
  });
};
