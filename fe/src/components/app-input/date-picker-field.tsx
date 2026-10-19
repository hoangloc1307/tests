import { IconCalendar } from '@tabler/icons-react';
import { format, parse } from 'date-fns';
import { enUS, ja, vi } from 'date-fns/locale';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '~/components/ui/button';
import { Calendar } from '~/components/ui/calendar';
import { Field, FieldError, FieldLabel } from '~/components/ui/field';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import { useFieldContext } from '~/hooks/use-app-form';
import { cn } from '~/lib/utils';

const localeMap = {
  vi,
  en: enUS,
  ja,
} as const;

type DatePickerFieldProps = {
  label?: string;
  required?: boolean;
  placeholder?: string;
  onChange?: (value: string | null) => void;
};

export const DatePickerField = ({
  label,
  required,
  placeholder,
  onChange,
}: DatePickerFieldProps) => {
  const id = useId();
  const { t, i18n } = useTranslation();
  const field = useFieldContext<string | null>();
  const isInvalid = field.state.meta.isTouched && field.state.meta.errors.length > 0;

  const locale = localeMap[i18n.language as keyof typeof localeMap] ?? vi;

  const dateValue = field.state.value
    ? parse(field.state.value, 'yyyyMMdd', new Date())
    : undefined;

  const handleSelect = (date: Date | undefined) => {
    const value = date ? format(date, 'yyyyMMdd') : null;
    field.handleChange(value);
    onChange?.(value);
  };

  return (
    <Field data-invalid={isInvalid} className='gap-1'>
      <FieldLabel
        htmlFor={id}
        className={required ? "after:text-destructive after:-ml-1 after:content-['*']" : undefined}
      >
        {label}
      </FieldLabel>
      <Popover>
        <PopoverTrigger
          render={
            <Button
              id={id}
              type='button'
              variant='outline'
              className={cn(
                'text-popover-foreground h-8 w-full justify-start px-2.5 text-left font-normal',
                !field.state.value && 'text-muted-foreground',
              )}
              onBlur={field.handleBlur}
              aria-invalid={isInvalid}
            />
          }
        >
          <IconCalendar className='mr-2 size-4' />
          {field.state.value
            ? format(dateValue!, 'dd/MM/yyyy')
            : (placeholder ?? t('common:selectDate'))}
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0' align='start'>
          <Calendar
            mode='single'
            captionLayout='dropdown'
            selected={dateValue}
            onSelect={handleSelect}
            startMonth={new Date(2000, 0)}
            endMonth={new Date(2050, 11)}
            locale={locale}
          />
        </PopoverContent>
      </Popover>
      {isInvalid && <FieldError>{t(field.state.meta.errors[0].message)}</FieldError>}
    </Field>
  );
};
