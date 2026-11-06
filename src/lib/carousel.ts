export function shouldLoadCarouselImage(index: number, activeIndex: number, count: number) {
  if (count === 0) return false;
  return index === activeIndex
    || index === (activeIndex - 1 + count) % count
    || index === (activeIndex + 1) % count;
}
