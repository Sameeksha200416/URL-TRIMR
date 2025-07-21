/* eslint-disable react/prop-types */
import { PieChart, Pie, ResponsiveContainer, Cell } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#A94438", "#FF8042", "#6DA4AA", "#637A9F", "#A94438", "#6DA4AA", "#F2C57C", "#F2A365"];

function getColor(index) {
  return COLORS[index % COLORS.length];
}

const DeviceStatisticsComponent = ({ urlStatistics }) => {
  const deviceCount = urlStatistics?.reduce((accumulator, currentValueInTheArray) => {
    if(!accumulator[currentValueInTheArray?.device]) {
      accumulator[currentValueInTheArray?.device] = 0;
    }
    accumulator[currentValueInTheArray?.device]++;
    return accumulator;
  }, {});

  const deviceCountInFormOfArrayOfObjects = Object.keys(deviceCount).map((device) => ({
    device,
    count: deviceCount[device]
  }));

  return (
    <div className="w-full h-[200px] sm:h-[300px]">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={deviceCountInFormOfArrayOfObjects}
            label={({device, percent}) => `${device}: ${(percent * 100).toFixed(0)}%`} // We do not want to show decimal numbers
            labelLine={false}
            dataKey="count"
            outerRadius="80%" 
          >
            {deviceCountInFormOfArrayOfObjects.map((_, index) => (
              <Cell key={`cell-${index}`} fill={getColor(index)} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default DeviceStatisticsComponent;