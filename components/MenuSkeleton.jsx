export default function MenuSkeleton() {
  return (
    <div className="dish-grid" aria-label="Loading menu" aria-busy="true">
      {Array.from({ length: 6 }, (_, index) => (
        <div className="skeleton-card" key={index}>
          <div className="skeleton-image" />
          <div className="skeleton-line" />
          <div className="skeleton-line short" />
        </div>
      ))}
    </div>
  );
}