import React, { FunctionComponent } from 'react';
import './Nav.scss';

interface NavProps {
	title: string;
	children?: React.ReactNode;
}

export const Nav: FunctionComponent<NavProps> = ({ title, children }) => {
	return (
		<div className='nav'>
			<h1>{title}</h1>
			{children}
		</div>
	);
};
