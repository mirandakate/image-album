import React, { useState, useEffect, useRef } from 'react';
import './App.scss';
import { Nav, Thumbnail, UploadModal } from '../src/components';
import { useRequest } from './common/hooks/useRequest';
import { DeleteOutlined, CloudUploadOutlined } from '@ant-design/icons';

function App() {
	const totalItemLoad = useRef(0);
	const [preview, setPreview] = useState<any>([]);
	const [selected, setSelected] = useState<any>([]);
	const [itemList, setItemList] = useState<any>([]);
	const [skip, setSkip] = useState<number>(0);
	const [limit, setLimit] = useState<number>(25);
	const [showUploadModal, setShowUploadModal] = useState<boolean>(false);

	const uploadRequest = useRequest('/photos', { method: 'PUT' });
	const imageListRequest = useRequest('/photos/list', { method: 'POST' });
	const deletePhotosRequest = useRequest('/photos', { method: 'DELETE' });

	useEffect(() => {
		imageListRequest
			.call({
				data: { skip, limit },
			})
			.then((response: any) => {
				totalItemLoad.current += response?.data?.documents?.length;
			});
	}, [skip, limit]);

	useEffect(() => {
		if (imageListRequest?.value?.documents) {
			setItemList((prev: any) => {
				return [...prev, ...imageListRequest?.value?.documents];
			});
		}
	}, [imageListRequest?.value?.documents]);

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		uploadRequest.call({ data: new FormData(event.target as any) }).then(() => {
			setItemList([]);
			setPreview([]);
			imageListRequest
				.call({
					data: { skip, limit },
				})
				.then((response: any) => {
					totalItemLoad.current += response?.data?.documents?.length;
				});
		});
		setShowUploadModal(false);
	};

	const handleDelete = (event: any) => {
		const listOnId = itemList.reduce((result: any, item: any) => {
			result[item.id] = item;
			return result;
		}, {});

		const albums = selected.reduce((result: any, id: string) => {
			if (!result.includes(listOnId[id].album)) {
				result.push(listOnId[id].album);
			}
			return result;
		}, []);

		const data = albums.map((album: string) => {
			const documents = selected
				.filter((id: string) => {
					return listOnId[id].album === album;
				})
				.map((id: string) => {
					return listOnId[id].name;
				})
				.join(', ');
			return { album, documents };
		});

		deletePhotosRequest.call({ data: data });
		setItemList((prev: any) => {
			return prev.filter((item: any) => !selected.includes(item.id));
		});
		setSelected([]);
	};

	const itemExceeded = totalItemLoad.current < skip + limit;

	return (
		<div className='image-album'>
			<Nav title='Photos'>
				<div>
					{selected.length > 0 && (
						<>
							<button onClick={handleDelete}>
								<DeleteOutlined />{' '}
								{`Delete ${selected.length} photo${
									(selected.length > 1 && 's') || ''
								}`}
							</button>{' '}
							<span className='divider'>|</span>
						</>
					)}
					<button
						className='link'
						onClick={() => {
							setShowUploadModal(true);
						}}>
						<CloudUploadOutlined /> Upload
					</button>
					<span className='divider'>|</span>
					{showUploadModal && (
						<UploadModal
							show={showUploadModal}
							preview={preview}
							setPreview={setPreview}
							onSubmit={handleSubmit}
							onCancel={() => {
								setShowUploadModal(false);
								setPreview([]);
							}}
						/>
					)}
					<select
						name='pageNumber'
						disabled={itemExceeded}
						onChange={(e: any) => {
							setLimit(parseInt(e.target.value));
							setSkip((prev: number) => prev + limit);
						}}
						required>
						<option value='5'>5</option>
						<option value='10'>10</option>
						<option value='25' selected>
							25
						</option>
						<option value='50'>50</option>
						<option value='100'>100</option>
						<option value='250'>250</option>
						<option value='500'>500</option>
					</select>
				</div>
			</Nav>
			<div className='content'>
				<div className={`image-list ${selected.length > 0 ? 'on-select' : ''}`}>
					{itemList?.map((item: any) => (
						<Thumbnail
							src={item.raw}
							fileName={item.name}
							albumName={item.album}
							selected={selected.includes(item.id)}
							onClick={() => {
								setSelected((prev: any) => {
									const found = prev.includes(item.id);
									if (found) {
										return prev.filter((each: any) => each !== item.id);
									} else {
										return [...prev, item.id];
									}
								});
							}}
						/>
					))}
				</div>
				{!itemExceeded && (
					<div className='load-more'>
						<button
							className='link'
							onClick={() => {
								setSkip((prev: number) => prev + limit);
							}}
							disabled={itemExceeded}>
							Load More
						</button>
					</div>
				)}
			</div>
		</div>
	);
}

export default App;
