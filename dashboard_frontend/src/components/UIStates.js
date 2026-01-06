import React from "react";

function PanelMessage({ title, message, action }) {
  return (
    <div className="panelMessage" role="status">
      <div className="panelMessage__title">{title}</div>
      {message ? <div className="panelMessage__text">{message}</div> : null}
      {action ? <div className="panelMessage__action">{action}</div> : null}
    </div>
  );
}

// PUBLIC_INTERFACE
export function LoadingSkeleton({ lines = 3, height = 12 }) {
  /** Generic skeleton placeholder to reserve space and reduce layout shift. */
  return (
    <div className="skeletonStack" aria-hidden="true">
      {Array.from({ length: lines }).map((_, idx) => (
        <div
          // eslint-disable-next-line react/no-array-index-key
          key={idx}
          className="skeleton"
          style={{ height, width: idx === lines - 1 ? "68%" : "100%" }}
        />
      ))}
    </div>
  );
}

// PUBLIC_INTERFACE
export function EmptyState({ title = "No data", message = "There is nothing to show yet." }) {
  /** Standard empty state for panels. */
  return <PanelMessage title={title} message={message} />;
}

// PUBLIC_INTERFACE
export function ErrorState({ title = "Something went wrong", message, onRetry }) {
  /** Standard error state for panels. */
  return (
    <PanelMessage
      title={title}
      message={message}
      action={
        onRetry ? (
          <button type="button" className="button" onClick={onRetry}>
            Retry
          </button>
        ) : null
      }
    />
  );
}
