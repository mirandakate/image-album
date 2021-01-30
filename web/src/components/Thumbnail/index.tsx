import React, { FunctionComponent } from 'react';
import './Thumbnail.scss';

interface ThumbnailProps {
	src: string;
	fileName: string;
	albumName: string;
	selected: boolean;
	onClick?: () => void;
}

export const Thumbnail: FunctionComponent<ThumbnailProps> = ({
	src,
	fileName,
	albumName,
	selected,
	onClick,
}) => {
	return (
		<div className={`item ${selected ? 'selected' : ''}`}>
			{selected && <input type='checkbox' checked={selected} />}
			<div className='image-container' onClick={onClick}>
				<img src={src} />
			</div>
			<p className='file-name'>{fileName}</p>
			<p className='album'>{albumName}</p>
		</div>
	);
};
