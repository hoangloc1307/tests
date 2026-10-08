import type { HeadingNode, InlineNode } from '@tanstack/markdown';
import { parseMarkdown } from '@tanstack/markdown/parser';
import { Markdown, type MarkdownComponents } from '@tanstack/markdown/react';
import { cn } from 'cn';
import { useEffect, useMemo, useRef, useState } from 'react';
import changelog from '~/content/changelog.md?raw';

const components: MarkdownComponents = {
  h1: (props) => <h1 className='text-foreground mb-4 text-2xl font-bold' {...props} />,
  h2: (props) => (
    <h2 className='text-foreground mt-8 mb-3 scroll-mt-20 text-xl font-semibold' {...props} />
  ),
  h3: (props) => <h3 className='text-foreground mt-5 mb-2 text-base font-semibold' {...props} />,
  p: (props) => <p className='text-muted-foreground my-2 leading-relaxed' {...props} />,
  ul: (props) => <ul className='text-muted-foreground my-2 ml-6 list-disc space-y-1' {...props} />,
  ol: (props) => (
    <ol className='text-muted-foreground my-2 ml-6 list-decimal space-y-1' {...props} />
  ),
  li: (props) => <li className='leading-relaxed' {...props} />,
  a: (props) => <a className='text-primary underline underline-offset-4' {...props} />,
  strong: (props) => <strong className='text-foreground font-semibold' {...props} />,
  hr: (props) => <hr className='border-border my-6' {...props} />,
  blockquote: (props) => (
    <blockquote
      className='border-primary/40 text-muted-foreground border-l-2 pl-4 italic'
      {...props}
    />
  ),
  table: (props) => (
    <div className='my-4 overflow-x-auto'>
      <table className='border-border w-full border-collapse border text-sm' {...props} />
    </div>
  ),
  thead: (props) => <thead className='bg-muted' {...props} />,
  tr: (props) => <tr className='border-border border-b' {...props} />,
  th: (props) => (
    <th
      className='text-foreground border-border border px-3 py-2 text-left font-semibold'
      {...props}
    />
  ),
  td: (props) => <td className='text-muted-foreground border-border border px-3 py-2' {...props} />,
};

type Version = {
  id: string;
  title: string;
};

function headingText(nodes: InlineNode[]): string {
  return nodes
    .map((node) =>
      'value' in node ? node.value : 'children' in node ? headingText(node.children) : '',
    )
    .join('');
}

export default function VersionHistoryPage() {
  const versions = useMemo<Version[]>(() => {
    const doc = parseMarkdown(changelog, { headingIds: true });
    return doc.children
      .filter((node): node is HeadingNode => node.type === 'heading' && node.depth === 2)
      .map((node) => ({ id: node.id ?? '', title: headingText(node.children) }))
      .filter((v) => v.id);
  }, []);

  const [activeId, setActiveId] = useState(versions[0]?.id ?? '');
  // While a click-triggered smooth scroll is in progress, ignore the observer
  // so intermediate sections don't flash as "active" on the way to the target.
  const isClickScrolling = useRef(false);

  useEffect(() => {
    const headings = versions
      .map((v) => document.getElementById(v.id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        if (isClickScrolling.current) return;
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-80px 0px -70% 0px' },
    );

    headings.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [versions]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    isClickScrolling.current = true;
    setActiveId(id);
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Re-enable the observer once the smooth scroll settles. `scrollend` fires
    // when scrolling fully stops; fall back to a timeout for older browsers.
    const release = () => {
      isClickScrolling.current = false;
    };
    if ('onscrollend' in window) {
      window.addEventListener('scrollend', release, { once: true });
    } else {
      setTimeout(release, 700);
    }
  };

  return (
    <div className='flex gap-8'>
      <aside className='sticky top-20 hidden h-fit w-40 shrink-0 md:block'>
        <p className='text-foreground mb-3 text-sm font-semibold'>Phiên bản</p>
        <nav className='flex flex-col gap-1'>
          {versions.map((version) => (
            <button
              key={version.id}
              type='button'
              onClick={() => scrollTo(version.id)}
              className={cn(
                'rounded-md px-3 py-1.5 text-left text-sm transition-colors',
                activeId === version.id
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              {version.title}
            </button>
          ))}
        </nav>
      </aside>

      <div className='max-w-3xl min-w-0 flex-1'>
        <Markdown components={components} headingIds>
          {changelog}
        </Markdown>
      </div>
    </div>
  );
}
