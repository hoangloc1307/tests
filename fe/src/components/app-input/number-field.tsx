import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { NumericFormat, type NumericFormatProps } from 'react-number-format';
import { Field, FieldError, FieldLabel } from '~/components/ui/field';
import { Input } from '~/components/ui/input';
import { useFieldContext } from '~/hooks/use-app-form';

type NumberFieldProps = Omit<
  NumericFormatProps,
  'value' | 'onValueChange' | 'onBlur' | 'onChange'
> & {
  label?: string;
  required?: boolean;
  min?: number;
  decimalScale?: number;
  onChange?: (value: number | null) => void;
};

export const NumberField = ({
  label,
  required,
  min,
  decimalScale = 0,
  onChange,
  readOnly,
  ...props
}: NumberFieldProps) => {
  const id = useId();
  const { t } = useTranslation();
  const field = useFieldContext<number | null>();
  const isInvalid = field.state.meta.isTouched && field.state.meta.errors.length > 0;

  const handleBlur = () => {
    if (min != null && (field.state.value == null || field.state.value < min)) {
      field.handleChange(min);
    }
    field.handleBlur();
  };

  return (
    <Field data-invalid={isInvalid} className='gap-1'>
      <FieldLabel
        htmlFor={id}
        className={required ? "after:text-destructive after:-ml-1 after:content-['*']" : undefined}
      >
        {label}
      </FieldLabel>
      <NumericFormat
        id={id}
        customInput={Input}
        value={field.state.value ?? ''}
        onValueChange={(values) => {
          const newValue = values.floatValue ?? null;
          field.handleChange(newValue);
          onChange?.(newValue);
        }}
        onBlur={handleBlur}
        aria-invalid={isInvalid}
        thousandSeparator=','
        decimalScale={decimalScale}
        readOnly={readOnly}
        tabIndex={readOnly ? -1 : undefined}
        className={readOnly ? 'field-readonly pointer-events-none' : undefined}
        {...props}
        placeholder={readOnly ? undefined : props.placeholder}
      />
      {isInvalid && <FieldError>{t(field.state.meta.errors[0].message)}</FieldError>}
    </Field>
  );
};
