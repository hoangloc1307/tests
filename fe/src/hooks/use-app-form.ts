import { createFormHook, createFormHookContexts } from '@tanstack/react-form';
import {
  ComboboxField,
  DatePickerField,
  NumberField,
  SelectField,
  SubmitButton,
  TextField,
  TextareaField,
} from '~/components/app-input';

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

export const { useAppForm } = createFormHook({
  fieldComponents: {
    TextField,
    ComboboxField,
    DatePickerField,
    SelectField,
    NumberField,
    TextareaField,
  },
  formComponents: {
    SubmitButton,
  },
  fieldContext,
  formContext,
});
