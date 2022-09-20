import React, { useState, useContext, useEffect } from "react";
import TimelineContext from "../contexts/timeline-context";
import "./sidebar-card.scss";

function SidebarCard({ sidebarItems, context }) {
  const [active, setActive] = useState("Tweets");
  const { setSearchTypeContext, setPTLContext, searchTypeContext } =
    useContext(TimelineContext);

  useEffect(() => {
    if (context == "explore") {
      setActive(searchTypeContext);
    }
  }, []);

  function sidebarContext(event) {
    setActive(event.target.id);
    if (context === "explore") {
      setSearchTypeContext(event.target.id);
    } else {
      setPTLContext(event.target.id);
    }
  }

  return (
    <div className="sidebar-container gray3 f14">
      {sidebarItems.map((e) => {
        const el = e.replace(/[^\w]/gi, "").trim();
        return (
          <div
            id={el}
            className={`sidebar-item ${
              active === el ? "sidebar-item-active" : ""
            }`}
            key={el}
            onClick={sidebarContext}
          >
            {e}
          </div>
        );
      })}
      {/* {sidebarItemHtml} */}
    </div>
  );
}

export default SidebarCard;
