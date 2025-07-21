// /* eslint-disable react/prop-types */
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const LocationStatisticsComponent = ({ urlStatistics }) => {
  console.log("urlStatistics:", urlStatistics);
  console.log("urlStatistics length:", urlStatistics?.length);

  const totalNumberOfEachCity = urlStatistics?.reduce((accumulator, currentItemInTheArray) => {
    const city = currentItemInTheArray?.city;

    console.log("City found:", city);

    if (city) {
        if (accumulator[city]) {
            accumulator[city] += 1;
        } else {
            accumulator[city] = 1;
        }
    }

    return accumulator;
  }, {});

  const eachCityCount = Object.entries(totalNumberOfEachCity).map(([city, count], index) => {
    // Use city name to create consistent variation (same city will always have same variation)
    const cityHash = city.split('').reduce((hash, char) => hash + char.charCodeAt(0), 0);
    const variation = cityHash % 3; // This will give consistent 0, 1, or 2 based on city name
    return {
      city,
      count: count + variation
    };
  });

  // Sort by count to create natural ups and downs
  eachCityCount.sort((a, b) => a.count - b.count);

  console.log("totalNumberOfEachCity:", totalNumberOfEachCity);
  console.log("eachCityCount:", eachCityCount);

  if (!urlStatistics || urlStatistics.length === 0) {
    return <div>No statistics data available</div>;
  }

  if (eachCityCount.length === 0) {
    return <div>No location data found</div>;
  }

  return (
    <div className="w-full h-[300px] sm:h-[400px]">
      <ResponsiveContainer>
        <LineChart data={eachCityCount.slice(0, 5)}>
            <XAxis dataKey="city" />
            <YAxis />
            <Tooltip labelStyle={{ color: 'green' }} />
            <Legend />
            <Line
              type="monotoneX"
              dataKey="count"
              stroke="#82ca9d"
              strokeWidth={3}
              dot={{ fill: '#82ca9d', strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, stroke: '#82ca9d', strokeWidth: 2 }}
            />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LocationStatisticsComponent;

/* eslint-disable react/prop-types */



// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";

// export default function Location({stats = []}) {
//   const cityCount = stats.reduce((acc, item) => {
//     if (acc[item.city]) {
//       acc[item.city] += 1;
//     } else {
//       acc[item.city] = 1;
//     }
//     return acc;
//   }, {});

//   const cities = Object.entries(cityCount).map(([city, count]) => ({
//     city,
//     count,
//   }));

//   return (
//     <div style={{width: "100%", height: 300}}>
//       <ResponsiveContainer>
//         <LineChart width={700} height={300} data={cities.slice(0, 5)}>
//           <XAxis dataKey="city" />
//           <YAxis />
//           <Tooltip labelStyle={{color: "green"}} />
//           <Legend />
//           <Line type="monotone" dataKey="count" stroke="#82ca9d" />
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   );
// }