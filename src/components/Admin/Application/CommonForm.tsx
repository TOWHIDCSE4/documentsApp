import React, { FC, useState, useEffect } from "react";
import {
	InputNumber,
	FieldLabel,
	ImageUploader,
	DragDrop,
} from "@src/components/controls";
import { InboxOutlined, UploadOutlined } from '@ant-design/icons';
import { Form, Input, DatePicker, Button, Upload } from "antd";
import { Select } from "antd";
import axios from 'axios';
import formidable from "formidable";
import fs from "fs";
import documentService from "@root/src/services/documentService";
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
		validations,
		col,
		position,
		list,
	} = formField || {};


	const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File>();
	// useEffect(() => {
	// 	setValue(fieldName, defaultValue);
	// }, [formField, setValue]);

	const onChangeImage = async (info) => {
		// try {
		// 	const data = new FormData();
		// 	console.log(document.cookie)
		// 	data.append('name','myimage');
		// 	data.append('image-file', info.file.originFileObj)
		// 	axios.post('http://localhost:3333/api/v1/file/uploads', data, {
		// 		headers:{
		// 			"Content-Type":'multipart/form-data',
		// 			'Authorization': `token ${access_token}`
		// 		}
		// 	}).then(res => console.log(res))
		//   } catch (error: any) {
		// 	console.log(error.response?.data);
		//   }
	}
	
	const onDropImage = (e) => {}
	const getFile = async (e) => {
		const result = await toBase64(e.file.originFileObj).then(res => res)
		setSelectedImage(JSON.stringify(result))
		console.log(selectedImage);
		
	    return result
	  };

	const handlePreview = async (file) => {
		
	  };

	  const toBase64 = (file: File) => new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = error => reject(error);
	  })

	if (inputType === "textInput") {
		return (
			<Form.Item name={fieldName} label={label} rules={validations?.map(element => ({
				required: true,
				message: element.message
				
			}))}>
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
				<Form.Item name={fieldName} label={label}
				 rules={validations?.map(element => ({
					required: true,
					message: element.message
					
				}))}
				>
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
					<TextArea
						showCount
						maxLength={100}
						style={{
							height: 120,
							marginBottom: 24,
						}}
					/>
				</Form.Item>
			</div>
		);
	} else if (inputType === "selectInput") {
		let options: any = [];

		if (list?.sourceType === "manual") {
			const optionData = list?.source?.split(", ");
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
				<Form.Item name={fieldName} label={label}
				 rules={validations?.map(element => ({
					required: true,
					message: element.message
					
				}))}
				>
					<DatePicker name={"data.dateTimeInput"} style={{ display: 'flex', padding: '10px 5px' }} />
				</Form.Item>
			</div>
		);
	}

	else if (inputType === "fileInput") {
		return (
		<>
			 {/* <img src="/images/default-image.png" alt="my image" style={{height:'50%',width:'100%'}}/> */}
			  
				<Form.Item
					name={fieldName} label={label}
					getValueFromEvent={getFile}
					noStyle>
					<Upload.Dragger name={fieldName} onChange={onChangeImage} onDrop={onDropImage} onPreview={handlePreview}>
						<p className="ant-upload-drag-icon">
							<InboxOutlined />
						</p>
						<p className="ant-upload-text">Upload Picture</p>
					</Upload.Dragger>
				</Form.Item>
				
				</>
		);
	}
	else {
		return <></>;
	}
};