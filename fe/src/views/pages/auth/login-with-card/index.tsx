import { IconAperture, IconLogin2, IconScan } from '@tabler/icons-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Button } from '~/components/ui/button';
import { useLoginWithCard } from '~/hooks/mutations/use-auth';
import { CameraScanner } from '~/views/pages/auth/login-with-card/camera-scanner';

export default function LoginWithCardPage() {
  const { t } = useTranslation();
  const { mutateAsync, isPending } = useLoginWithCard();
  const inputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<'scanner' | 'camera'>('scanner');
  const [cardNumber, setCardNumber] = useState('');

  // Focus input helper
  const focusInput = useCallback(() => {
    if (mode === 'scanner' && !cardNumber.trim()) {
      inputRef.current?.focus();
    }
  }, [mode, cardNumber]);

  // Focus hidden input when in scanner mode
  useEffect(() => {
    focusInput();
  }, [focusInput]);

  // Keep focus on blur (with delay to avoid conflict)
  const handleBlur = useCallback(() => {
    setTimeout(focusInput, 0);
  }, [focusInput]);

  const submitCardNumber = useCallback(
    async (value: string) => {
      try {
        const cardNumber = value.replace('*', '');
        await mutateAsync({ cardNumber });
      } finally {
        setCardNumber('');
      }
    },
    [mutateAsync],
  );

  const handleKeyDown = useCallback(
    async (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && cardNumber.trim()) {
        e.preventDefault();
        await submitCardNumber(cardNumber.trim());
      }
    },
    [submitCardNumber, cardNumber],
  );

  // Toggle between scanner and camera mode
  const toggleMode = useCallback(() => {
    setMode((prev) => (prev === 'scanner' ? 'camera' : 'scanner'));
  }, []);

  return (
    <div className='p-6 md:p-8'>
      <div className='flex flex-col items-center gap-2 text-center'>
        <h2 className='text-2xl font-bold capitalize'>{t('auth:welcome_back')}</h2>
        <p className='text-muted-foreground text-balance'>{t('auth:login_to_vnn')}.</p>
      </div>

      <div className='mt-10 flex flex-col gap-6'>
        {/* Scanner mode */}
        {mode === 'scanner' && (
          <div
            className='bg-muted/30 border-border hover:border-primary/50 focus-within:border-primary flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors'
            onClick={focusInput}
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
        )}

        {/* Camera mode */}
        {mode === 'camera' && <CameraScanner onScan={submitCardNumber} />}

        {/* Toggle button */}
        <Button variant='outline' className='w-full' disabled={isPending} onClick={toggleMode}>
          {mode === 'scanner' ? (
            <>
              <IconAperture data-icon='inline-start' />
              {t('auth:scan_with_camera')}
            </>
          ) : (
            <>
              <IconScan data-icon='inline-start' />
              {t('auth:scan_with_scanner')}
            </>
          )}
        </Button>

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
              {t('auth:login_vnn_full')}
            </Link>
          }
        />
      </div>
    </div>
  );
}
