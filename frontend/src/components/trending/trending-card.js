import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import TimelineContext from "../contexts/timeline-context";
import { Spinner } from "../loading-spinner/spinner";
import "./trending-card.scss";

function Trend({ trend }) {
  const { setSearchContext, setHeaderActive } = useContext(TimelineContext);
  let navigate = useNavigate();
  function goToTrend() {
    navigate("/explore");
    setHeaderActive("Explore");
    setSearchContext(trend[0]);
  }

  return (
    <div className="right-sidebar-item pointer" onClick={goToTrend}>
      <div className="right-sidebar-phrase">#{trend[0]}</div>
      <div className="right-sidebar-numbers">#{trend[1]} Tweets</div>
    </div>
  );
}

function Trending({ trends }) {
  return (
    <div className="right-sidebar-container gray3 f14 mb10">
      <div className="right-sidebar-item">
        <span className="right-sidebar-title gray1">Trends for you</span>
        <span className="right-sidebar-divider"></span>
      </div>

      {trends.length ? (
        trends.map((e) => <Trend trend={e} key={e[0]} />)
      ) : (
        <div className="right-sidebar-spinner">
          <Spinner />
        </div>
      )}
    </div>
  );
}

export default Trending;
