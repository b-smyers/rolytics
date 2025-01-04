import './TrendIndicator.css';

function TrendIndicator({ label = "No Trend Label", past, current, upIsGood, delta = 0 }) {
  const calculateTrend = () => {
    const difference = Math.abs(current - past);

    if (difference < delta) {
      return "stagnant"; // no significant change
    }

    if (current > past) {
      return upIsGood ? "up" : "down";
    } else if (current < past) {
      return upIsGood ? "down" : "up";
    }

    return "stagnant";
  };

  const trendSymbol = () => {
    const trend = calculateTrend();
    switch (trend) {
      case "up":
        return <h3 style={{ color: "green" }}>▲</h3>;
      case "down":
        return <h3 style={{ color: "red" }}>▼</h3>;
      case "stagnant":
        return <h3 style={{ color: "gray" }}>−</h3>;
      default:
        return null;
    }
  };

  return (
    <div id="trend-box">
      <p>{label}</p>
      <div id="trend">
        <h2>{(current).toFixed(2)}</h2>
        {trendSymbol()}
      </div>
    </div>
  );
}

export default TrendIndicator;
