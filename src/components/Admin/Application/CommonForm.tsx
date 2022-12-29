import React, { FC, useState, useEffect } from "react";
import { Input, InputNumber, DatePicker, FieldLabel, Select, ImageUploader, DragDrop,TextArea } from "@src/components/controls";
import { useFormContext } from "react-hook-form";
import { Row, Col } from "antd";
interface CommonFormProps {
  formField: any;
}
export const CommonForm: FC<CommonFormProps> = ({ formField }) => {
  const { control, setValue } = useFormContext();
  const { fieldName, label, inputType, options, defaultValue, validation, col, position } = formField || {};

  useEffect(() => {
    setValue(fieldName, defaultValue);
  }, [formField, setValue]);

  if (inputType === "textInput") {
		return (
			<div>
				<FieldLabel name={fieldName} label={label} />
				<Input
					control={control}
					name={fieldName}
					type={inputType}
					size="large"
				/>
			</div>
		);
  } else if (inputType === "numberInput") {
		return (
			<div>
				<FieldLabel name={fieldName} label={label} />
				<InputNumber control={control} name={fieldName} />
			</div>
		);
  } else if (inputType === "textAreaInput") {
		return (
			<div>
				<FieldLabel name={fieldName} label={label} />
				<TextArea control={control} name={fieldName} />
			</div>
		);
  } else if (inputType === "selectInput") {
		return (
			<div>
				<FieldLabel name={fieldName} label={label} />
				<Select control={control} name={fieldName} options={options} />
			</div>
		);
  } else if (inputType === "dateTimeInput") {
		return (
			<div>
				<FieldLabel name={fieldName} label={label} />
				<DatePicker control={control} name={fieldName} />
			</div>
		);
  } else if (inputType === "fileInput") {
		return (
			<div>
				<FieldLabel name={fieldName} label={label} />
				<DragDrop
					control={control}
					name={fieldName}
					onRemoveFile={() => {}}
				/>
			</div>
		);
  } else {
		return <></>;
  }
};