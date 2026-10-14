import { IconBarcode, IconLogin2, IconScan } from '@tabler/icons-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useZxing } from 'react-zxing';
import { Button } from '~/components/ui/button';
import { useLoginWithCard } from '~/hooks/mutations/use-auth';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';

// Tách camera scanner ra component riêng để chỉ mount khi dialog mở
function CameraScanner({ onScan }: { onScan: (value: string) => void }) {
  const { ref } = useZxing({
    onDecodeResult: (result) => {
      const value = result.rawValue;
      if (value) {
        onScan(value);
      }
    },
  });

  return (
    <div className='aspect-square overflow-hidden rounded-lg bg-black'>
      <video ref={ref} className='size-full object-cover' />
    </div>
  );
}

export default function LoginWithCardPage() {
  const { t } = useTranslation();
  const { mutateAsync, isPending } = useLoginWithCard();
  const inputRef = useRef<HTMLInputElement>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cardNumber, setCardNumber] = useState('');

  // Focus hidden input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Re-focus when dialog closes
  useEffect(() => {
    if (!cameraOpen) {
      inputRef.current?.focus();
    }
  }, [cameraOpen]);

  // Always keep focus on hidden input when not in camera mode
  const handleBlur = useCallback(() => {
    if (!cameraOpen) {
      // Delay để tránh conflict với dialog trigger
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }, [cameraOpen]);

  // Re-focus when clicking on scan area
  const handleScanAreaClick = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  // Handle scanner input (barcode scanner sends data as keystrokes ending with Enter)
  const handleKeyDown = useCallback(
    async (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && cardNumber.trim()) {
        e.preventDefault();
        await mutateAsync({ cardNumber: cardNumber.trim() });
        setCardNumber('');
      }
    },
    [mutateAsync, cardNumber],
  );

  // Handle camera scan result
  const handleCameraScan = useCallback(
    async (value: string) => {
      setCameraOpen(false);
      await mutateAsync({ cardNumber: value });
    },
    [mutateAsync],
  );

  return (
    <div className='p-6 md:p-8'>
      <div className='flex flex-col items-center gap-2 text-center'>
        <h2 className='text-2xl font-bold capitalize'>{t('auth:welcome_back')}</h2>
        <p className='text-muted-foreground text-balance'>{t('auth:login_to_vnn')}.</p>
      </div>

      <div className='mt-10 flex flex-col gap-6'>
        {/* Scanner area - hidden input for barcode scanner */}
        <div
          className='bg-muted/30 border-border hover:border-primary/50 focus-within:border-primary flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors'
          onClick={handleScanAreaClick}
        >
          <IconScan className='text-muted-foreground mb-4 size-16' />
          <p className='text-foreground font-medium'>{t('auth:scan_card_instruction')}</p>
          <p className='text-muted-foreground mt-1 text-sm'>{t('auth:scan_card_hint')}</p>

          {/* Hidden input - nhận dữ liệu từ scanner USB/Bluetooth */}
          <input
            ref={inputRef}
            type='text'
            className='sr-only'
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            disabled={isPending}
            aria-label={t('auth:card_number')}
          />

          {isPending && (
            <p className='text-primary mt-4 animate-pulse text-sm font-medium'>
              {t('common:processing')}...
            </p>
          )}
        </div>

        {/* Camera scan button */}
        <Dialog open={cameraOpen} onOpenChange={setCameraOpen}>
          <DialogTrigger
            render={
              <Button variant='outline' className='w-full' disabled={isPending}>
                <IconBarcode data-icon='inline-start' />
                {t('auth:scan_with_camera')}
              </Button>
            }
          />
          <DialogContent className='sm:max-w-md'>
            <DialogHeader>
              <DialogTitle>{t('auth:scan_card')}</DialogTitle>
            </DialogHeader>
            {cameraOpen && <CameraScanner onScan={handleCameraScan} />}
          </DialogContent>
        </Dialog>

        {/* Divider */}
        <div className='relative text-center text-sm'>
          <span className='bg-background text-muted-foreground relative z-10 px-2'>
            {t('common:or')}
          </span>
          <div className='absolute inset-0 top-1/2 border-t' />
        </div>

        {/* Link to VNN login */}
        <Button
          variant='outline'
          nativeButton={false}
          render={
            <Link to='/login' className='flex items-center gap-1'>
              <IconLogin2 />
              {t('auth:login_vnn')}
            </Link>
          }
        />
      </div>
    </div>
  );
}
