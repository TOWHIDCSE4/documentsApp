import React, { FC, useState, useEffect } from "react";
import {
	InputNumber,
	FieldLabel,
	ImageUploader,
	DragDrop,
} from "@src/components/controls";
import { InboxOutlined, UploadOutlined } from '@ant-design/icons';
import { Form, Input, DatePicker, Button, Upload, message } from "antd";
import { Select } from "antd";
import axios from 'axios';
import formidable from "formidable";
import fs from "fs";
import documentService from "@root/src/services/documentService";
const { TextArea } = Input;
interface CommonFormProps {
	formField: any;
	form: any;
}
export const CommonForm: FC<CommonFormProps> = ({ formField, form }) => {
	// const { control, setValue } = useFormContext();
	const {
		fieldName,
		label,
		inputType,
		// options,
		defaultValue,
		isDisabled,
		validations,
		col,
		position,
		list,
	} = formField || {};


  const [isUploaded, setIsUploaded] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File>();

  const handleImagePreview = (e) => {
	e.preventDefault();
	setIsUploaded(false)
  }

  const onChangeImage = async (info, field) => {
		try {
			const formData = new FormData();
			const { status } = info.file;
			if (status !== 'uploading') {
			}
			if (status === 'done') {
			message.success(`${info.file.name} file uploaded successfully.`);
			} else if (status === 'error') {
			message.error(`${info.file.name} file upload failed.`);
			}
			formData.append('profileImg', info.file.originFileObj)
			const res = await axios.post("http://localhost:3333/upload", formData, {
			}).then(res => {
				return res.data.profileImg
			})
			
			console.log(res, field, form.getFieldsValue())
			form.setFieldsValue({ [field]: res });
		  } catch (error: any) {
			console.error(error.response?.data);
		  }
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
						disabled={isDisabled}
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
		
		
				{/* {isUploaded && (<div className="container">
				<img src={selectedImage} alt="my image" className="image" />
				<div className="middle">
					<button className="button-text" onClick={handleImagePreview}>&#10060;</button>
				</div>
				</div>)} */}
							
				<Form.Item
					name={fieldName} label={label}
					noStyle>
					<Upload.Dragger name={fieldName} onChange={(info) => onChangeImage(info, fieldName)} onDrop={onDropImage} onPreview={handlePreview} maxCount={1} showUploadList={false} listType="picture-card">
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