import { memo, type MouseEvent } from 'react';

import {
  activityMapUrl,
  activityPhotoUrl,
  activityPrimaryUrl,
  type Activity,
  type ActivityTreatment,
} from '../domain/activity';
import { activityHash } from '../domain/deepLinks';

export type ActivityCardProps = {
  readonly item: Activity;
  readonly treatment: ActivityTreatment;
  readonly isFavorite: boolean;
  readonly isVerified: boolean;
  readonly onToggleFavorite: (activityId: Activity['id']) => void;
  readonly onOpen: (activityId: Activity['id']) => void;
};

type PresentationProps = Omit<ActivityCardProps, 'treatment'>;

type FavoriteButtonProps = Pick<PresentationProps, 'item' | 'isFavorite' | 'onToggleFavorite'> & {
  readonly className: string;
};

type CardActionsProps = {
  readonly item: Activity;
  readonly className?: string;
  readonly includeInstagram?: boolean;
  readonly includeSite?: boolean;
  readonly mapClassName?: string;
  readonly smallMap?: boolean;
};

type PhotoProps = {
  readonly item: Activity;
  readonly isVerified: boolean;
  readonly placeholderModifier?: 'ahead' | 'dated';
};

function VerifiedStamp() {
  return (
    <span aria-label="Tried and liked" className="verified-stamp" role="img">
      <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
        <path
          d="M7.5 10.25 11.7 4.5c.55-.75 1.75-.36 1.75.57v3.68h4.48a2 2 0 0 1 1.95 2.43l-1.62 7.25A2 2 0 0 1 16.3 20H7.5m0-9.75V20H3.25v-9.75H7.5Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
      </svg>
    </span>
  );
}

function Photo({ isVerified, item, placeholderModifier }: PhotoProps) {
  const placeholderClassName = placeholderModifier
    ? `media-placeholder media-placeholder--${placeholderModifier}`
    : 'media-placeholder';

  return (
    <>
      <div className={placeholderClassName} />
      <img
        alt=""
        className="media-fill"
        decoding="async"
        loading="lazy"
        src={activityPhotoUrl(item)}
      />
      {isVerified && <VerifiedStamp />}
    </>
  );
}

function FavoriteButton({ className, isFavorite, item, onToggleFavorite }: FavoriteButtonProps) {
  return (
    <button
      aria-label={`${isFavorite ? 'Remove' : 'Save'} ${item.name} ${isFavorite ? 'from' : 'to'} favorites`}
      aria-pressed={isFavorite}
      className={`favorite-button ${className}`}
      onClick={(event) => {
        // Favorite changes must never trigger the card's detail-sheet action.
        event.stopPropagation();
        onToggleFavorite(item.id);
      }}
      type="button"
    >
      <span aria-hidden="true">{isFavorite ? '\u2665' : '\u2661'}</span>
    </button>
  );
}

function MapLink({ item, className = '', small = false }: {
  readonly item: Activity;
  readonly className?: string;
  readonly small?: boolean;
}) {
  const linkClassName = ['icon-link', className, small ? 'icon-link--small' : '']
    .filter(Boolean)
    .join(' ');
  const imageClassName = `icon-link__image${small ? ' icon-link__image--small' : ''}`;
  const fallbackClassName = `icon-link__fallback${small ? ' icon-link__fallback--small' : ''}`;

  return (
    <a
      aria-label={`Map for ${item.name}`}
      className={linkClassName}
      href={activityMapUrl(item)}
      rel="noopener"
      target="_blank"
    >
      <img alt="" className={imageClassName} src="photos/icon-google-maps.svg" />
      <span aria-hidden="true" className={fallbackClassName}>MAP</span>
    </a>
  );
}

function InstagramLink({ item }: { readonly item: Activity }) {
  if (!item.ig) return null;

  return (
    <a
      aria-label={`Instagram for ${item.name}`}
      className="icon-link"
      href={item.ig}
      rel="noopener"
      target="_blank"
    >
      <img alt="" className="icon-link__image" src="photos/icon-instagram.svg" />
      <span aria-hidden="true" className="icon-link__fallback">IG</span>
    </a>
  );
}

function CardActions({
  item,
  className = '',
  includeInstagram = false,
  includeSite = false,
  mapClassName = '',
  smallMap = false,
}: CardActionsProps) {
  const primaryUrl = activityPrimaryUrl(item);
  const actionsClassName = `card-actions${className ? ` ${className}` : ''}`;

  return (
    <div className={actionsClassName}>
      {primaryUrl && (
        <a
          className="card-action card-action--primary"
          href={primaryUrl}
          rel="noopener"
          target="_blank"
        >
          {item.cta}
        </a>
      )}
      {includeSite && item.book && item.site && (
        <a
          className="card-action card-action--secondary"
          href={item.site}
          rel="noopener"
          target="_blank"
        >
          Site
        </a>
      )}
      <MapLink className={mapClassName} item={item} small={smallMap} />
      {includeInstagram && <InstagramLink item={item} />}
    </div>
  );
}

function Eyebrow({ item, modifier = '' }: {
  readonly item: Activity;
  readonly modifier?: 'compact' | 'small' | '';
}) {
  if (!item.eyebrow) return null;

  const className = `card__eyebrow${modifier ? ` card__eyebrow--${modifier}` : ''}`;
  return <p className={className}>{item.eyebrow}</p>;
}

function openLinkProps(item: Activity, onOpen: PresentationProps['onOpen']) {
  return {
    'aria-label': `Open details for ${item.name}`,
    'data-activity-link': '',
    href: activityHash(item.id),
    onClick: (event: MouseEvent<HTMLAnchorElement>) => {
      // Modified clicks retain native copy-link and new-tab behavior.
      if (
        event.button !== 0 ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey
      ) return;

      event.preventDefault();
      event.stopPropagation();
      onOpen(item.id);
    },
  };
}

function DateStamp({ item, ahead = false }: { readonly item: Activity; readonly ahead?: boolean }) {
  if (!item.dated) return null;

  return (
    <span className={`date-stamp${ahead ? ' date-stamp--ahead' : ''}`}>
      <span className="date-stamp__weekday">{item.dated.w}</span>
      <span className="date-stamp__date">{item.dated.d} {item.dated.m}</span>
    </span>
  );
}

function BleedCard(props: PresentationProps) {
  const { isVerified, item, onOpen } = props;

  return (
    <>
      <article className="card card--bleed">
        <Photo isVerified={isVerified} item={item} />
        <div className="card--bleed__shade" />
        <FavoriteButton className="favorite-button--bleed" {...props} />
        <a className="card--bleed__open" {...openLinkProps(item, onOpen)}>
          <span className="card__rule" />
          <Eyebrow item={item} />
          <h3 className="card--bleed__title">{item.name}</h3>
          <p className="card--bleed__blurb">{item.blurb}</p>
        </a>
      </article>
      <CardActions
        className="card-actions--bleed"
        includeInstagram
        includeSite
        item={item}
      />
    </>
  );
}

function LetterCard(props: PresentationProps) {
  const { isVerified, item, onOpen } = props;

  return (
    <article className="card card--letter">
      <div className="card--letter__frame">
        <div className="card--letter__media">
          <Photo isVerified={isVerified} item={item} />
        </div>
        <FavoriteButton className="favorite-button--corner" {...props} />
        <h3 className="card--letter__title">{item.name}</h3>
      </div>
      <a className="card--letter__open" {...openLinkProps(item, onOpen)}>
        <Eyebrow item={item} />
        <p className="card--letter__blurb">{item.blurb}</p>
      </a>
      <CardActions includeSite item={item} />
    </article>
  );
}

function TopCard(props: PresentationProps) {
  const { isVerified, item, onOpen } = props;

  return (
    <article className="card card--top">
      <Photo isVerified={isVerified} item={item} />
      <div className="card--top__shade" />
      <a className="card--top__open" {...openLinkProps(item, onOpen)}>
        <Eyebrow item={item} />
        <h3 className="card--top__title">{item.name}</h3>
      </a>
      <FavoriteButton className="favorite-button--top" {...props} />
      <div className="card--top__footer">
        <p className="card--top__blurb">{item.blurb}</p>
        <CardActions className="card-actions--overlay" item={item} mapClassName="icon-link--overlay" />
      </div>
    </article>
  );
}

function SlabCard(props: PresentationProps) {
  const { isVerified, item, onOpen } = props;

  return (
    <article className="card card--slab">
      <Photo isVerified={isVerified} item={item} />
      <div className="card--slab__shade" />
      <FavoriteButton className="favorite-button--slab" {...props} />
      <div className="card--slab__panel">
        <a className="card--slab__open" {...openLinkProps(item, onOpen)}>
          <Eyebrow item={item} modifier="compact" />
          <h3 className="card--slab__title">{item.name}</h3>
          <p className="card--slab__blurb">{item.blurb}</p>
        </a>
        <CardActions className="card-actions--overlay" item={item} mapClassName="icon-link--slab" />
      </div>
    </article>
  );
}

function ColumnsCard(props: PresentationProps) {
  const { isVerified, item, onOpen } = props;

  return (
    <article className="card card--columns">
      <div className="card--columns__media">
        <Photo isVerified={isVerified} item={item} />
        <FavoriteButton className="favorite-button--corner" {...props} />
      </div>
      <a className="card--columns__open" {...openLinkProps(item, onOpen)}>
        <span className="card--columns__heading">
          {item.eyebrow && <span className="card--columns__eyebrow">{item.eyebrow}</span>}
          <h3 className="card--columns__title">{item.name}</h3>
        </span>
        <span className="card--columns__blurb">{item.blurb}</span>
      </a>
      <CardActions includeSite item={item} />
    </article>
  );
}

function BiteCard(props: PresentationProps) {
  const { isVerified, item, onOpen } = props;

  return (
    <article className="card card--bite">
      <div className="card--bite__media">
        <Photo isVerified={isVerified} item={item} />
        <FavoriteButton className="favorite-button--corner" {...props} />
        <div className="card--bite__heading">
          <Eyebrow item={item} modifier="small" />
          <h3 className="card--bite__title">{item.name}</h3>
        </div>
      </div>
      <a className="card--bite__open" {...openLinkProps(item, onOpen)}>
        <p className="card--bite__blurb">{item.blurb}</p>
      </a>
      <CardActions item={item} />
    </article>
  );
}

function DatedCard(props: PresentationProps) {
  const { isVerified, item, onOpen } = props;
  const primaryUrl = activityPrimaryUrl(item);

  return (
    <article className="card card--dated">
      <div className="card--dated__ticket">
        <div className="card--dated__media">
          <Photo isVerified={isVerified} item={item} placeholderModifier="dated" />
          <DateStamp item={item} />
        </div>
        <a className="ticket-copy" {...openLinkProps(item, onOpen)}>
          <Eyebrow item={item} modifier="small" />
          <h3 className="ticket-copy__title">{item.name}</h3>
          <p className="ticket-copy__blurb">{item.blurb}</p>
        </a>
        <div className="ticket-actions">
          {primaryUrl && (
            <a
              className="card-action card-action--primary"
              href={primaryUrl}
              rel="noopener"
              target="_blank"
            >
              {item.cta}
            </a>
          )}
          <MapLink item={item} />
          <FavoriteButton className="favorite-button--inline" {...props} />
        </div>
      </div>
    </article>
  );
}

function AheadCard(props: PresentationProps) {
  const { isVerified, item, onOpen } = props;
  const primaryUrl = activityPrimaryUrl(item);

  return (
    <article className="card card--ahead">
      <div className="card--ahead__ticket">
        <div className="card--ahead__banner">
          <span className="card--ahead__banner-title">BOOK WELL AHEAD</span>
          <span className="card--ahead__reason">{item.ahead}</span>
        </div>
        <div className="card--ahead__body">
          <div className="card--ahead__media">
            <Photo isVerified={isVerified} item={item} placeholderModifier="ahead" />
            <DateStamp ahead item={item} />
          </div>
          <a className="ticket-copy" {...openLinkProps(item, onOpen)}>
            <Eyebrow item={item} modifier="small" />
            <h3 className="ticket-copy__title">{item.name}</h3>
            <p className="ticket-copy__blurb">{item.blurb}</p>
          </a>
        </div>
        <div className="card--ahead__perforation" />
        <div className="card--ahead__actions">
          {primaryUrl && (
            <a className="card--ahead__primary" href={primaryUrl} rel="noopener" target="_blank">
              {item.cta.toUpperCase()} &rarr;
            </a>
          )}
          <MapLink item={item} small />
          <FavoriteButton className="favorite-button--ahead-inline" {...props} />
        </div>
      </div>
    </article>
  );
}

function TypeCard(props: PresentationProps) {
  const { isVerified, item, onOpen } = props;

  return (
    <article className="card card--type">
      <div className="card--type__media">
        <div className="card--type__pattern" />
        {isVerified && <VerifiedStamp />}
        <FavoriteButton className="favorite-button--type" {...props} />
        <a className="card--type__heading" {...openLinkProps(item, onOpen)}>
          <span className="card__rule" />
          <Eyebrow item={item} />
          <h3 className="card--type__title">{item.name}</h3>
        </a>
      </div>
      <a className="card--type__open" {...openLinkProps(item, onOpen)}>
        <p className="card--type__blurb">{item.blurb}</p>
      </a>
      <CardActions includeInstagram includeSite item={item} />
    </article>
  );
}

function renderTreatment(props: ActivityCardProps) {
  const presentationProps: PresentationProps = props;

  // Keeping the exhaustive mapping here makes every legacy treatment visible and testable.
  switch (props.treatment) {
    case 'bleed':
      return <BleedCard {...presentationProps} />;
    case 'letter':
      return <LetterCard {...presentationProps} />;
    case 'top':
      return <TopCard {...presentationProps} />;
    case 'slab':
      return <SlabCard {...presentationProps} />;
    case 'columns':
      return <ColumnsCard {...presentationProps} />;
    case 'bite':
      return <BiteCard {...presentationProps} />;
    case 'dated':
      return <DatedCard {...presentationProps} />;
    case 'ahead':
      return <AheadCard {...presentationProps} />;
    case 'type':
      return <TypeCard {...presentationProps} />;
    default:
      return props.treatment satisfies never;
  }
}

export const ActivityCard = memo(function ActivityCard(props: ActivityCardProps) {
  const { item, onOpen } = props;

  return (
    <div
      className="activity-card"
      id={`activity-${item.id}`}
      onClick={(event) => {
        // The wrapper expands the hit target without turning nested controls into card triggers.
        const target = event.target as HTMLElement | null;
        if (!target?.closest('a,button')) onOpen(item.id);
      }}
    >
      {renderTreatment(props)}
    </div>
  );
});
