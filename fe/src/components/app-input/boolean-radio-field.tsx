import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { Field, FieldError, FieldLabel, FieldTitle } from '~/components/ui/field';
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group';
import { useFieldContext } from '~/hooks/use-app-form';

type BooleanRadioFieldProps = {
  label?: string;
  required?: boolean;
  trueLabel: string;
  falseLabel: string;
  disabled?: boolean;
  readOnly?: boolean;
  orientation?: 'horizontal' | 'vertical';
};

export const BooleanRadioField = ({
  label,
  required,
  trueLabel,
  falseLabel,
  disabled,
  readOnly,
  orientation = 'horizontal',
}: BooleanRadioFieldProps) => {
  const labelId = useId();
  const { t } = useTranslation();
  const field = useFieldContext<boolean | null>();
  const isInvalid = field.state.meta.isTouched && field.state.meta.errors.length > 0;

  const stringValue = field.state.value == null ? '' : String(field.state.value);

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
        value={stringValue}
        onValueChange={(val) => val != null && field.handleChange(val === 'true')}
        onBlur={field.handleBlur}
        disabled={disabled || readOnly}
        aria-invalid={isInvalid}
        className={
          orientation === 'horizontal'
            ? 'flex flex-1 flex-wrap items-center gap-4'
            : 'flex flex-col gap-2'
        }
      >
        {[
          { value: 'true', label: trueLabel },
          { value: 'false', label: falseLabel },
        ].map((opt) => (
          <FieldLabel
            key={opt.value}
            className='flex w-fit items-center gap-2 font-normal'
            data-disabled={readOnly || disabled || undefined}
          >
            <RadioGroupItem
              value={opt.value}
              disabled={disabled || readOnly}
              onClick={() => {
                if (!readOnly && !disabled && stringValue === opt.value) {
                  field.handleChange(null);
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
