---
inclusion: auto
name: Type & Schema Organization
description: Quy ước đặt type và schema trong monorepo (shared/fe/be). Áp dụng khi tạo/sửa type, interface, zod schema, DTO, định nghĩa request/response, hoặc quyết định đặt một kiểu dữ liệu ở shared/, fe/, hay be/.
---

# Quy ước tổ chức Type & Schema

Nguyên tắc cốt lõi: **phân loại theo "ai cần biết" và "có cần validate runtime không"**, không chỉ theo tên.

## 1. Input → `shared/src/schemas/*` (zod)

Dữ liệu đầu vào (request body, params, query) mà **cần validate** đặt làm **zod schema** trong `shared/src/schemas/`.

- Dùng chung cho cả FE (validate form, UX) và BE (validate request, an toàn — không tin client). Một nguồn luật duy nhất, sửa một chỗ cả hai đổi theo.
- Type suy ra bằng `z.infer<typeof xxxSchema>` sống **cùng file** với schema (ví dụ `LoginInput`, `CreateRoleInput`). Vì chúng gắn chặt với zod.
- Enum/giá trị dùng chung suy từ zod (ví dụ `DocumentType`) cũng đặt ở `shared/src/schemas/`.
- Message lỗi validation dùng key i18n (ví dụ `'auth:permission.validation.username_required'`).

## 2. Response → `shared/src/types/*` (interface)

Dữ liệu API **trả về** mà FE cần đọc/render đặt làm **interface TypeScript thuần** trong `shared/src/types/`.

- Không dùng zod cho response: BE đã validate dữ liệu trước khi trả, FE chỉ cần biết shape để render. Thêm zod runtime ở đây là thừa và tốn chi phí.
- Ví dụ: `LoginResponse`, `RoleListItem`, `TaskListItem`.
- `shared/src/types/` **chỉ chứa interface/type thuần**, tuyệt đối không chứa zod schema.
- `shared/src/schemas/` **chỉ chứa zod schema** (và các type `z.infer` đi kèm), không chứa interface response thuần.

## 3. Thứ chỉ một phía biết → đặt trong `be/` hoặc `fe/`

Nếu một kiểu dữ liệu chỉ một phía cần/được phép biết thì **không** đưa vào `shared`.

- **BE-only** → `be/src/modules/<module>/...`: ví dụ `LoginResult` chứa `refreshToken` (refresh token được set qua httpOnly cookie, FE cố tình không đọc được), `TokenPayload`, DTO nội bộ, kiểu của adapter/hệ thống ngoài (ví dụ response snake_case `access_token`/`refresh_token` của bên thứ ba).
- **FE-only** → `fe/src/...`: view model thuần client, state UI, kiểu chỉ phục vụ hiển thị.

Lưu ý quan trọng: một kiểu "response" vẫn có thể là BE-only. Ví dụ `LoginResult` (BE) là kết quả của usecase và chứa `refreshToken` — phần FE được phép thấy (`LoginResponse`) nằm ở `shared/types`, phần FE không được thấy nằm ở `be/`. Phân chia theo "ai được biết", không máy móc theo input/response.

## 4. Tránh định nghĩa trùng lặp

Khi FE và BE cần **cùng một shape response giống hệt nhau**, định nghĩa **một lần** ở `shared/src/types/` và cả hai phía import lại; không khai lại ở `be/` hay `fe/`. Trùng lặp dễ gây lệch (một nơi sửa, nơi kia quên).

- Chỉ tách định nghĩa riêng ở `be/`/`fe/` khi shape thực sự khác nhau (ví dụ BE có thêm field nhạy cảm).

## Bảng tóm tắt

| Loại dữ liệu                                   | Nơi đặt               | Dạng                   |
| ---------------------------------------------- | --------------------- | ---------------------- |
| Input cần validate (dùng chung)                | `shared/src/schemas/` | zod schema + `z.infer` |
| Response FE được phép đọc (dùng chung)         | `shared/src/types/`   | interface thuần        |
| Chỉ BE biết (token nội bộ, DTO, adapter ngoài) | `be/src/modules/<x>/` | interface/type thuần   |
| Chỉ FE biết (view model, UI state)             | `fe/src/`             | interface/type thuần   |
