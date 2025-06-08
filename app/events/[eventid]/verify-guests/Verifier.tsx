'use client';
import "@/styles/auth.css"
import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeCameraScanConfig, Html5QrcodeResult, CameraDevice } from 'html5-qrcode';
import { getAllUserEvent } from "@/app/actions/userEvents";
import { Calendar, CircleCheck, CircleX } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Html5QrCodeScannerPage ({ eventid }: { eventid: string }) {
	const router = useRouter();
	const scannerRef = useRef<Html5Qrcode | null>(null);
  	const isScannerRunningRef = useRef<boolean>(false);
	const [result, setResult] = useState<string>('');
	const [errorMsg, setErrorMsg] = useState<string>('');
   const [userEvent, setUserEvent] = useState<UserEvent | null>(null);

	useEffect(() => {
		const loadAllEvent = async () => {
			const results = await getAllUserEvent(eventid);
			setUserEvent(results ? results : null);
		}
		loadAllEvent();

    	const html5QrCode = new Html5Qrcode('qr-reader');

		// Fetch cameras with proper typing
		Html5Qrcode.getCameras()
		.then((devices: CameraDevice[]) => {
			if (devices && devices.length > 0) {
				const cameraId: string = devices[0].id;
				const config: Html5QrcodeCameraScanConfig = {
					fps: 10, qrbox: { width: 250, height: 250 },
				};

				html5QrCode.start(
					cameraId, config, 
					(decodedText: string, decodedResult: Html5QrcodeResult) => {
						console.log('Decoded:', decodedText, decodedResult);
						setResult(decodedText);
						setTimeout(() => setResult(''), 2000);
					},
					(error: any) => console.warn('QR Code scan error:', error)
				).then(() => {
              	isScannerRunningRef.current = true;
				}).catch((err: unknown) => {
					console.error('Start failed:', err);
					setErrorMsg('Camera permission denied or not supported.');
				});
			} else {
				setErrorMsg('No cameras found.');
			}
		})
		.catch((err: unknown) => {
			console.error('Camera access error:', err);
			setErrorMsg('Unable to access cameras.');
		});

		scannerRef.current = html5QrCode;

		return () => {
			// On unmount, clean up the scanner properly
			if (isScannerRunningRef.current && scannerRef.current) {
				scannerRef.current.stop()
				.then(() => {
					console.log('Scanner stopped');
					scannerRef.current?.clear();
				})
				.catch((err: unknown) => {
					console.error('Failed to stop scanner', err);
				});
			}
		};
	}, []);

	return (
      <div className="auth">
         <div className="auth-box">
            <div className="text-ml bold-700 text-center">Verify Guest Ticket</div>
            <div className="text-s text-center grey-3">{userEvent?.name}</div><br />
				<div id="qr-reader"
					style={{
						width: '100%',
						maxWidth: '400px',
						margin: 'auto',
						border: '1px solid #ccc',
						borderRadius: '8px'
					}}
				/>
				{(errorMsg !== '') && <p style={{ color: 'red' }}>⚠️ {errorMsg}</p>}
				{(result !== '') && (<>
					<div className="text-xl bold-600 text-center pd-2 dfb align-center justify-center gap-4">
						{userEvent?.guests.filter(guest => guest.ticketCode == result).length! > 0 
							? <><CircleCheck color='#fff' fill='#26c000' size={40} /> Verified</>
							: <><CircleX color='#fff' fill='#c50000' size={40} /> Not Verified</>}
					</div>
				</>)}
				<button className='xxs pd-1 pdx-2 outline-black' onClick={() => router.push(`/events/${eventid}`)}>
					<Calendar size={16} /> Back to Events Page
				</button>
				
			</div>
		</div>
	);
}
