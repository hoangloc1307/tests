import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { Field, FieldError, FieldLabel, FieldTitle } from '~/components/ui/field';
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group';
import { useFieldContext } from '~/hooks/use-app-form';
import { cn } from '~/lib/utils';

type RadioGroupFieldProps = {
  label?: string;
  required?: boolean;
  options: {
    label: string;
    value: string;
  }[];
  disabled?: boolean;
  readOnly?: boolean;
  orientation?: 'horizontal' | 'vertical';
};

export const RadioGroupField = ({
  label,
  required,
  options,
  disabled,
  readOnly,
  orientation = 'horizontal',
}: RadioGroupFieldProps) => {
  const labelId = useId();
  const { t } = useTranslation();
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && field.state.meta.errors.length > 0;

  return (
    <Field data-invalid={isInvalid} className='gap-1'>
      <FieldTitle
        id={labelId}
        className={
          required && !readOnly
            ? "after:text-destructive leading-snug after:-ml-1 after:content-['*']"
            : 'leading-snug'
        }
      >
        {label}
      </FieldTitle>
      <RadioGroup
        aria-labelledby={labelId}
        value={field.state.value}
        onValueChange={(val) => val != null && field.handleChange(String(val))}
        onBlur={field.handleBlur}
        disabled={disabled}
        readOnly={readOnly}
        aria-invalid={isInvalid}
        className={cn(
          'aria-readonly:pointer-events-none',
          orientation === 'horizontal'
            ? 'flex flex-1 flex-wrap items-center gap-4'
            : 'flex flex-col gap-2',
        )}
      >
        {options.map((opt) => (
          <FieldLabel
            key={opt.value}
            className='has-data-readonly:field-readonly flex w-fit items-center gap-2 font-normal'
            data-disabled={disabled || undefined}
          >
            <RadioGroupItem
              value={opt.value}
              disabled={disabled}
              className='radio-readonly'
              onClick={() => {
                if (!readOnly && !disabled && field.state.value === opt.value) {
                  field.handleChange('');
                }
              }}
            />
            {opt.label}
          </FieldLabel>
        ))}
      </RadioGroup>
      {isInvalid && <FieldError>{t(field.state.meta.errors[0].message)}</FieldError>}
    </Field>
  );
};
