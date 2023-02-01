import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { Checkbox, FormGroup, FormControlLabel } from '@mui/material';

// ----------------------------------------------------------------------

RHFCheckbox.propTypes = {
  name: PropTypes.string,
};

export function RHFCheckbox({ name, ...other }) {
  const { control } = useFormContext();

  return (
    <FormControlLabel
      control={
        <Controller
          name={name}
          control={control}
          render={({ field }) => <Checkbox {...field} checked={field.value} />}
        />
      }
      {...other}
    />
  );
}

// ----------------------------------------------------------------------

RHFMultiCheckbox.propTypes = {
  name: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.string),
};

export function RHFMultiCheckbox({ name, options, getOptionLabel, ...other }) {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const onSelected = (option) =>
          field.value.includes(option) ? field.value.filter((value) => value !== option) : [...field.value, option];

        return (
          <FormGroup>
            {options?.map((option, index) => (
              <FormControlLabel
                key={option.name}
                control={
                  <Checkbox
                    checked={field.value.includes(option.name)}
                    onChange={() => field.onChange(onSelected(option.name))}
                  />
                }
                label={option.name}
                {...other}
              />
            ))}
          </FormGroup>
        );
      }}
    />
  );
}
