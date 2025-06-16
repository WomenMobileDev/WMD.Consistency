declare module 'react-native-toast-message' {
	import { ComponentType } from 'react';

	export interface ToastProps {
		type?: 'success' | 'error' | 'info';
		text1?: string;
		text2?: string;
		position?: 'top' | 'bottom';
		visibilityTime?: number;
		autoHide?: boolean;
		topOffset?: number;
		bottomOffset?: number;
		onShow?: () => void;
		onHide?: () => void;
	}

	export const Toast: {
		(props: ToastProps): JSX.Element;
		show: (props: ToastProps) => void;
		hide: () => void;
	};
}
