import clsx from 'clsx';
import {
  DetailedHTMLProps,
  InputHTMLAttributes,
  FormHTMLAttributes,
  LabelHTMLAttributes,
  cloneElement,
  forwardRef,
} from 'react';
import { FormState } from 'react-hook-form';

export function Form({
  children,
  ...props
}: DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>): JSX.Element {
  return <form {...props}>{children}</form>;
}

interface FormLabelProps
  extends DetailedHTMLProps<LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement> {
  name: string;
}

function FormLabel({ name, className, children, ...props }: FormLabelProps): JSX.Element {
  return (
    <label className="mb-6 flex flex-col gap-2" {...props}>
      <span className="font-semibold text-white">{name}</span>
      {children}
    </label>
  );
}

Form.Label = FormLabel;

interface FormInputProps
  extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  icon?: JSX.Element;
  error?: string;
}

function FormInput({ className, icon, error, ...props }: FormInputProps): JSX.Element {
  return (
    <div
      className={clsx(
        'flex w-full flex-row items-center justify-start rounded-md border border-gray-800 bg-gray-900 p-2 text-white focus-within:border-white focus:ring-0 focus:ring-offset-0',
        className
      )}
    >
      {icon && cloneElement(icon, {})}
      <input {...props} className={clsx('w-full bg-transparent', { 'pl-2': icon })} />
      {error && <p className="text-left text-sm text-red-500">{error}</p>}
    </div>
  );
}

// TODO: figure out how to properly forward refs for this input component
Form.Input = forwardRef(FormInput);
