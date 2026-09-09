const TICKER_TEXT = "Black friday sale 50% off";
const REPEAT = 8;

export default function AnnouncementBar() {
  const items = Array.from({ length: REPEAT }, (_, i) => (
    <span className="announce__item" key={i}>
      {TICKER_TEXT}
    </span>
  ));

  return (
    <div className="announce" role="region" aria-label="Announcement">
      <div className="announce__track">
        <div className="announce__group" aria-hidden="false">
          {items}
        </div>
        <div className="announce__group" aria-hidden="true">
          {items}
        </div>
      </div>
    </div>
  );
}
