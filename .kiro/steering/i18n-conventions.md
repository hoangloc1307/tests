---
inclusion: auto
name: i18n Conventions
description: Quy ước dùng i18n (react-i18next) ở frontend. Áp dụng khi thêm/sửa text đa ngôn ngữ, gọi useTranslation, hàm t(), hoặc chỉnh file locale JSON.
---

# Quy ước i18n (frontend)

## Nguyên tắc cốt lõi: luôn dùng `ns:key`, không truyền namespace vào `useTranslation`

Khi dịch, **không** truyền namespace vào `useTranslation`. Luôn gọi `useTranslation()` không tham số, rồi chỉ định namespace ngay trong key theo dạng `ns:key`.

```tsx
// ✅ Đúng
const { t } = useTranslation();
t('issue:section');
t('task:detail.title');
t('common:save');

// ❌ Sai — không truyền namespace vào useTranslation
const { t } = useTranslation('issue');
t('section');
```

### Vì sao

- Một component thường dùng text từ nhiều namespace (`common`, `navigation`, và namespace của trang). Truyền một namespace vào `useTranslation` rồi lại phải prefix thủ công cho các namespace khác (`t('common:...')`) gây lẫn lộn: cùng một file có key có prefix, key không prefix.
- Dạng `ns:key` khiến **mọi** key tự mô tả rõ nó thuộc namespace nào, đọc là biết, không phụ thuộc tham số ở `useTranslation`.
- `defaultNS` là `common`, nên key không prefix sẽ được hiểu là `common:`. Để nhất quán, **vẫn ghi rõ `common:`** thay vì bỏ trống.

## Cấu hình liên quan

- Config tại `fe/src/i18n/index.ts`: `ns: ['common', 'auth', 'navigation', 'issue', 'task']`, `defaultNS: 'common'`.
- File locale: `fe/src/i18n/locales/<lng>/<ns>.json` cho mỗi ngôn ngữ (`vi`, `en`, `ja`).
- Thêm một namespace mới: tạo file `<ns>.json` cho **tất cả** ngôn ngữ và thêm tên namespace vào mảng `ns` trong config.

## Quy tắc khi thêm/sửa text

1. `useTranslation()` gọi không tham số (chỉ lấy `t`, và `i18n` nếu cần đổi ngôn ngữ/đọc `i18n.language`).
2. Mọi lời gọi `t()` dùng `t('ns:key')` — kể cả namespace `common`.
3. Với `<Trans>`, dùng `i18nKey='ns:key'` và **không** truyền prop `ns` riêng.
4. Khi thêm key mới, thêm vào file locale của **cả ba** ngôn ngữ (`vi`, `en`, `ja`) để tránh thiếu bản dịch.
5. Key động vẫn giữ prefix: `t(\`issue:category_options.${value}\`)`.
