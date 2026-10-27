import { useId, type ComponentProps } from 'react';
import { useTranslation } from 'react-i18next';
import { Field, FieldError, FieldLabel } from '~/components/ui/field';
import { Textarea } from '~/components/ui/textarea';
import { useFieldContext } from '~/hooks/use-app-form';

type TextareaFieldProps = Omit<ComponentProps<'textarea'>, 'value' | 'onChange' | 'onBlur'> & {
  label?: string;
  required?: boolean;
};

export const TextareaField = ({ label, required, readOnly, ...props }: TextareaFieldProps) => {
  const id = useId();
  const { t } = useTranslation();
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && field.state.meta.errors.length > 0;

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
      <Textarea
        id={id}
        value={field.state.value ?? ''}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        aria-invalid={isInvalid}
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
