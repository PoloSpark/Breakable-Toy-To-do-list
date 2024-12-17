import { useState } from 'react';
import { Box, Button, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const HeaderFilters = ({ filters, onFilterChange }: { filters: any, onFilterChange: any }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setLocalFilters((prev: any) => ({ ...prev, [name as string]: value as string }));
  };

  const applyFilters = () => {
    onFilterChange(localFilters);
  };

  const clearFilters = () => {
    const cleared = { name: '', priority: '', status: '' };
    setLocalFilters(cleared);
    onFilterChange(cleared);
  };

  return (
    <Box display="flex" gap={2} alignItems="center">
      <TextField
        label="Name"
        name="name"
        value={localFilters.name}
        onChange={handleChange}
      />
      <FormControl>
        <InputLabel>Priority</InputLabel>
        <Select
          name="priority"
          value={localFilters.priority}
          onChange={() => handleChange}
        >
          <MenuItem value="">None</MenuItem>
          <MenuItem value="LOW">LOW</MenuItem>
          <MenuItem value="MEDIUM">MEDIUM</MenuItem>
          <MenuItem value="HIGH">HIGH</MenuItem>
        </Select>
      </FormControl>
      <FormControl>
        <InputLabel>Status</InputLabel>
        <Select
          name="status"
          value={localFilters.status}
          onChange={() => handleChange}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="true">Done</MenuItem>
          <MenuItem value="false">Undone</MenuItem>
        </Select>
      </FormControl>
      <Button variant="contained" onClick={applyFilters}>
        Search
      </Button>
      <Button variant="outlined" onClick={clearFilters}>
        Clear
      </Button>
    </Box>
  );
};

export default HeaderFilters;
