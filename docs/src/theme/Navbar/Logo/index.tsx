import React from "react";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";

export default function Logo(): React.ReactElement {
  return (
    <Link to={useBaseUrl("/")} className="navbar__brand" aria-label="KarbitUI home">
      <span className="navbar__title">
        <span className="kb-brand-karbit">Karbit</span>
        <span className="kb-brand-ui">UI</span>
      </span>
    </Link>
  );
}
