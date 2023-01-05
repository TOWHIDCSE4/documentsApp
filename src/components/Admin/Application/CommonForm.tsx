import React, { FC, useState, useEffect } from "react";
import {
	InputNumber,
	FieldLabel,
	ImageUploader,
	DragDrop,
} from "@src/components/controls";
import { InboxOutlined, UploadOutlined } from "@ant-design/icons";
import { Form, Input, DatePicker, Button, Upload } from "antd";
import { Select } from "antd";
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
		// options,
		defaultValue,
		validation,
		col,
		position,
		list,
	} = formField || {};

	// useEffect(() => {
	// 	setValue(fieldName, defaultValue);
	// }, [formField, setValue]);

	if (inputType === "textInput") {
		return (
			<Form.Item name={fieldName} label={label}>
				<Input
					// control={control}
					name={"data.firstName"}
					type={"text"}
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
	} else if (inputType === "numberInput") {
		return (
			<div>
				<Form.Item name={fieldName} label={label}>
					<Input
						// control={control}
						name={"data.numberInput"}
						type={"number"}
						size="large"
					/>
				</Form.Item>
			</div>
		);
	} else if (inputType === "textAreaInput") {
		return (
			<div>
				<Form.Item name={fieldName} label={label}>
					<Input
						// control={control}
						name={"data.textAreaInput"}
						type={"text"}
						size="large"
					/>
				</Form.Item>
			</div>
		);
	} else if (inputType === "selectInput") {
		let options: any = [];

		if (list?.sourceType === "manual") {
			const optionData = list?.listSource?.split(", ");
			options = optionData?.map((item: any) => {
				return { label: item, value: item };
			});
		}

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
	} else if (inputType === "dateTimeInput") {
		return (
			<div>
				<Form.Item name={fieldName} label={label}>
					<DatePicker name={"data.dateTimeInput"} />
				</Form.Item>
			</div>
		);
	} else if (inputType === "fileInput") {
		return (
			<Form.Item>
				<Form.Item
					name={fieldName}
					label={label}
					// control={control}
					// onRemoveFile={() => {}}
					// noStyle
				>
					<Upload.Dragger name={fieldName} action="/upload.do">
						<p className="ant-upload-drag-icon">
							<InboxOutlined />
						</p>
						<p className="ant-upload-text">Upload Picture</p>
						{/* <p className="ant-upload-hint">Single </p> */}
					</Upload.Dragger>
				</Form.Item>
			</Form.Item>
		);
	} else {
		return <></>;
	}
};
