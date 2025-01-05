import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import './LineGraph.css';

function getColor(i) {
  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#ff3860"];
  return colors[i % colors.length];
}

const CustomTooltip = ({ label, active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div id="custom-tooltip">
        {payload.map((item, i) => (
          <p key={i} style={{color: item.stroke}}>{item.name}: {item.value}</p>
        ))}
        <p>Time: {label}</p>
      </div>
    );
  }

  return null;
};

function LineGraph({ label = "No Graph Label", keys = [], data = [] }) {
  return (
    <div id="graph-box">
      <h2 id="graph-label">{label}</h2>
      {data.length === 0 ? (
        <div id="graph-container" style={{ height: "100%", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <p>No data available</p>
        </div>
      ) : (
        <ResponsiveContainer id="graph-container" height={400} width="100%">
          <LineChart id="graph" data={data}>
            {keys.map((key, i) => (
              <Line 
                key={i} 
                id="graph-line" 
                type="monotone" 
                dataKey={key} 
                stroke={getColor(i)}
                dot={{ r: 0 }}
              />
            ))}
            <CartesianGrid id="themed" />
            <XAxis id="themed-text" reversed={true} dataKey="timestamp" />
            <YAxis id="themed-text" />
            <Tooltip content={<CustomTooltip />} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default LineGraph;