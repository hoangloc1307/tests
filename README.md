# base_ts

Monorepo starter TypeScript full-stack theo kiến trúc **Clean Architecture** ở backend và **React 19 + Vite** ở frontend. Dùng chung schema và type qua package `shared`.

## Tech Stack

| Phần       | Công nghệ chính                                                                  |
| ---------- | -------------------------------------------------------------------------------- |
| Monorepo   | pnpm workspace (`fe`, `be`, `shared`) + catalog deps                             |
| Frontend   | React 19, Vite 8, React Router 8, TanStack Query & Form, Zustand, Tailwind CSS 4 |
| Backend    | Node.js (ESM), Express 5, Prisma 7 (SQL Server), JWT, argon2, helmet, cors       |
| DI         | tsyringe (Dependency Injection container)                                        |
| Mail       | Nodemailer + Handlebars templates                                                |
| i18n       | i18next (BE & FE)                                                                |
| Shared     | Zod schemas + inferred types, constants dùng chung FE/BE                         |
| Ngôn ngữ   | TypeScript                                                                       |
| Chất lượng | ESLint, Prettier, Husky, commitlint (Conventional Commits), lint-staged          |

## Cấu trúc dự án

```
base_ts/
├── fe/                 # Frontend — React + Vite
├── be/                 # Backend — Express (Clean Architecture)
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

### `be/` — Backend (Clean Architecture + DI)

Mỗi module được chia theo 4 lớp theo **Clean Architecture**:

- **domain/** — Entities + Port interfaces (không phụ thuộc framework)
- **application/** — Use Cases (chỉ phụ thuộc port, không biết implementation cụ thể)
- **infrastructure/** — Adapters (implement các port: repository, hasher, token service, ...)
- **presentation/** — Controllers, middlewares, routes

**Dependency Injection** được quản lý bởi `tsyringe`:

- Tất cả dependencies được inject qua constructor với `@inject(TOKEN)`
- Services được đăng ký singleton trong `container.ts`
- Dễ dàng swap implementation hoặc mock khi test

```
be/src/
├── app.ts              # Khởi tạo Express app + pipeline middleware + mount module
├── server.ts           # Bootstrap HTTP server + import DI container
├── router/
│   └── index.ts        # buildModules(): danh sách module + path + isPublic
├── types/
│   └── express.d.ts    # Mở rộng kiểu Request của Express
├── modules/
│   └── auth/
│       ├── domain/             # Entity + port (interface)
│       │   ├── user.entity.ts
│       │   ├── user.repository.ts   # Port repository
│       │   ├── password-hasher.ts   # Port hash mật khẩu
│       │   └── token-service.ts     # Port JWT
│       ├── application/        # Use case + DTO (@injectable)
│       │   ├── dto.ts
│       │   ├── login.usecase.ts
│       │   ├── refresh.usecase.ts
│       │   └── change-password.usecase.ts
│       ├── infrastructure/     # Adapter cụ thể (@injectable)
│       │   ├── argon2-password.hasher.ts
│       │   ├── jwt-token.service.ts
│       │   └── prisma-user.repository.ts
│       └── presentation/       # Controller, routes
│           ├── auth.controller.ts
│           ├── auth.composition.ts  # Resolve từ DI container
│           └── middlewares/
│               └── authenticate.ts
└── shared/
    ├── domain/
    │   ├── app-error.ts        # AppError + static factory
    │   ├── error-codes.ts
    │   ├── logger.ts           # Logger interface
    │   ├── mail-service.ts     # MailService interface
    │   └── template-renderer.ts # TemplateRenderer interface
    ├── application/
    │   └── translator.ts       # Translator interface
    ├── infrastructure/
    │   ├── di/
    │   │   ├── tokens.ts       # DI tokens (Symbol)
    │   │   └── container.ts    # Register all services
    │   ├── env.ts              # dotenv + Zod validate
    │   ├── logger.ts           # PinoLogger implementation
    │   ├── prisma.ts           # Prisma client
    │   ├── i18n/
    │   │   ├── i18next.ts
    │   │   ├── i18next.translator.ts
    │   │   └── locales/{en,vi}/*.json
    │   └── mail/
    │       ├── mailer.ts           # NodemailerService
    │       ├── template-renderer.ts # HandlebarsTemplateRenderer
    │       └── templates/*.hbs     # Email templates
    └── presentation/
        ├── api-response.ts
        ├── http-status.ts
        ├── cors.config.ts
        ├── helmet.config.ts
        └── middlewares/
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
│   └── guards/         # protected.tsx, rejected.tsx
├── views/
│   ├── layouts/        # auth, sidebar
│   └── pages/          # login, profile, version-history
├── components/
│   ├── ui/             # UI primitive (shadcn-style)
│   ├── app-input/      # Field bind với TanStack Form
│   └── ...
├── hooks/
│   ├── mutations/      # mutation hooks
│   └── ...
├── stores/             # Zustand: auth.ts, theme.ts
├── lib/                # axios.ts, http-client.ts, utils.ts
├── configs/            # app.ts, menu.ts
├── constants/          # paths.ts, languages.ts, storage-keys.ts
├── i18n/               # Setup i18next + locales
└── assets/
```

## Bắt đầu

### Yêu cầu

- Node.js (xem `.nvmrc`)
- pnpm
- SQL Server (hoặc Docker)
- MailHog (optional, để test email local)

### Cài đặt

```bash
pnpm install
```

### Chạy phát triển

```bash
# Backend
pnpm --filter be dev

# Frontend
pnpm --filter fe dev

# MailHog (Docker)
docker run -d -p 1025:1025 -p 8025:8025 mailhog/mailhog
```

### Build

```bash
pnpm --filter fe build
pnpm --filter be build
```

### Database

```bash
# Pull schema từ database
pnpm --filter be db:pull

# Generate Prisma client
pnpm --filter be db:generate

# Prisma Studio
pnpm --filter be db:studio
```

### Lint & Format

```bash
pnpm --filter fe lint
pnpm --filter be lint
pnpm format
pnpm format:check
```

## Biến môi trường

### Backend (`be/.env.{NODE_ENV}`)

Được validate bằng Zod lúc khởi động; sai cấu hình sẽ dừng tiến trình kèm mô tả lỗi.

| Biến               | Mô tả                            |
| ------------------ | -------------------------------- |
| HOST               | URL host (vd `http://localhost`) |
| PORT               | Cổng server (1–65535)            |
| DATABASE_URL       | Connection string SQL Server     |
| DB_SERVER          | SQL Server host                  |
| DB_NAME            | Tên database                     |
| DB_USER            | Database user                    |
| DB_PASSWORD        | Database password                |
| JWT_SECRET         | Khóa ký access token             |
| JWT_REFRESH_SECRET | Khóa ký refresh token            |
| JWT_ACCESS_EXPIRY  | TTL access token (vd `15m`)      |
| JWT_REFRESH_EXPIRY | TTL refresh token (vd `7d`)      |
| SMTP_ENABLED       | Bật/tắt gửi mail (`true/false`)  |
| SMTP_HOST          | SMTP server host                 |
| SMTP_PORT          | SMTP port                        |
| SMTP_SECURE        | Dùng SSL (`true/false`)          |
| SMTP_USER          | SMTP username (optional)         |
| SMTP_PASS          | SMTP password (optional)         |
| SMTP_FROM          | Email gửi đi                     |

### Frontend (`fe/.env` hoặc `.env.local`)

| Biến                    | Mô tả                           |
| ----------------------- | ------------------------------- |
| VITE_MAIN_API           | URL gốc API backend             |
| VITE_EMPLOYEE_IMAGE_URL | URL gốc ảnh nhân viên           |
| VITE_APP_VERSION        | Phiên bản app (semver)          |
| VITE_PORT               | Cổng dev server (mặc định 5173) |

## Dependency Injection

Backend sử dụng `tsyringe` cho DI. Các bước để thêm service mới:

1. Tạo interface ở `domain/`:

```typescript
export interface MyService {
  doSomething(): Promise<void>;
}
```

2. Tạo implementation ở `infrastructure/`:

```typescript
@injectable()
export class MyServiceImpl implements MyService {
  constructor(@inject(TOKENS.Logger) private logger: Logger) {}

  async doSomething(): Promise<void> {
    this.logger.info('Doing something');
  }
}
```

3. Đăng ký trong `container.ts`:

```typescript
container.registerSingleton<MyService>(TOKENS.MyService, MyServiceImpl);
```

4. Inject vào nơi cần dùng:

```typescript
constructor(@inject(TOKENS.MyService) private myService: MyService) {}
```

## Gửi Email

Sử dụng Handlebars templates:

```typescript
const mailService = container.resolve<MailService>(TOKENS.MailService);

await mailService.send({
  to: 'user@example.com',
  subject: 'Reset Password',
  template: 'reset-password',
  data: {
    appName: 'My App',
    name: 'John Doe',
    code: '123456',
    expiresInMinutes: 5,
  },
});
```

Templates nằm trong `be/src/shared/infrastructure/mail/templates/*.hbs`

## Quy ước

- **Commit**: Conventional Commits (`feat`, `fix`, `docs`, `refactor`, ...) với scope `fe`/`be`, có emoji
- **Response envelope** (BE): `{ success, message, data, pagination? }` cho thành công; `{ success: false, message, errorCode, metadata? }` cho lỗi
- **i18n**: không hardcode chuỗi hiển thị; dùng key namespaced (vd `auth:validation.*`)
- **Validation**: schema Zod đặt trong `shared/` để FE và BE dùng chung
- **Path alias**: `~` trỏ tới `src/` ở cả FE và BE
- **Naming**: file kebab-case, component PascalCase, hook `useX`, hằng số UPPER_SNAKE_CASE
- **DI**: Tất cả services phải có interface ở domain layer, implementation ở infrastructure layer
