import { createFormHook, createFormHookContexts } from '@tanstack/react-form';
import {
  ComboboxField,
  DatePickerField,
  NumberField,
  SelectField,
  SubmitButton,
  TextField,
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
  },
  formComponents: {
    SubmitButton,
  },
  fieldContext,
  formContext,
});
