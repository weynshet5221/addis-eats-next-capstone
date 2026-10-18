
"use client";

import dynamic from "next/dynamic";

const TrackingMap = dynamic(
  () => import("./TrackingMap"),
  {
    ssr: false,
    loading: () => (
      <div className="tracking-map-placeholder" role="status">
        Loading delivery map…
      </div>
    ),
  }
);

export default function TrackingMapLoader(props) {
  return <TrackingMap {...props} />;
}
