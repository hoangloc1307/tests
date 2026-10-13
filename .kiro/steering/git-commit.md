---
inclusion: auto
name: Git Commit Rules
description: Quy tắc tạo git commit cho dự án này. Áp dụng mỗi khi người dùng yêu cầu commit, tạo commit, hoặc commit code.
---

# Quy tắc tạo Git Commit

Khi người dùng yêu cầu commit (ví dụ: "commit cho tôi", "commit đi", "tạo commit"), luôn tuân theo các nguyên tắc sau mà không cần hỏi lại:

## Định dạng commit message

- Tuân thủ cấu hình commitlint tại `commitlint.config.ts` (extends `@commitlint/config-conventional`, dùng `cz-git`).
- Message viết bằng **tiếng Anh**.
- **Bắt buộc dùng emoji**. Cấu hình `useEmoji: true` với `emojiAlign: 'center'`, nên emoji đặt giữa type và subject:
  - Format: `type(scope): <emoji> <subject>`
  - Ví dụ: `refactor(be): ♻️ move shared port interfaces to application layer`
- Mapping type → emoji:
  - `feat` → ✨ (`:sparkles:`)
  - `fix` → 🐛 (`:bug:`)
  - `docs` → 📝 (`:memo:`)
  - `style` → 💄 (`:lipstick:`)
  - `refactor` → ♻️ (`:recycle:`)
  - `perf` → ⚡️ (`:zap:`)
  - `test` → ✅ (`:white_check_mark:`)
  - `build` → 📦️ (`:package:`)
  - `ci` → 🎡 (`:ferris_wheel:`)
  - `chore` → 🔨 (`:hammer:`)
  - `revert` → ⏪️ (`:rewind:`)
- Scope hợp lệ: `fe`, `be` (cho phép custom scope hoặc để trống). Chọn scope dựa trên thư mục chứa thay đổi.

## Quy trình

1. Kiểm tra `git status` và `git diff` để hiểu rõ nội dung thay đổi trước khi chọn type/scope/subject.
2. Chọn `type` phù hợp với bản chất thay đổi (feat/fix/refactor/...).
3. Stage các file liên quan theo tên cụ thể (không dùng `git add .` hay `git add -A`).
4. Viết subject ngắn gọn, rõ ràng, mô tả đúng thay đổi.

## Ràng buộc bắt buộc

- **KHÔNG được bypass hook** trong mọi trường hợp. Không dùng `--no-verify` hay bất kỳ cách nào bỏ qua pre-commit / commit-msg hook.
- Nếu hook (lint-staged, eslint, prettier, commitlint) báo lỗi: sửa lỗi rồi stage lại và commit mới, không amend sau khi hook fail.
- Chỉ commit khi người dùng yêu cầu rõ ràng.
