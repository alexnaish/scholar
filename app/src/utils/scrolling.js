let previousOverflow;
let previousPaddingRight;

export const removeScrolling = (stopScroll) => {
  const { width } = document.body.getBoundingClientRect();

  /** Apply or remove overflow style */
  if (stopScroll) {
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = previousOverflow || '';
  }

  /** Get the _new width_ of the body (this will tell us the scrollbar width) */
  const newWidth = document.body.getBoundingClientRect().width;
  const scrollBarWidth = newWidth - width;

  /** If there's a diff due to scrollbars, then account for it with padding */
  if (stopScroll) {
    previousPaddingRight = document.body.style.paddingRight;
    document.body.style.marginRight = `${Math.max(0, scrollBarWidth || 0)}px`;
  } else {
    document.body.style.marginRight = previousPaddingRight || '';
  }
};
