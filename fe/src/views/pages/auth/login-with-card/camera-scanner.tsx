import { useRef } from 'react';
import { useZxing } from 'react-zxing';

export function CameraScanner({ onScan }: { onScan: (value: string) => Promise<void> }) {
  const scannedRef = useRef(false);

  const { ref } = useZxing({
    trySkew: true,
    timeBetweenDecodingAttempts: 100,
    constraints: {
      video: {
        facingMode: 'environment',
        width: { ideal: 1920 },
        height: { ideal: 1080 },
      },
      audio: false,
    },
    onDecodeResult: (result) => {
      const value = result.rawValue;
      if (value && !scannedRef.current) {
        scannedRef.current = true;
        onScan(value);
      }
    },
  });

  return (
    <div className='aspect-video overflow-hidden rounded-xl bg-black'>
      <video ref={ref} className='size-full object-cover' />
    </div>
  );
}
