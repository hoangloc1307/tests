import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { ResolveUserRolePermissionsService } from '~/modules/auth/application/resolve-user-role-permissions.service';
import { hasPermission } from '~/modules/auth/domain/permission-matcher';
import { AppError } from '~/shared/domain/app-error';
import { container } from '~/shared/infrastructure/di/container';

export const authorize = (feature: string, action: string): RequestHandler => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const username = req.user?.username;
    const vnnToken = req.user?.vnnToken;

    if (!username || !vnnToken) {
      next(AppError.unauthorized('auth:unauthorized'));
      return;
    }

    try {
      const service = container.resolve(ResolveUserRolePermissionsService);
      const { userRoles, rolePermissionByRoleId } = await service.execute(username, vnnToken);

      // Các roleId có permission khớp feature:action.
      const grantedRoleIds = new Set(
        [...rolePermissionByRoleId.entries()]
          .filter(([, info]) => hasPermission(info.permissions, feature, action))
          .map(([roleId]) => roleId),
      );

      // Các section (unique) mà role qua được quyền được gán.
      const sections = [
        ...new Set(
          userRoles.filter((role) => grantedRoleIds.has(role.roleId)).map((role) => role.sectionId),
        ),
      ];

      if (sections.length === 0) {
        next(AppError.forbidden('auth:forbidden'));
        return;
      }

      req.authContext = { sections };
      next();
    } catch (error) {
      next(error);
    }
  };
};
