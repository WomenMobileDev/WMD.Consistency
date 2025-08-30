declare module 'react-native-toast-message' {
	
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

	interface ToastComponent {
		(props?: any): JSX.Element;
		show: (props: ToastProps) => void;
		hide: () => void;
	}

	const Toast: ToastComponent;
	export default Toast;
}
