---
inclusion: auto
name: Tailwind Styling Conventions
description: Quy ước viết class Tailwind ở frontend. Áp dụng khi thêm/sửa className, style theo trạng thái (readonly, disabled, checked, invalid...), override component shadcn trong components/ui, hoặc tạo style dùng chung.
---

# Quy ước viết class Tailwind (frontend)

## 1. Không gom class vào biến/hằng chuỗi — style dùng lại thì viết `@utility`

**Không** tạo biến hay hằng chứa danh sách class (trong TS/TSX) rồi truyền vào `className`.

- Class chỉ dùng **một chỗ**: viết thẳng trong JSX.
- Bộ class **dùng lại ở nhiều chỗ**: định nghĩa `@utility` trong `fe/src/index.css` (xem mục 4), rồi dùng tên utility trong JSX. Không copy lặp lại chuỗi class dài ở từng component.

```tsx
// ❌ Sai — hằng chuỗi class trong TS
const READONLY_RADIO_CLASS = 'data-checked:bg-input-readonly ...';
<RadioGroupItem className={cn(readOnly && READONLY_RADIO_CLASS)} />

// ❌ Sai — chuỗi class dài lặp lại ở nhiều wrapper
<RadioGroupItem className='data-readonly:data-checked:border-input-readonly data-readonly:data-checked:bg-input-readonly ...' />

// ✅ Đúng — style dùng lại đưa vào @utility, JSX chỉ gọi tên
<RadioGroupItem className='radio-readonly' />
```

### Vì sao

- Đọc JSX là thấy style (class literal hoặc tên utility), không phải lần theo biến sang file khác.
- `@utility` là tính năng của Tailwind: dùng được với variant (`hover:`, `has-data-*:`...), được `cn` (tailwind-merge) nhận diện, và chỉ sửa một chỗ khi đổi style.

## 2. Style theo trạng thái: dùng variant của Tailwind, không dùng điều kiện JS

Khi component (base-ui/shadcn) đã gắn thuộc tính trạng thái lên DOM, dùng **variant** tương ứng thay cho `cond && 'class'` / `cond ? 'a' : 'b'`.

| Trạng thái trên DOM                                                 | Variant                                                                    |
| ------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `data-readonly`, `data-checked`, `data-disabled`, `data-invalid`... | `data-readonly:`, `data-checked:`, ghép được `data-readonly:data-checked:` |
| `aria-readonly`, `aria-invalid`, `aria-checked`...                  | `aria-readonly:`, `aria-invalid:`                                          |
| Phần tử con có thuộc tính                                           | `has-data-readonly:`, `has-[...]:`                                         |
| Phần tử cha / anh em có thuộc tính                                  | `group-data-*:`, `peer-data-*:`, `in-data-*:`                              |

```tsx
// ❌ Sai — điều kiện JS
<RadioGroup className={cn('flex gap-4', readOnly && 'pointer-events-none')} />
<FieldLabel className={cn('flex gap-2', readOnly && 'field-readonly')} />

// ✅ Đúng — base-ui đã gắn aria-readonly / data-readonly khi readOnly
<RadioGroup readOnly={readOnly} className='aria-readonly:pointer-events-none flex gap-4' />
<FieldLabel className='has-data-readonly:field-readonly flex gap-2' />
```

- Ưu tiên truyền **prop đúng ngữ nghĩa** (`readOnly`, `disabled`, `required`...) cho primitive để nó tự gắn thuộc tính, rồi style bằng variant.
- Chỉ dùng điều kiện JS khi **không có** thuộc tính trạng thái nào trên DOM để bám vào (vd: chọn layout theo prop `orientation` của chính wrapper).

## 3. Không sửa component shadcn trong `fe/src/components/ui/`

File trong `components/ui/` là code sinh từ shadcn — giữ nguyên để dễ cập nhật lại. Muốn đổi giao diện thì override ở **wrapper** (vd `components/app-input/*`) qua `className`.

- `cn` (package `cn`) là bản thay thế `clsx + tailwind-merge`: class truyền vào sau sẽ **thay** class xung đột cùng variant + thuộc tính (vd `data-checked:bg-x` thay `data-checked:bg-primary`).
- Nếu class override dùng variant khác với class gốc (vd `data-readonly:data-checked:` so với `data-checked:`), `cn` không gộp mà cả hai cùng tồn tại; khi đó variant ghép có specificity cao hơn nên thắng. Lưu ý bản `dark:` của class gốc có specificity ngang bằng → thêm cả bản `dark:` tương ứng.

## 4. Style dùng chung nhiều nơi: dùng `@utility` trong CSS

Bộ style lặp lại ở nhiều component (vd giao diện field chỉ xem) định nghĩa bằng `@utility` trong `fe/src/index.css`, rồi dùng như một class Tailwind bình thường — kể cả kèm variant.

```css
/* fe/src/index.css */
@utility field-readonly {
  color: var(--input-readonly);
  cursor: default;
}
```

```tsx
<FieldLabel className='has-data-readonly:field-readonly' />
```

Utility có thể tự bám vào thuộc tính trạng thái bằng nested selector, để JSX không cần điều kiện:

```css
@utility radio-readonly {
  &[data-readonly][data-checked] {
    border-color: var(--input-readonly);
    background-color: var(--input-readonly);
  }
}
```

Không thay `@utility` bằng hằng chuỗi class trong TS/TSX.

## 5. Kiểm tra sau khi thêm class mới

Với class có variant ghép, `@utility` kèm variant hoặc class override shadcn, build thử và xác nhận CSS được sinh đúng selector (vd `[data-readonly]`, `:has([data-readonly])`), vì `tsc`/ESLint không kiểm tra class Tailwind.
