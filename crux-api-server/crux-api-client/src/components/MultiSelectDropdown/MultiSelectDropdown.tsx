import React from "react";
import {
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Checkbox,
  ListItemText,
  OutlinedInput,
} from "@mui/material";

interface MultiSelectDropdownProps {
  metrics: string[];
  selectedMetrics: string[];
  onSelect: (selected: string[]) => void;
}

const MenuProps = {
  PaperProps: {
    style: {
      width: 550,
    },
  },
};

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  metrics,
  selectedMetrics,
  onSelect,
}) => {
  const handleChange = (event: any) => {
    onSelect(event.target.value as string[]);
  };

  return (
    <div>
      <FormControl sx={{ mt: 1, mb: 1, width: "100%" }}>
        <InputLabel id="multiple-checkbox-label">Metrics</InputLabel>
        <Select
          labelId="multiple-checkbox-label"
          id="multiple-checkbox"
          multiple
          value={selectedMetrics}
          onChange={handleChange}
          input={<OutlinedInput label="Metrics" />}
          renderValue={(selected) => selected.join(", ")}
          MenuProps={MenuProps}
        >
          {metrics.map((metric) => (
            <MenuItem key={metric} value={metric}>
              <Checkbox checked={selectedMetrics.indexOf(metric) > -1} />
              <ListItemText primary={metric} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default MultiSelectDropdown;
