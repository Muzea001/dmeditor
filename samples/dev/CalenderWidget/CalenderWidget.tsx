import * as React from 'react';
import { css } from '@emotion/css';
import { Slider } from '@mui/material';
import { EntityCalenderWidget } from './entity';
import { useEditorStore } from 'Src/core';
import { DME } from 'Src/core/types';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import {format, isSameDay} from 'date-fns'
import { CalendarEvent } from './CalenderEvent'

const { useState, useEffect } = React;

export const CalenderWidget = (props: DME.WidgetRenderProps<EntityCalenderWidget>) => {
  const {
    blockNode: {
      data: { settings },
    },
  } = props;

  type ValuePiece = Date | null;

  type Value = ValuePiece | [ValuePiece, ValuePiece];

  const injectTileStyles = () => {
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
      .meeting-tile { background-color: yellow !important; }
      .course-tile { background-color: lightblue !important; }
      .tournament-tile { background-color: green !important; }
      .diverse-event-tile { background-color: pink !important; }
    `;
    document.head.appendChild(style);
  };
  
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: '1',
      date: new Date(2024, 3, 10),
      title: 'Team Meeting',
      type: 'meeting',
      description: 'Discuss project milestones',
      link: 'https://oslomet.no'
    },
    {
      id: '2',
      date: new Date(2024, 3, 13),
      title: 'Workshop: React Advanced',
      type: 'course',
      description: 'Advanced concepts of React',
      link: 'https://oslomet.no'
    },
    {
      id: '3',
      date: new Date(2024, 3, 18),
      title: 'Krets tournament',
      type: 'tournament',
      description: 'Advanced concepts of React',
      link: 'https://oslomet.no'
    },
    {
      id: '4',
      date: new Date(2024, 3, 22),
      title: 'diverse',
      type: 'diverse events',
      description: 'Advanced concepts of React',
      link: 'https://oslomet.no'
    },
    
  ]);

  const getEventStyle = (eventType) => {
    const styles = {
      'meeting': { className: 'meeting-tile', color: 'yellow' },
      'course': { className: 'course-tile', color: 'lightblue' },
      'tournament': { className: 'tournament-tile', color: 'green' },
      'diverse events': { className: 'diverse-event-tile', color: 'pink' },
    };
  
    
    const defaultStyle = { className: null, color: 'white' };
  
    return styles[eventType] || defaultStyle;
  };

  const [width, setWidth] = useState(settings.width ?? 300);
  const [height, setHeight] = useState(settings.height ?? 150);
  const [header, setHeader] = useState(settings.header ?? 'Upcoming events');
  const [value, setValue] = useState<Value>(new Date());
  const [currentMonth, setCurrentMonth] = useState(format(new Date(), 'MMMM yyyy'));
  const [hoveredEvent, setHoveredEvent] = useState<CalendarEvent| null>(null);
  


  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const eventToday = events.find(event => isSameDay(event.date, date));
      if (eventToday) {
    
        return (
          <div
            style={{ width: '100%', height: '100%', cursor: 'pointer' }}
            onMouseEnter={() => setHoveredEvent(eventToday)}
            onMouseLeave={() => setHoveredEvent(null)}
          />
        );
      }
    }
    
    return null;
  };

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const eventToday = events.find(event => isSameDay(event.date, date));
      if (eventToday) {
       return getEventStyle(eventToday.type).className;
        }
      }
        return null;
        };
        
          

  const handleChange = (nextValue) => {
    setValue(nextValue);
  };

  const handleActiveStartDateChange = ({ activeStartDate }) => {
    setCurrentMonth(format(activeStartDate, 'MMMM yyyy'));
  };
  
  const { updateSelectedBlock } = useEditorStore();

  useEffect(() => {
    injectTileStyles();
    setHeight(settings.height ?? 300);
    setWidth(settings.width ?? 1070);
    setHeader(settings.header?? 'Upcoming Events')
  }, [settings, value]);

  const updateHeight = (e,v ) => {
    updateSelectedBlock<EntityCalenderWidget>((data) => {
      data.settings.height = v ;
    });
  };

  const updateHeader = (e,v ) => {
    updateSelectedBlock<EntityCalenderWidget>((data) => {
      data.settings.header = v ;
    });
  };

  const updateWidth = (e,v ) => {
    updateSelectedBlock<EntityCalenderWidget>((data) => {
      data.settings.width = v;
    });
  };

  const calendarStyle = css`
  .react-calendar {
    border: none; // Example of overriding default styles
    border-radius: 8px; // Add custom border-radius
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); // Add custom box-shadow

    .react-calendar__tile {
      &:hover {
        background-color: #f0f0f0; // Custom hover background color for tiles
      }
      &.react-calendar__tile--active {
        background-color: #009688; // Custom background color for selected date
        color: white; // Custom text color for selected date
      }
    }
  }
`;

  const widgetStyle = css`
  display: flex; // Use flexbox for layout
  flex-direction: row; // Align children in a row
  justify-content: space-around; // Distribute space around the items
  align-items: flex-start; // Align items at the start of the container
  max-width: 100%;
  height: ${height}px;
  width: ${width}px; // Parent div width
  height: ${height}px; // Parent div height
  border: 1px solid #ccc; // Just for visual confirmation
  box-sizing: border-box; // Include padding and border in the element's total width and height
  padding: 20px; // Padding inside the parent div
  overflow: auto;
`;

const listItemStyle = {
  listStyleType: 'none',
  paddingLeft: '20px',
  padding: '10px',
  border: '1px solid black', 
  marginBottom: '10px', 
};


const boxStyle = {
  border: '2px solid #ccc', 
  padding: '20px',
  margin: '20px 0',
  borderRadius: '5px',
  height:''
};


const listStyle = {
  padding: 0,
  listStyleType: 'none',
};



  

return (
  <div>
    <Slider
      aria-label="Width"
      valueLabelDisplay="auto"
      value={width}
      step={5}
      max={1070}
      onChange={(e, newValue) => {
        const value = Array.isArray(newValue) ? newValue[0] : newValue;
        setWidth(value);
        updateWidth(e, value);
      }}
    />
    <Slider
      aria-label="Height"
      valueLabelDisplay="auto"
      value={height}
      step={5}
      max={800}
      onChange={(e, newValue) => {
        const value = Array.isArray(newValue) ? newValue[0] : newValue;
        setHeight(value);
        updateHeight(e, value);
      }}
    />

    <div className={widgetStyle}>
      <div>
    <h2 style={{ 
          fontSize: '28px', 
          textAlign: 'center', 
          fontWeight: 'bold' 
        }}>
          {header}
        </h2>
        </div>
      <div className="flex flex-wrap -mx-2"> 
        <div className="w-full md:w-1/2 px-2" style={boxStyle}>
          <h2>{currentMonth}</h2>
          <ul style={listStyle}>
            {events.map((event) => (
      <li
        key={event.id}
        style={{
          ...listItemStyle,
          backgroundColor: getEventStyle(event.type).color, 
        }}
    >
      <strong>{event.title}</strong> ({event.type}) - {event.date.toLocaleDateString()}
      <p>{event.description}</p><p>{event.link}</p>
    </li>
  ))}
          </ul>
        </div>
              <div className="w-full md:w-1/2 px-2 flex items-center justify-center" style={{ height: '50vh' }}>
        <div>
          <Calendar
            onChange={handleChange}
            onActiveStartDateChange={handleActiveStartDateChange}
            value={value}
            tileContent={tileContent}
            className={calendarStyle}
            tileClassName={tileClassName}
          />
        </div>
        
        {hoveredEvent && (
          <div className="event-card" style={{
                  position: 'absolute',
                  zIndex: 10,
                  border: '1px solid black', 
                  padding: '10px',
                  backgroundColor: getEventStyle(hoveredEvent.type).color, 
                  top: '20px',
                  left: '500px',
                }}>
            <h3>{hoveredEvent.title}</h3>
            <p>Type: {hoveredEvent.type}</p>
            <p>Date: {hoveredEvent.date.toLocaleDateString()}</p>
            <p>Description: {hoveredEvent.description}</p>
            <p>Description: {hoveredEvent.link}</p> {/* Ensure 'link' is intended to be displayed here */}
          </div>
        )}
      </div>
      </div>
    </div>
  </div>
);

};
  export default CalenderWidget;
