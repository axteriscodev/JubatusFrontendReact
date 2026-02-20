import FormLabel from './FormLabel';
import FormError from './FormError';
import FormField from './FormField';
import FormGroup from './FormGroup';
import FormControl from './FormControl';
import FormSelect from './FormSelect';
import FormCheck from './FormCheck';

export { FormLabel, FormError, FormField, FormGroup, FormControl, FormSelect, FormCheck };

// Default export for Form namespace
const Form = {
  Label: FormLabel,
  Error: FormError,
  Field: FormField,
  Group: FormGroup,
  Control: FormControl,
  Select: FormSelect,
  Check: FormCheck,
};

export default Form;
