import * as React from 'react';
import { css } from '@emotion/css';
import { Slider } from '@mui/material';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { EntityCalenderWidget } from './entity';
import { useEditorStore } from 'Src/core';
import { DME } from 'Src/core/types';
import Calendar from 'react-calendar';
import { format, isSameDay } from 'date-fns'
import { CalendarEvent } from './CalenderEvent'
import './Styles/CustomCalender.css'



const { useState, useEffect } = React;

export const CalenderWidget = (props: DME.WidgetRenderProps<EntityCalenderWidget>) => {
  const {
    blockNode: {
      data: { settings },
    },
  } = props;

  type ValuePiece = Date | null;

  type Value = ValuePiece | [ValuePiece, ValuePiece];

  //Setter in farger for celler i kalender

  const injectTileStyles = () => {
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
      .meeting-tile { background-color: lightyellow !important; }
      .course-tile { background-color: lightblue !important; }
      .tournament-tile { background-color: lightgreen !important; }
      .diverse-event-tile { background-color: pink !important; }
      .multi-event { background-color: gray !important; }
    `;
    document.head.appendChild(style);
  };


  // Mock data
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
    {
      id: '7',
      date: new Date(2024, 4, 13),
      title: 'diverse',
      type: 'diverse events',
      description: 'Advancedt',
      link: 'https://oslomet.no'
    },
    {
      id: '5',
      date: new Date(2024, 4, 13),
      title: 'Møtet',
      type: 'meeting',
      description: 'Advanced concepts of React',
      link: 'https://oslomet.no'
    },
    {
      id: '6',
      date: new Date(2024, 4, 27),
      title: 'Kurs',
      type: 'course',
      description: 'Advanced concepts of React',
      link: 'https://oslomet.no'
    },


  ]);

  // Definisjon av farger som samsvarer med event typer
  const getEventStyle = (eventType) => {
    const styles = {
      'meeting': { className: 'meeting-tile', color: 'lightyellow' },
      'course': { className: 'course-tile', color: 'lightblue' },
      'tournament': { className: 'tournament-tile', color: 'lightgreen' },
      'diverse events': { className: 'diverse-event-tile', color: 'pink' },
      'multi-event': { className: 'multi-event', color: 'gray' },
    };


    const defaultStyle = { className: null, color: 'white' };

    return styles[eventType] || defaultStyle;
  };

  //Setter alle states for variabler i komponent.

  const [width, setWidth] = useState(settings.width ?? 600);
  const [position, setPosition] = useState(settings.position ?? 'right');
  const [height, setHeight] = useState(settings.height ?? 300);
  const [header, setHeader] = useState(settings.header ?? 'Upcoming events');
  const [value, setValue] = useState<Value>(new Date());
  const [currentMonth, setCurrentMonth] = useState(format(new Date(), 'MMMM yyyy'));
  //const [hoveredEvent, setHoveredEvent] = useState<CalendarEvent | null>(null);
  const [hoveredEvent, setHoveredEvent] = useState<CalendarEvent[]>([]); // hoveredEvent is now an array
  //console.log(hoveredEvent);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const [eventFormData, setEventFormData] = useState({
    title: '',
    type: '',
    description: '',
    link: '',
    date: new Date(),
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [filterTypes, setFilterTypes] = useState({   // Legger til en state for å holde filtervalg
    meeting: true,
    course: true,
    tournament: true,
    'diverse events': true,
  });
  const filteredEvents = events.filter(event => filterTypes[event.type]);


  // Setter innhold for kalender dersom hendelse eksisterer. setter event handlers for hover av hendelser.
  function isSameCalendarDay(date1: Date, date2: Date) {
    return date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate();
  }
  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const eventsToday = events.filter(event => isSameCalendarDay(event.date, date));
      
      if (eventsToday.length > 0) {
        return (
          <div
            style={{ width: '100%', height: '100%', cursor: 'pointer' }}
            onMouseEnter={(e) => {
              setHoveredEvent(eventsToday);
              // Update the mouse position state
              setMousePosition({ x: e.clientX, y: e.clientY });
            }}
            onMouseLeave={() => setHoveredEvent([])}
          >
            {eventsToday.map((event, index) => (
              <div key={index}>
                {/* Display event details here */}
              </div>
            ))}
          </div>
        );
      }
    }
    return null;
  };
  

  // Setter css klasse for event basert på event type.
  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const eventsToday = events.filter(event => isSameCalendarDay(event.date, date));
      if (eventsToday.length > 1) {
        return getEventStyle('multi-event').className; // Return the class for 'multi-event'
      } else if (eventsToday.length === 1) {
        return getEventStyle(eventsToday[0].type).className;
      }
    }
    return null;
  };


  // oppdaterer kalender view verdi, ved endring av måned eller år.
  const handleChange = (nextValue) => {
    setValue(nextValue);
  };

  //setter current month til dagens nåværende dato ved bruk av activeStartDate.
  const handleActiveStartDateChange = ({ activeStartDate }) => {
    setCurrentMonth(format(activeStartDate, 'MMMM yyyy'));
  };


  const handlePositionChange = (event) => {
    setPosition(event.target.value);
  };

  // data endring.
  const { updateSelectedBlock } = useEditorStore();

  // fetcher data og endringer for variabler ved rendering. injecter celle still og initialiserer variabler
  useEffect(() => {
    injectTileStyles();
    setHeight(settings.height ?? 300);
    setWidth(settings.width ?? 1070);
    setHeader(settings.header ?? 'Upcoming Events')
  }, [settings, value]);

  // funksjon for endring ev høyde
  const updateHeight = (e, v) => {
    updateSelectedBlock<EntityCalenderWidget>((data) => {
      data.settings.height = v;
    });
  };

  // funksjon for endring ev tittel
  const updateHeader = (e, v) => {
    updateSelectedBlock<EntityCalenderWidget>((data) => {
      data.settings.header = v;
    });
  };
  
  // funksjon for endring ev bredde
  const updateWidth = (e, v) => {
    updateSelectedBlock<EntityCalenderWidget>((data) => {
      data.settings.width = v;
    });
  };

  const updatePosition = (e, v) => {
    updateSelectedBlock<EntityCalenderWidget>((data) => {
      data.settings.position = v;
    });
  };

  // css style for hele widget.
  const widgetStyle = css`
  display: flex;
  flex-direction: ${getPositionStyle(position)}; // Dynamically set based on position state
  justify-content: space-around;
  align-items: flex-start;
  max-width: 100%;
  height: ${height}px;
  width: ${width}px;
  border: 1px solid #ccc;
  box-sizing: border-box;
  padding: 20px;
  overflow: scroll;
  > * {
    flex-grow: 1;
    max-height: 100%;
    overflow: scroll;
  }
  
`;
  // css style for event elementer inn i liste
  const listItemStyle = {
    listStyleType: 'none',
    textAlign: 'center',
    paddingLeft: '20px',
    padding: '10px',
    border: '1px solid black',
    marginBottom: '10px',
  };

  // css style for event box
  const boxStyle = {
    border: '2px solid #ccc',
    padding: '20px',
    margin: '20px 0',
    width: '40%',
    borderRadius: '5px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  };

  // css for container som inneholder alle elementer.
  const listStyle = {
    padding: 0,
    maxHeight: '800px',
    listStyleType: 'none',
    overflowY: 'auto'
  };



  //return jsx

  return (
    <div>
      {/*Renderer slidere for bredde og høyde */}
      <Slider
        aria-label="Width"
        valueLabelDisplay="auto"
        value={width}
        step={5}
        max={1080}
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
        max={1920}
        onChange={(e, newValue) => {
          const value = Array.isArray(newValue) ? newValue[0] : newValue;
          setHeight(value);
          updateHeight(e, value);
        }}
      />
        <FormControl fullWidth>
        <InputLabel id="position-select-label">Position</InputLabel>
        <Select
          labelId="position-select-label"
          id="position-select"
          value={position}
          label="Position / Visibility"
          onChange={handlePositionChange}
        >
          <MenuItem value="left">Left</MenuItem>
          <MenuItem value="right">Right</MenuItem>
          <MenuItem value="above">Above</MenuItem>
          <MenuItem value="below">Below</MenuItem>
          <MenuItem value="hideEventList">Hide Event List</MenuItem>
          <MenuItem value="hideCalendar">Hide Calendar</MenuItem>
        </Select>
      </FormControl>
      {/*tittel rendering med egen styling */}
      <h2 style={{ textAlign: 'center', fontWeight: 'bold', padding: '10px' }}>{header}</h2>
      {/*wrapper alle div's innen widget style css klassen, og flex wrap tailwind klasser for responsivitet */}
      <div className={widgetStyle}>
      {position !== 'hideEventList' && (
          <div style={boxStyle}>
            {/*Event liste rendering, starter med filter, mapper elementer og henter farger, starter med første to */}
            <h2>{currentMonth}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '10px' }}>
                {['meeting', 'course'].map((eventType) => {
                  const { color } = getEventStyle(eventType);
                  return (
                    <label key={eventType} style={{ display: 'flex', alignItems: 'center', backgroundColor: color, padding: '5px 10px', borderRadius: '5px' }}>
                      <input
                        type="checkbox"
                        value={eventType}
                        style={{ accentColor: color, marginRight: '5px' }}
                      // onChange handler here to update filter state
                      />
                      {eventType}
                    </label>
                  );
                })}
              </div>
              {/* andre to filtrerings options*/}
              <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                {['tournament', 'diverse events'].map((eventType) => {
                  const { color } = getEventStyle(eventType);
                  return (
                    <label key={eventType} style={{ display: 'flex', alignItems: 'center', backgroundColor: color, padding: '5px 10px', borderRadius: '5px' }}>
                      <input
                        type="checkbox"
                        value={eventType}
                        style={{ accentColor: color, marginRight: '5px' }}
                      />
                      {eventType}
                    </label>
                  );
                })}
              </div>
            </div>
            {/*rendering av event liste, mapper og assigner farge ved bruk av getEventStyle */}
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
              {/*knapper for edit, add og delete */}
            </ul>
           </div>
      )}
           
          {/*Rendering av kalender, kaller tag script av importert kalender og warpper i tailwind */}
          {position !== 'hideCalendar' && (
          <div>
            <div>
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginLeft: '50px' }}>
                {/*<h2>{currentMonth}</h2> */}
                {renderFilterOptions()}
              </div>
              <Calendar
                onChange={handleChange}
                onActiveStartDateChange={handleActiveStartDateChange}
                value={value}
                tileContent={tileContent}
                tileClassName={tileClassName}
              />
            </div>
            {/* Rendering av hover vindu for hendelser i kalender*/}
            {hoveredEvent && hoveredEvent.length > 0 && (
              <div className="event-card" style={{
                position: 'absolute',
                left: `${mousePosition.x}px`,
                top: `${mousePosition.y}px`,
                transform: 'translate(0px, 0px)',
                zIndex: 10,
                border: '1px solid black',
                padding: '10px',
                backgroundColor: 'white', // You can adjust the background as needed
                pointerEvents: 'none',
              }}>
                {hoveredEvent.map((event, index) => (
                  <div key={index} style={{marginBottom: '5px'}}>
                    <h3>{event.title}</h3>
                    <p>Date: {event.date.toLocaleDateString()}</p>
                    {/* Add more details as needed */}
                  </div>
                ))}
              </div>
            )}

          </div>
          )}
        </div>
    </div>
  );

};
export default CalenderWidget;
