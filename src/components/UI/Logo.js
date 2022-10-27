import { memo } from 'react';

const Logo = () => {
	return (
		<img
			src={'./images/logo-text.png'}
			alt="Logo Yayasan Al-Hidayah Baitul Hatim"
		/>
	);
};

export default memo(Logo);
