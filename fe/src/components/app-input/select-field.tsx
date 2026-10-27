import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { Field, FieldError, FieldLabel } from '~/components/ui/field';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { useFieldContext } from '~/hooks/use-app-form';

type SelectFieldProps = {
  label?: string;
  required?: boolean;
  placeholder?: string;
  emptyText?: string;
  options: {
    label: string;
    value: string;
  }[];
  disabled?: boolean;
  readOnly?: boolean;
};

export const SelectField = ({
  label,
  required,
  placeholder,
  emptyText,
  options,
  disabled,
  readOnly,
}: SelectFieldProps) => {
  const id = useId();
  const { t } = useTranslation();
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && field.state.meta.errors.length > 0;
  const selectedOption = options.find((opt) => opt.value === field.state.value);

  return (
    <Field data-invalid={isInvalid} className='gap-1'>
      <FieldLabel
        htmlFor={id}
        className={
          required && !readOnly
            ? "after:text-destructive after:-ml-1 after:content-['*']"
            : undefined
        }
      >
        {label}
      </FieldLabel>
      <Select
        value={field.state.value}
        onValueChange={(val) => val && field.handleChange(val)}
        disabled={disabled}
        {...(readOnly ? { open: false } : {})}
      >
        <SelectTrigger
          id={id}
          aria-invalid={isInvalid}
          onBlur={field.handleBlur}
          hideIcon={readOnly}
          tabIndex={readOnly ? -1 : undefined}
          className={readOnly ? 'field-readonly pointer-events-none' : undefined}
        >
          <SelectValue placeholder={readOnly ? undefined : placeholder}>
            {selectedOption?.label}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{label}</SelectLabel>
            {options.length === 0 ? (
              <p className='text-muted-foreground px-2 py-4 text-center text-sm'>
                {emptyText ?? t('common:noOptions')}
              </p>
            ) : (
              options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))
            )}
          </SelectGroup>
        </SelectContent>
      </Select>
      {isInvalid && <FieldError>{t(field.state.meta.errors[0].message)}</FieldError>}
    </Field>
  );
};
