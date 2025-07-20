import React, { useState, useEffect } from "react";

// Function to generate mock contribution data for each day
const generateMockData = () => {
  const days = 365;
  const data = [];
  for (let i = 0; i < days; i++) {
    data.push(Math.floor(Math.random() * 5)); // Simulates 0 to 4 contributions per day
  }
  return data;
};

// Function to determine the color based on the number of contributions
const getColor = (contributions) => {
  if (contributions === 0) return "#f0f0f0"; // No contributions
  if (contributions === 1) return "#c6e48b"; // Light green
  if (contributions === 2) return "#7bc96f"; // Medium green
  if (contributions === 3) return "#239a3b"; // Dark green
  return "#196127"; // Very dark green
};

// Function to get month names
const getMonthNames = () => [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// Function to get weekday names
const getWeekDays = () => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Function to get the current year
const getCurrentYear = () => new Date().getFullYear();

// Function to get the first day of a month (using the first day of each month)
const getFirstDayOfMonth = (year, month) => {
  const firstDay = new Date(year, month, 1); // First day of the month
  return firstDay.getDay(); // Returns a number (0=Sunday, 1=Monday, ..., 6=Saturday)
};

// Function to get the number of days in a month, accounting for leap years
const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate(); // Number of days in the month
};

// Function to build the weeks and days of the month
const buildMonthCalendar = (year, month) => {
  const firstDayOfMonth = getFirstDayOfMonth(year, month);
  const daysInMonth = getDaysInMonth(year, month);

  const weeks = [];
  let currentWeek = new Array(firstDayOfMonth).fill(null); // Fill the empty days before the first day of the month

  for (let day = 1; day <= daysInMonth; day++) {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  // Add the last week if it's not complete
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  return weeks;
};

const ContributionGraph = () => {
  const [contributions, setContributions] = useState([]);
  const [weeksInMonth, setWeeksInMonth] = useState([]);
  const [hoveredDate, setHoveredDate] = useState(""); // To store hovered date
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 }); // Position of the tooltip

  const year = getCurrentYear(); // Current year

  useEffect(() => {
    const mockData = generateMockData(); // Generate mock contribution data
    setContributions(mockData);

    // Build the calendar for each month of the current year
    const monthCalendars = [];
    for (let month = 0; month < 12; month++) {
      const weeks = buildMonthCalendar(year, month);
      monthCalendars.push(weeks);
    }
    setWeeksInMonth(monthCalendars); // Set the weeks for each month
  }, []);

  const monthNames = getMonthNames();
  const weekDays = getWeekDays();

  // Function to handle mouse enter event
  const handleMouseEnter = (monthIndex, weekIndex, dayIndex, e) => {
    const month = monthIndex; // Current month
    const day = weeksInMonth[monthIndex][weekIndex][dayIndex]; // Current day in this month

    // Avoid empty cells (null)
    if (day === null) return;

    const date = new Date(year, month, day); // Create a Date object with the year, month, and day
    const options = { month: "long", day: "numeric" };
    setHoveredDate(date.toLocaleDateString("en-US", options)); // Format the date

    // Calculate the tooltip position
    const dayElement = e.target;
    const rect = dayElement.getBoundingClientRect();
    setTooltipPosition({
      x: rect.left + 1,
      y: rect.top + 1,
    });
  };

  // Function to handle mouse leave event
  const handleMouseLeave = () => {
    setHoveredDate(""); // Reset the date when mouse leaves
  };

  return (
    <div className="contribution-graph">
      <h2>Contribution Graph</h2>

      <div className="graph-container">
        {/* Display months with their days */}
        {weeksInMonth.map((weeks, monthIndex) => (
          <div key={monthIndex} className="month-container">
            <div className="month-name">
              {monthNames[monthIndex]}
            </div>

            <div className="month-graph">
              <div className="week-days">
                {weekDays.map((day, index) => (
                  <div key={index} className="day-name">
                    {day}
                  </div>
                ))}
              </div>

              {/* Display weeks for this month */}
              <div className="graph">
                {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="week">
                    {week.map((day, dayIndex) => (
                      <div
                        key={dayIndex}
                        className="day"
                        style={{
                          backgroundColor:
                            day === null
                              ? "transparent"
                              : getColor(
                                contributions[
                                day - 1
                                ]
                              ), // Use contributions data to set color
                        }}
                        onMouseEnter={(e) =>
                          handleMouseEnter(
                            monthIndex,
                            weekIndex,
                            dayIndex,
                            e
                          )
                        } // Pass month, week, and day index
                        onMouseLeave={handleMouseLeave}
                      >
                        {day}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tooltip display near the mouse cursor */}
      {hoveredDate && (
        <div
          className="tooltip"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
          }}
        >
          {hoveredDate}
        </div>
      )}

      <div className="legend">
        <div>
          <span
            className="color-box"
            style={{ backgroundColor: "#f0f0f0" }}
          ></span>{" "}
          No contributions
        </div>
        <div>
          <span
            className="color-box"
            style={{ backgroundColor: "#c6e48b" }}
          ></span>{" "}
          Low contributions
        </div>
        <div>
          <span
            className="color-box"
            style={{ backgroundColor: "#7bc96f" }}
          ></span>{" "}
          Medium-low contributions
        </div>
        <div>
          <span
            className="color-box"
            style={{ backgroundColor: "#239a3b" }}
          ></span>{" "}
          Medium-high contributions
        </div>
        <div>
          <span
            className="color-box"
            style={{ backgroundColor: "#196127" }}
          ></span>{" "}
          High contributions
        </div>
      </div>
    </div>
  );
};

export default ContributionGraph;
