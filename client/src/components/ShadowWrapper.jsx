import { useEffect, useRef } from "react";

const ShadowWrapper = ({ html }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current && !containerRef.current.shadowRoot) {
      containerRef.current.attachShadow({ mode: "open" });
    }
    if (containerRef.current.shadowRoot) {
      containerRef.current.shadowRoot.innerHTML = html;
    }
  }, [html]);

  return <div className="bg-white font-light text-xs m-0 p-0" ref={containerRef} />;
};

export default ShadowWrapper;