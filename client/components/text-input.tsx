import React from "react";

type TextInputProps = {
  id: string;
  name: string;
  label: string;
  required: boolean;
  value: string;
  type?: "email" | "text" | "password";
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const TextInput = (props: TextInputProps) => {
  return (
    <div className="form-group">
      <label htmlFor={props.name}>{props.label}</label>
      <input
        id={props.id}
        name={props.name}
        type={props.type || "text"}
        className="form-control"
        required
        value={props.value}
        onChange={props.onChange}
      />
    </div>
  );
};
