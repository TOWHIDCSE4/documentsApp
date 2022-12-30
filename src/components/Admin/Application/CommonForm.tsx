import React, { FC, useState, useEffect } from "react";
import {
	// Input,
	InputNumber,
	FieldLabel,
	ImageUploader,
	DragDrop,
} from "@src/components/controls";
import { useFormContext } from "react-hook-form";
import { Row, Col, Form, Input,DatePicker} from "antd";
import { Select } from 'antd';
const { TextArea } = Input;
interface CommonFormProps {
	formField: any;
}
export const CommonForm: FC<CommonFormProps> = ({ formField }) => {
	// const { control, setValue } = useFormContext();
	const {
		fieldName,
		label,
		inputType,
		options,
		defaultValue,
		validation,
		col,
		position,
	} = formField || {};

	console.log('formField', formField)


	// useEffect(() => {
	// 	setValue(fieldName, defaultValue);
	// }, [formField, setValue]);

	if (inputType === "textInput") {
		return (
			<Form.Item name={fieldName} label={label}>
				<Input
					// control={control}
					name={"data.firstName"}
					type={'text'}
					size="large"
				/>
			</Form.Item>
			// <div>
			// 	<FieldLabel name={fieldName} label={label} />
			// 	<Input
			// 		control={control}
			// 		name={fieldName}
			// 		type={inputType}
			// 		size="large"
			// 	/>
			// </div>
		);
	} 
	else if (inputType === "numberInput") {
		return (
		<div>
			<Form.Item name={fieldName} label={label}>
				<Input
					// control={control}
					name={"data.numberInput"}
					type={'number'}
					size="large"
				/>
			 </Form.Item>
		</div>
		);

	
	} 

	else if (inputType === "textAreaInput") {
		return (
			<div>
			<Form.Item name={fieldName} label={label}>
			 <Input
					// control={control}
					name={"data.textAreaInput"}
					type={'text'}
					size="large"
				/>
			 </Form.Item>
		 </div>
		);
	} 
	
	else if (inputType === "selectInput") {
		return (
			<div>
     <Form.Item name={fieldName} label={label}>
			 <Select
				// name={"data.selectInput"}
				// type={'sle'}
				size="large"
				options={options} 
				/>
			 </Form.Item>
			</div>
		);
	} 
	else if (inputType === "dateTimeInput") {
		return (
			<div>
			 {/* <Form.Item name={fieldName} label={label}> */}
			 <DatePicker
			  name={"data.dateTimeInput"}
				/>
			{/* </Form.Item> */}
			 </div>
		);
	} 

	// else if (inputType === "fileInput") {
	// 	return (
	// 		<div>
	// 			<FieldLabel name={fieldName} label={label} />
	// 			<DragDrop
	// 				control={control}
	// 				name={fieldName}
	// 				onRemoveFile={() => {}}
	// 			/>
	// 		</div>
	// 	);
	// } 
	else {
		return <></>;
	}
};