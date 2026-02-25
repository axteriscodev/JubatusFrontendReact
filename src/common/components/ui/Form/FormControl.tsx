import React from 'react';

type FeedbackType = 'invalid' | 'valid';

export interface FormControlFeedbackProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  type?: FeedbackType;
  className?: string;
}

const FormControlFeedback = ({ children, type = 'invalid', className = '', ...props }: FormControlFeedbackProps) => {
  const typeClasses = type === 'invalid' ? 'text-danger' : 'text-success';

  return (
    <div className={`text-sm mt-1 ${typeClasses} ${className}`} {...props}>
      {children}
    </div>
  );
};

export interface FormControlProps extends Omit<React.InputHTMLAttributes<HTMLInputElement> & React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'ref'> {
  isInvalid?: boolean;
  isValid?: boolean;
  as?: 'textarea' | 'input';
  rows?: number;
  className?: string;
}

interface FormControlComponent extends React.ForwardRefExoticComponent<FormControlProps & React.RefAttributes<HTMLInputElement | HTMLTextAreaElement>> {
  Feedback: typeof FormControlFeedback;
}

const FormControlBase = React.forwardRef<HTMLInputElement | HTMLTextAreaElement, FormControlProps>(({
  type = 'text',
  value,
  onChange,
  placeholder,
  disabled = false,
  isInvalid = false,
  isValid = false,
  className = '',
  name,
  as,
  rows,
  ...props
}, ref) => {
  const baseClasses = 'w-full px-4 py-2 border-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-secondary-event/50 disabled:opacity-50 disabled:cursor-not-allowed text-black';

  const stateClasses = isInvalid
    ? 'border-red-500 text-red-500 focus:border-red-500'
    : isValid
    ? 'border-green-500 focus:border-green-500'
    : 'border-gray-300 focus:border-secondary-event';

  const inputClasses = `${baseClasses} ${stateClasses} ${className}`;

  if (as === 'textarea') {
    return (
      <textarea
        ref={ref as React.Ref<HTMLTextAreaElement>}
        value={value as string | undefined}
        onChange={onChange as React.ChangeEventHandler<HTMLTextAreaElement>}
        placeholder={placeholder}
        disabled={disabled}
        name={name}
        rows={rows ?? 3}
        className={inputClasses}
        {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
      />
    );
  }

  return (
    <input
      ref={ref as React.Ref<HTMLInputElement>}
      type={type}
      value={value as string | number | readonly string[] | undefined}
      onChange={onChange as React.ChangeEventHandler<HTMLInputElement>}
      placeholder={placeholder}
      disabled={disabled}
      name={name}
      className={inputClasses}
      {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
    />
  );
});

FormControlBase.displayName = 'FormControl';

const FormControl = FormControlBase as FormControlComponent;
FormControl.Feedback = FormControlFeedback;

export default FormControl;
