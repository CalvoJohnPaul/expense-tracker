import {type ComponentPropsWithRef, useCallback, useEffect, useRef, useState} from 'react';
import {useMediaQuery} from 'usehooks-ts';

type CameraError = 'CameraError' | 'PermissionDeniedError' | 'DeviceNotFoundError';

export interface UseCameraReturn {
	data: File | null;
	error: CameraError | null;
	opened: boolean;
	loading: boolean;
	snapping: boolean;
	snap: () => Promise<File | null>;
	open: () => Promise<void>;
	close: () => Promise<void>;
	reopen: () => Promise<void>;
	getVideoProps: () => ComponentPropsWithRef<'video'>;
}

export interface UseCameraOptions {
	facingMode?: 'user' | 'environment';
	aspectRatio?: number;
}

export function useCamera(options?: UseCameraOptions): UseCameraReturn {
	const desktop = useMediaQuery('(min-width: 1024px)');

	const videoRef = useRef<HTMLVideoElement>(null);
	const streamRef = useRef<MediaStream | null>(null);

	const [data, setData] = useState<File | null>(null);
	const [error, setError] = useState<CameraError | null>(null);
	const [opened, setOpened] = useState(false);
	const [loading, setLoading] = useState(false);
	const [snapping, setSnapping] = useState(false);

	const open = useCallback(async () => {
		setData(null);
		setError(null);
		setOpened(false);
		setLoading(true);

		await sleep();

		const node = videoRef.current;

		if (!node) {
			setError('CameraError');
			setLoading(false);
			return;
		}

		try {
			const result = await navigator.mediaDevices.getUserMedia({
				audio: false,
				video: {
					width: {ideal: 9999},
					height: {ideal: 9999},
					facingMode: options?.facingMode ?? (desktop ? 'user' : 'environment'),
					aspectRatio: {
						exact: options?.aspectRatio ?? (desktop ? 16 / 9 : 4 / 3),
					},
					frameRate: {max: 120, ideal: 90},
					noiseSuppression: true,
				},
				preferCurrentTab: true,
			});

			node.srcObject = result;
			streamRef.current = result;

			setOpened(true);
		} catch (e) {
			if (e instanceof Error) {
				switch (e.name) {
					case 'NotAllowedError':
						return setError('PermissionDeniedError');
					case 'NotFoundError':
						return setError('DeviceNotFoundError');
					default:
						break;
				}
			}

			setError('CameraError');
		} finally {
			setLoading(false);
		}
	}, [desktop, options]);

	const close = useCallback(async () => {
		setData(null);
		setError(null);
		setOpened(false);
		setLoading(false);
		setSnapping(false);

		if (streamRef.current) {
			for (const track of streamRef.current.getTracks()) {
				track.stop();
			}

			streamRef.current = null;
		}

		if (videoRef.current) {
			videoRef.current.srcObject = null;
			videoRef.current.pause();
		}

		await sleep(100);
	}, []);

	const snap = useCallback(async (): Promise<File | null> => {
		const video = videoRef.current;

		if (!video || video.readyState < 2) {
			console.error('video not ready');
			return null;
		}

		setData(null);
		setError(null);
		setSnapping(true);

		const canvas = document.createElement('canvas');
		const context = canvas.getContext('2d', {willReadFrequently: true});

		if (!context) {
			setSnapping(false);
			console.error("'canvas.getContext' failed");
			return null;
		}

		canvas.width = video.videoWidth;
		canvas.height = video.videoHeight;

		context.drawImage(video, 0, 0, canvas.width, canvas.height);

		return new Promise((resolve) => {
			canvas.toBlob(
				(blob) => {
					if (!blob) {
						setError('CameraError');
						setSnapping(false);
						resolve(null);
						return;
					}

					const file = new File([blob], 'snapshot.jpg', {type: 'image/jpeg'});

					setData(file);
					setSnapping(false);
					resolve(file);
				},
				'image/jpeg',
				0.9,
			);
		});
	}, []);

	const reopen = useCallback(async () => {
		await close();
		await sleep();
		await open();
	}, [close, open]);

	const getVideoProps = useCallback(
		(): ComponentPropsWithRef<'video'> => ({
			ref: videoRef,
			muted: true,
			autoPlay: true,
			playsInline: true,
			preload: 'none',
			hidden: !opened,
			style: {
				width: '100%',
				height: 'auto',
				display: 'block',
				position: 'relative',
				boxSizing: 'border-box',
				background: 'transparent',
				pointerEvents: 'none',
			},
		}),
		[opened],
	);

	useEffect(() => {
		return () => {
			setData(null);
			setError(null);
			setLoading(false);
			setSnapping(false);
		};
	}, []);

	return {
		snap,
		open,
		close,
		reopen,
		data,
		error,
		opened,
		loading,
		snapping,
		getVideoProps,
	};
}

const sleep = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));
