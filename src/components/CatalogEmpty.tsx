import Link from "next/link";
import HoverText from "./HoverText";

type CatalogEmptyProps = {
  title: string;
  body: string;
  href?: string;
  cta?: string;
};

export default function CatalogEmpty({
  title,
  body,
  href,
  cta,
}: CatalogEmptyProps) {
  return (
    <div className="catalog-empty" role="status">
      <p className="catalog-empty__eyebrow">RNB Collections</p>
      <h3 className="catalog-empty__title">{title}</h3>
      <p className="catalog-empty__body">{body}</p>
      {href && cta ? (
        <Link href={href} className="catalog-empty__cta">
          <HoverText>{cta}</HoverText>
        </Link>
      ) : null}
    </div>
  );
}
