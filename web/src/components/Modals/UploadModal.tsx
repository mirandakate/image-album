import React, { FunctionComponent, useState } from 'react';
import { Modal } from 'antd';
import { FileUpload } from '../index';
import { CloudUploadOutlined } from '@ant-design/icons';
import './UploadModal.scss';

interface UploadModalProps {
	show: boolean;
	onSubmit?: (event: any) => void;
	onCancel?: (event: any) => void;
	preview: any;
	setPreview: any;
}

export const UploadModal: FunctionComponent<UploadModalProps> = ({
	show,
	onSubmit,
	onCancel,
	preview,
	setPreview,
}) => {
	const [selectedAlbum, setSelectedAlbum] = useState<any>();
	return (
		<Modal
			className='upload-modal'
			title='Upload photos'
			visible={show}
			onCancel={onCancel}
			footer={null}
			width={720}>
			<form onSubmit={onSubmit}>
				<FileUpload
					name='documents'
					onChange={(event) => {
						setPreview(
							Array.from(event.target.files as any).map((each) => {
								return {
									name: (each as any).name,
									size: (each as any).size,
									src: window.URL.createObjectURL(each),
									type: (each as any).type,
								};
							})
						);
					}}
				/>
				<aside>
					{preview.length > 0 ? (
						<>
							<h4>Files</h4>
							<div className='preview-list'>
								{preview.map((value: any) => (
									<img
										src={value.src}
										style={{ width: '100px', height: '100px' }}
									/>
								))}
							</div>
						</>
					) : (
						<h3>No files selected...</h3>
					)}
				</aside>

				<div className='modal-footer'>
					<select
						name='album'
						onChange={(e) => {
							setSelectedAlbum(e.target.value);
						}}>
						<option selected disabled>
							Select album
						</option>
						<option value='Travel'>Travel</option>
						<option value='Personal'>Personal</option>
						<option value='Food'>Food</option>
						<option value='Nature'>Nature</option>
						<option value='Other'>Other</option>
					</select>
					<button type='submit' disabled={!(selectedAlbum && preview)}>
						<CloudUploadOutlined /> Upload
					</button>
				</div>
			</form>
		</Modal>
	);
};
