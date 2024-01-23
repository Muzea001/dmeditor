import { useState } from 'react';

import { useEditorStore } from 'Src/core/main/store';
import { Ranger } from 'Src/core/utils/Ranger';

const Range = (props: {
  property: string;
  value: number;
  parameters: { min: number; max: number };
}) => {
  const { property, parameters } = props;
  const [value, setValue] = useState(props.value);

  const { updateSelectedBlockProps } = useEditorStore();

  const handleChange = (v: number) => {
    setValue(v);
    updateSelectedBlockProps(property, v);
  };

  return (
    <Ranger
      defaultValue={value}
      min={parameters?.min || 1}
      max={parameters?.max || 5}
      step={1}
      onChange={handleChange}
    ></Ranger>
  );
};

export default Range;