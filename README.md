# base_ts

Monorepo starter TypeScript full-stack theo kiến trúc **Clean Architecture** ở backend và **React 19 + Vite** ở frontend. Dùng chung schema và type qua package `shared`.

## Tech Stack

| Phần       | Công nghệ chính                                                                  |
| ---------- | -------------------------------------------------------------------------------- |
| Monorepo   | pnpm workspace (`fe`, `be`, `shared`) + catalog deps                             |
| Frontend   | React 19, Vite 8, React Router 8, TanStack Query & Form, Zustand, Tailwind CSS 4 |
| Backend    | Node.js (ESM), Express 5, JWT, argon2, helmet, cors, i18next                     |
| Shared     | Zod schemas + inferred types, constants dùng chung FE/BE                         |
| Ngôn ngữ   | TypeScript                                                                       |
| Chất lượng | ESLint, Prettier, Husky, commitlint (Conventional Commits), lint-staged          |

> Backend hiện dùng `InMemoryUserRepository` (dữ liệu seed trong bộ nhớ). Các script Prisma/DB và biến môi trường SMTP đã có sẵn chỗ nhưng còn comment, sẵn sàng bật khi cần.

## Cấu trúc dự án

```
base_ts/
├── fe/                 # Frontend — React + Vite
├── be/                 # Backend — Express (Hexagonal Architecture)
├── shared/             # Package dùng chung (schemas, types, constants)
├── pnpm-workspace.yaml # Khai báo workspace + catalog version
├── commitlint.config.ts
├── lint-staged.config.ts
└── prettier.config.ts
```

### `shared/` — Code dùng chung FE & BE

Export qua `shared/schemas/*`, `shared/types/*`, `shared/constants/*`.

```
shared/src/
├── schemas/        # Zod schemas (loginSchema, changePasswordSchema, ...)
│   └── auth.ts
├── types/          # TypeScript types suy ra từ schema
│   ├── api.ts      # ApiResponse<T>, Pagination
│   └── auth.ts
└── constants/
    ├── actions.ts     # Hằng số action (permission)
    └── endpoints.ts   # Hằng số đường dẫn endpoint
```

### `be/` — Backend (Clean Architecture)

Mỗi module được chia theo 4 lớp theo **Clean Architecture**:

- **domain/** — Entities + Port interfaces (không phụ thuộc framework)
- **application/** — Use Cases (chỉ phụ thuộc port, không biết implementation cụ thể)
- **infrastructure/** — Adapters (implement các port: repository, hasher, token service, ...)
- **presentation/** — Controllers, middlewares, composition root

Composition root (`*.composition.ts`) là nơi duy nhất lắp ghép adapter cụ thể vào use case (Dependency Injection), nên có thể đổi `InMemoryUserRepository` sang `PrismaUserRepository` sau này mà không ảnh hưởng các lớp còn lại.

```
be/src/
├── app.ts              # Khởi tạo Express app + pipeline middleware + mount module
├── server.ts           # Bootstrap HTTP server
├── router/
│   └── index.ts        # buildModules(): danh sách module + path + isPublic
├── types/
│   └── express.d.ts    # Mở rộng kiểu Request của Express
├── modules/
│   └── auth/
│       ├── domain/             # Entity + port (interface), không phụ thuộc framework
│       │   ├── user.entity.ts
│       │   ├── user.repository.ts   # Port repository
│       │   ├── password-hasher.ts   # Port hash mật khẩu
│       │   └── token-service.ts     # Port JWT
│       ├── application/        # Use case + DTO (chỉ phụ thuộc port)
│       │   ├── dto.ts
│       │   ├── login.usecase.ts
│       │   ├── refresh.usecase.ts
│       │   └── change-password.usecase.ts
│       ├── infrastructure/     # Adapter cụ thể (implement port)
│       │   ├── argon2-password.hasher.ts
│       │   ├── jwt-token.service.ts
│       │   └── in-memory-user.repository.ts
│       └── presentation/       # Controller, composition root, middleware
│           ├── auth.controller.ts
│           ├── auth.composition.ts  # Composition root: wiring DI
│           └── middlewares/
│               └── authenticate.ts  # Xác thực JWT Bearer
└── shared/
    ├── domain/
    │   ├── app-error.ts        # AppError + static factory (unauthorized, notFound, ...)
    │   └── error-codes.ts
    ├── application/
    │   └── translator.ts       # Port dịch thuật (i18n)
    ├── infrastructure/
    │   ├── env.ts              # dotenv + Zod validate biến môi trường
    │   └── i18n/
    │       ├── i18next.ts
    │       ├── i18next.translator.ts   # Adapter translator
    │       └── locales/{en,vi}/{auth,common}.json
    └── presentation/
        ├── api-response.ts     # Envelope response thống nhất
        ├── http-status.ts
        ├── cors.config.ts
        ├── helmet.config.ts
        └── middlewares/        # error-handler, language-detector,
                                # not-found-handler, request-validator
```

### `fe/` — Frontend (React + Vite)

```
fe/src/
├── main.tsx            # Entry point
├── App.tsx
├── index.css
├── apis/               # Hàm gọi API theo domain
│   └── auth.ts
├── router/
│   ├── index.tsx       # createBrowserRouter (React Router)
│   └── guards/         # protected.tsx (yêu cầu đăng nhập), rejected.tsx (chỉ cho khách)
├── views/
│   ├── layouts/        # auth (card căn giữa), sidebar (shell có sidebar)
│   └── pages/          # login, profile (+ change-password), version-history
├── components/
│   ├── ui/             # UI primitive (shadcn-style)
│   ├── app-input/      # Field bind với TanStack Form (TextField, SubmitButton)
│   ├── app-sidebar.tsx, site-header.tsx, nav-main.tsx, nav-secondary.tsx
│   ├── language-switcher.tsx, theme-toggle.tsx, user-option.tsx
├── hooks/
│   ├── mutations/      # use-auth.ts (mutation hook theo domain)
│   ├── use-app-form.ts, use-app-mutation.ts, use-theme.ts, use-mobile.ts
├── stores/             # Zustand: auth.ts, theme.ts (persist)
├── lib/                # axios.ts (interceptor + refresh queue), http-client.ts, utils.ts
├── configs/            # app.ts (biến môi trường), menu.ts (cấu trúc sidebar)
├── constants/          # paths.ts, languages.ts, storage-keys.ts
├── content/            # changelog.md
├── i18n/               # Setup i18next + locales {en,vi,ja}/{auth,common,navigation}.json
└── assets/             # Ảnh, cờ ngôn ngữ (SVG)
```

## Bắt đầu

### Yêu cầu

- Node.js (xem `.nvmrc`)
- pnpm

### Cài đặt

```bash
pnpm install
```

### Chạy phát triển

```bash
# Backend (tsx watch, mặc định NODE_ENV=development)
pnpm --filter be dev

# Frontend (Vite dev server)
pnpm --filter fe dev
```

### Build

```bash
pnpm --filter fe build   # tsc -b + vite build
pnpm --filter be build   # tsc + tsc-alias (giải path alias)
```

### Lint & Format

```bash
pnpm --filter fe lint
pnpm --filter be lint
pnpm format        # Prettier ghi đè toàn repo
pnpm format:check  # Chỉ kiểm tra
```

## Biến môi trường

### Backend (`be/.env.{NODE_ENV}`)

Được validate bằng Zod lúc khởi động (`src/shared/infrastructure/env.ts`); sai cấu hình sẽ dừng tiến trình kèm mô tả lỗi.

| Biến               | Mô tả                            |
| ------------------ | -------------------------------- |
| HOST               | URL host (vd `http://localhost`) |
| PORT               | Cổng server (1–65535)            |
| JWT_SECRET         | Khóa ký access token             |
| JWT_REFRESH_SECRET | Khóa ký refresh token            |
| JWT_ACCESS_EXPIRY  | TTL access token (vd `15m`)      |
| JWT_REFRESH_EXPIRY | TTL refresh token (vd `7d`)      |

### Frontend (`fe/.env` hoặc `.env.local`)

| Biến                    | Mô tả                                     |
| ----------------------- | ----------------------------------------- |
| VITE_MAIN_API           | URL gốc API backend                       |
| VITE_EMPLOYEE_IMAGE_URL | URL gốc ảnh nhân viên (không có `/` cuối) |
| VITE_APP_VERSION        | Phiên bản app (semver)                    |
| VITE_PORT               | Cổng dev server (mặc định 5173)           |

## Quy ước

- **Commit**: Conventional Commits (`feat`, `fix`, `docs`, `refactor`, ...) với scope `fe`/`be`, kiểm tra bởi commitlint + Husky.
- **Response envelope** (BE): `{ success, message, data, pagination? }` cho thành công; `{ success: false, message, errorCode, metadata? }` cho lỗi.
- **i18n**: không hardcode chuỗi hiển thị; dùng key namespaced (vd `auth:validation.*`). Ngôn ngữ fallback là tiếng Việt.
- **Validation**: schema Zod đặt trong `shared/` để FE và BE dùng chung logic lẫn type.
- **Path alias**: `~` trỏ tới `src/` ở cả FE và BE.
- **Naming**: file kebab-case, component PascalCase, hook `useX`, hằng số UPPER_SNAKE_CASE.

```

```
