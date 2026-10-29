import { IconChevronDown } from '@tabler/icons-react';
import { useState, type ReactNode } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '~/components/ui/collapsible';
import { cn } from '~/lib/utils';

type FormSectionProps = {
  title: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  openSignal?: number;
  className?: string;
};

export function FormSection({
  title,
  children,
  defaultOpen = true,
  openSignal = 0,
  className,
}: FormSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [prevSignal, setPrevSignal] = useState(openSignal);

  if (openSignal !== prevSignal) {
    setPrevSignal(openSignal);
    if (openSignal) setOpen(true);
  }

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className={cn('bg-card overflow-hidden rounded-lg border', className)}
    >
      <CollapsibleTrigger className='bg-muted/40 hover:bg-muted/70 focus-visible:ring-ring/50 flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors outline-none focus-visible:ring-3'>
        <span aria-hidden className='bg-primary h-4 w-1 shrink-0 rounded-full' />
        <span className='text-foreground flex-1 font-semibold capitalize'>{title}</span>
        <IconChevronDown
          aria-hidden
          className='text-muted-foreground size-4 shrink-0 transition-transform duration-200 in-data-panel-open:rotate-180'
        />
      </CollapsibleTrigger>
      <CollapsibleContent
        keepMounted
        className='h-(--collapsible-panel-height) overflow-hidden transition-[height] duration-200 ease-out data-ending-style:h-0 data-starting-style:h-0'
      >
        <div className='border-t p-4'>{children}</div>
      </CollapsibleContent>
    </Collapsible>
  );
}
