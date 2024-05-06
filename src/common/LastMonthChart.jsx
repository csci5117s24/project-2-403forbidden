import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Label } from 'recharts';
import moment from 'moment';

const LastMonthChart = ({ rangevisits }) => {
  const navigate = useNavigate();

  // Today's date
  const today = moment();
  // Start of last month
  const startOfMonth = today.clone().subtract(1, 'month').startOf('month');
  // End of last month
  const endOfMonth = today.clone().startOf('month').subtract(1, 'day');

  // Filter to get visits within the last month
  const filteredVisits = rangevisits
    .filter(visit => {
      const visitDate = moment(visit.visitDate);
      return visitDate.isBetween(startOfMonth, endOfMonth, undefined, '[]'); // Inclusive
    })
    .map(visit => ({
      date: moment(visit.visitDate).format('YYYY-MM-DD'),
      totalValue: visit.visitDetail
        .map(detail => parseFloat(detail.value)) // Convert values to numbers
        .reduce((sum, value) => sum + value, 0), // Sum all values for that visit
      id: visit._id // Include the visit ID for navigation
    }));

  // Aggregate by date
  const aggregatedVisits = filteredVisits.reduce((acc, visit) => {
    const existing = acc.find(item => item.date === visit.date);
    if (existing) {
      existing.totalValue += visit.totalValue;
    } else {
      acc.push({ date: visit.date, totalValue: visit.totalValue, id: visit.id });
    }
    return acc;
  }, []);

  // Create a complete array of dates for the entire month
  const allDatesInMonth = [];
  let currentDate = startOfMonth.clone();
  while (currentDate.isSameOrBefore(endOfMonth)) {
    const dateStr = currentDate.format('YYYY-MM-DD');
    const existingVisit = aggregatedVisits.find(item => item.date === dateStr);
    allDatesInMonth.push({
      date: dateStr,
      totalValue: existingVisit ? existingVisit.totalValue : 0, // Default to 0 if no value for that date
      id: existingVisit ? existingVisit.id : null // Keep the ID for navigation if present
    });
    currentDate.add(1, 'day');
  }

  // Function to handle point clicks and navigate
  const handlePointClick = (data) => {
    console.log("Here");
    console.log(data);
    if (data && data.id) {
      navigate(`/rangevisit/${data.id}`);
    }
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip" style={{ backgroundColor: "#fff", padding: "5px", border: "1px solid #ccc" }}>
          <p><strong>Date:</strong> {moment(data.date).format('MMM DD, YYYY')}</p>
          <p><strong>Total Rounds:</strong> {data.totalValue}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ScatterChart
      width={500}
      height={250}
      data={allDatesInMonth}
      margin={{ top: 20, right: 30, bottom: 10, left: 50 }} // Adjust left margin to accommodate the Y-axis label
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" tickFormatter={(tick) => moment(tick).format('MMM DD')}>
        <Label value="Date" offset={-30} position="insideBottom" />
      </XAxis>
      <YAxis>
        <Label
            value="Total Rounds"
            angle={-90}
            position="insideLeft"
            offset={-20} // Adjust this value to move the label further from the axis
            style={{ textAnchor: 'middle' }} // Ensures text is centered along the axis
        />
        </YAxis>
      <Tooltip content={<CustomTooltip />} /> {/* Use the custom tooltip */}
      <Scatter
        name="Total Rounds per Day"
        dataKey="totalValue"
        fill="#8884d8"
        onClick={(data) => handlePointClick(data.payload)} // Directly navigate to the visit on click
      />
    </ScatterChart>
  );
};

export default LastMonthChart;
