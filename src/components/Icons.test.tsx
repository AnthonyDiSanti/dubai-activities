import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { CHAPTERS } from '../data/activities';
import { ChapterIcon } from './ChapterIcon';
import { HeartIcon } from './HeartIcon';
import { SiteLoader } from './SiteLoader';
import { UiIcon } from './UiIcon';
import shell from '../../index.html?raw';
import loaderStyles from '../styles/loader.css?raw';

const sources = import.meta.glob<string>('../../docs/branding/site-icons/**/*.svg', {
  eager: true,
  query: '?raw',
  import: 'default',
});

function sourceMarkup(path: string): string {
  const source = sources[`../../docs/branding/site-icons/${path}`];
  if (!source) throw new Error(`Missing source artwork: ${path}`);
  return source;
}

afterEach(cleanup);

function parse(markup: string): Element {
  const template = document.createElement('template');
  template.innerHTML = markup;
  const svg = template.content.querySelector('svg');
  if (!svg) throw new Error('Expected supplied SVG artwork');
  return svg;
}

function geometry(svg: Element) {
  // Compare actual drawing attributes, ignoring instance-specific IDs and metadata.
  return [...svg.querySelectorAll('path, rect, circle, ellipse, g, mask')].map((shape) => ({
    tag: shape.tagName,
    attributes: Object.fromEntries([...shape.attributes]
      .filter(({ name }) => !['id', 'mask', 'style'].includes(name))
      .map(({ name, value }) => [name, value])),
  }));
}

describe('Supplied icon system', () => {
  it.each(CHAPTERS)('preserves $key geometry and resolves each mask inside its own instance', ({ key }) => {
    const source = parse(sourceMarkup(`chapters/${key}.svg`));
    const { container } = render(<><ChapterIcon chapter={key} /><ChapterIcon chapter={key} lit /></>);
    const icons = [...container.querySelectorAll('svg')];
    const ids = [...container.querySelectorAll('[id]')].map((node) => node.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(icons[0]).not.toHaveAttribute('data-lit');
    expect(icons[1]).toHaveAttribute('data-lit', 'true');
    for (const icon of icons) {
      expect(icon).toHaveAttribute('aria-hidden', 'true');
      expect(icon).toHaveAttribute('focusable', 'false');
      expect(geometry(icon)).toEqual(geometry(source));
      for (const shape of icon.querySelectorAll('[mask]')) {
        const id = shape.getAttribute('mask')?.slice(5, -1);
        expect([...icon.querySelectorAll('mask')].some((mask) => mask.id === id)).toBe(true);
      }
    }
  });

  it('uses the approved heavier evenodd heart and keeps the outer edge fixed when saved', () => {
    const { container, rerender } = render(<HeartIcon />);
    const hollow = container.querySelector('path');
    const outer = hollow?.getAttribute('d')?.split(' Z ')[0];
    expect(hollow).toHaveAttribute('fill-rule', 'evenodd');
    expect(hollow?.getAttribute('d')).toContain('M12 17.65');
    rerender(<HeartIcon filled />);
    expect(container.querySelector('path')).toHaveAttribute('d', `${outer ?? ''} Z`);
    expect(container.querySelector('path')).not.toHaveAttribute('fill-rule');
  });

  it.each(['check', 'menu', 'arrow-right', 'chevron'] as const)('preserves the supplied %s utility', (name) => {
    const source = parse(sourceMarkup(`ui/${name}.svg`));
    const { container } = render(<UiIcon name={name} />);
    expect(container.querySelector('svg')).toHaveAttribute('viewBox', '0 0 16 16');
    expect(container.querySelector('path')).toHaveAttribute('d', source.querySelector('path')?.getAttribute('d'));
  });

  it('keeps the critical first-paint loader and React loader faithful to L3', () => {
    const source = parse(sourceMarkup('loader/loader-L3.svg'));
    const { container } = render(<SiteLoader />);
    const rendered = container.querySelector('svg');
    if (!rendered) throw new Error('Expected React loader');
    expect(geometry(rendered)).toEqual(geometry(source));
    expect(geometry(parse(shell))).toEqual(geometry(source));
    const css = loaderStyles.trim();
    expect(shell).toContain(css);
    expect(shell.indexOf('Getting the guide ready…')).toBeLessThan(shell.indexOf('<script'));
    expect(css).toContain('--ld-anim: none; --ld-off: -28.5');
    expect(rendered.querySelector('path:last-child')).toHaveStyle({ strokeDasharray: '14 86' });
  });
});
