import { createFormHook, createFormHookContexts } from '@tanstack/react-form';
import {
  BooleanRadioField,
  ComboboxField,
  DatePickerField,
  NumberField,
  RadioGroupField,
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
    RadioGroupField,
    BooleanRadioField,
  },
  formComponents: {
    SubmitButton,
  },
  fieldContext,
  formContext,
});
