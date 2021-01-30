import React, { FunctionComponent } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileUploadProps {
	name: string;
	onChange?: (event: any) => void;
}

export const FileUpload: FunctionComponent<FileUploadProps> = ({
	name,
	onChange,
}) => {
	const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
		accept: 'image/*',
	});

	return (
		<section className='container'>
			<div {...getRootProps({ className: 'dropzone' })}>
				<input name={name} {...getInputProps()} onChange={onChange} />
				<p>Drag 'n' drop some files here, or click to select files</p>
			</div>
		</section>
	);
};
