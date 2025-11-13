import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

const sortOptions = [
  'By Rating (High to Low)',
  'By Rating (Low to High)',
  'By Reviews (High to Low)',
  'By Reviews (Low to High)',
  'By Release Date (New to Old)',
  'By Release Date (Old to New)',
];

export default function ComboBox() {
  return (
    <Autocomplete
      disablePortal
      options={sortOptions}
      sx={{ width: 260, height: 20, marginTop: 2 }}
      renderInput={(params) => <TextField {...params} label="Sort By" size='small' />}
    />
  );
}


// Need to work with this a little more so I can use it for more complex stuff like searching for shows
// With bigger datasets, will need to figure something else out for performace