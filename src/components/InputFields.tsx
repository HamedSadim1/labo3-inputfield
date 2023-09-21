import React, { Fragment, FC, useState } from "react";

const InputFields: FC = () => {
  const [inputValue, setInputValue] = useState<string>("");

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    setInputValue(event.target.value);
  };
  return (
    <Fragment>
      <input type="text" value={inputValue} onChange={handleInputChange} />
      <input type="text" value={inputValue} onChange={handleInputChange} />
      <input type="text" value={inputValue} onChange={handleInputChange} />
      <input type="text" value={inputValue} onChange={handleInputChange} />
      <input type="text" value={inputValue} onChange={handleInputChange} />
    </Fragment>
  );
};

export default InputFields;
