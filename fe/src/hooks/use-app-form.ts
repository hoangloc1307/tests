import { createFormHook, createFormHookContexts } from '@tanstack/react-form';
import { ComboboxField, DatePickerField, SubmitButton, TextField } from '~/components/app-input';

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

export const { useAppForm } = createFormHook({
  fieldComponents: {
    TextField,
    ComboboxField,
    DatePickerField,
  },
  formComponents: {
    SubmitButton,
  },
  fieldContext,
  formContext,
});
