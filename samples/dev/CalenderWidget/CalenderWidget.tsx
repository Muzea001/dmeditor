import * as React from 'react';
import { css } from '@emotion/css';
import { Slider } from '@mui/material';
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
    };


    const defaultStyle = { className: null, color: 'white' };

    return styles[eventType] || defaultStyle;
  };

  //Setter alle states for variabler i komponent.

  const [width, setWidth] = useState(settings.width ?? 600);
  const [height, setHeight] = useState(settings.height ?? 300);
  const [header, setHeader] = useState(settings.header ?? 'Upcoming events');
  const [value, setValue] = useState<Value>(new Date());
  const [currentMonth, setCurrentMonth] = useState(format(new Date(), 'MMMM yyyy'));
  const [hoveredEvent, setHoveredEvent] = useState<CalendarEvent | null>(null);
  const [showAddEvent, setShowAddEvent] = useState(false);
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

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const eventToday = filteredEvents.find(event => isSameDay(event.date, date));
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

  // UI for filtervalg
  const renderFilterOptions = () => {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0' }}>
        {Object.keys(filterTypes).map(type => (
          <label key={type} className="filter-option" style={{ backgroundColor: getEventStyle(type).color }}>
            <input
              type="checkbox"
              checked={filterTypes[type]}
              onChange={() => setFilterTypes(prev => ({ ...prev, [type]: !prev[type] }))}
            /> {type}
          </label>
        ))}
      </div>
    );
  };
  

  // Setter css klasse for event basert på event type.
  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const eventToday = events.find(event => isSameDay(event.date, date));
      if (eventToday) {
        return getEventStyle(eventToday.type).className;
      }
    }
    return null;
  };


  // oppdaterer kalender view verdi, ved endring av måned eller år.
  const handleChange = (nextValue) => {
    setValue(nextValue);
  };

  // håndterer input field for event, oppdaterer data basert på input
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEventFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  //setter current month til dagens nåværende dato ved bruk av activeStartDate.
  const handleActiveStartDateChange = ({ activeStartDate }) => {
    setCurrentMonth(format(activeStartDate, 'MMMM yyyy'));
  };

  //viser add event pop-up, fjerner delete popup
  const handleShowAddEvent = () => {
    setShowAddEvent(true); // Show the add event popup
    setShowDeleteConfirm(false); // Ensure the delete confirm popup is hidden
  };

  // viser delete pop-up, fjerner add pop up
  const handleShowDeleteConfirm = () => {
    setShowDeleteConfirm(true);
    setShowAddEvent(false);
  };
  // lukker add event popup
  const handleCloseAddEvent = () => {
    setShowAddEvent(false);
  };
  // lukker delete event popup
  const handleCloseDeleteConfirm = () => {
    setShowDeleteConfirm(false);
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
  // håndterer adding av event, sender data til backend, lukker adding pop-up ved ved bekreftelse
  const handleAddEvent = (e) => {
    e.preventDefault();
    console.log(eventFormData);
    setShowAddEvent(false);
    setEventFormData({
      title: '',
      type: '',
      description: '',
      link: '',
      date: new Date(),
    });
  };

  // css style for hele widget.
  const widgetStyle = css`
  display: flex; // Use flexbox for layout
  flex-direction: row; // Align children in a row
  justify-content: space-around; // Distribute space around the items
  align-items: flex-start; // Align items at the start of the container
  max-width: 100%;
  height: ${height}px;
  width: ${width}px; // Parent div width
  border: 1px solid #ccc; // Just for visual confirmation
  box-sizing: border-box; // Include padding and border in the element's total width and height
  padding: 20px; // Padding inside the parent div
  overflow: scroll;
  > * { /* Direct children, adjust as needed */
  flex-grow: 1; /* Allow children to grow and fill the space */
  max-height: 100%; /* Prevent them from exceeding the container's height */
  overflow: scroll; /* Hide overflow, if scaling down is preferred */
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
      {/*tittel rendering med egen styling */}
      <h2 style={{ textAlign: 'center', fontWeight: 'bold', padding: '10px' }}>{header}</h2>
      {/*wrapper alle div's innen widget style css klassen, og flex wrap tailwind klasser for responsivitet */}
      <div className={widgetStyle}>
        <div className="flex flex-wrap -mx-2">
          <div className="w-full md:w-1/2 px-2" style={boxStyle}>
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
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <button
                style={{
                  fontSize: '24px',
                  cursor: 'pointer',
                  backgroundColor: 'green',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '5px',
                }}
              >
            //
              </button>


              <button onClick={handleShowAddEvent} style={{
                fontSize: '24px',
                cursor: 'pointer',
                backgroundColor: '#008CBA',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '5px',
              }}>+</button>

              <button onClick={handleShowDeleteConfirm}
                style={{
                  fontSize: '24px',
                  cursor: 'pointer',
                  backgroundColor: 'red',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '5px',
                }}
              >
                --
              </button>
            </div>
            {/* rendering av popup vindu for sletting av events*/}
            {showDeleteConfirm && (
              <div style={{
                position: 'fixed',
                top: '60%',
                left: '40%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: '#fff',
                padding: '20px',
                borderRadius: '5px',
                zIndex: 1000,
                border: '1px solid black'
              }}>
                <h3>Are you sure you want to delete this element?</h3>
                <div>
                  {/* This list will contain the elements to be deleted in the future */}
                  <select style={{ display: 'block', marginBottom: '20px' }}>
                    {/* Option elements go here */}
                  </select>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                  <button
                    onClick={handleCloseDeleteConfirm}
                    style={{
                      cursor: 'pointer',
                      backgroundColor: 'grey',
                      color: 'white',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '5px',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleCloseDeleteConfirm}
                    style={{
                      cursor: 'pointer',
                      backgroundColor: 'red',
                      color: 'white',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '5px',
                    }}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            )}
            {/* Rendering av add event pop-up vindu*/}
            {showAddEvent && (
              <div style={{
                position: 'fixed',
                top: '60%', left: '40%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: '#fff',
                padding: '20px',
                borderRadius: '5px',
                border: '1px solid black',
                zIndex: 1000
              }}>
                <h3>Add New Event</h3>
                <form onSubmit={handleAddEvent} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <input
                    type="text"
                    name="title"
                    value={eventFormData.title}
                    onChange={handleFormChange}
                    placeholder="Event Title"
                    style={{ margin: '5px 0' }}
                  />
                  <select
                    name="type"
                    value={eventFormData.type}
                    onChange={handleFormChange}
                    style={{ margin: '5px 0' }} 
                  >
                    {['meeting', 'course', 'tournament', 'diverse events'].map((eventType) => (
                      <option key={eventType} value={eventType}>{eventType}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    name="description"
                    value={eventFormData.description}
                    onChange={handleFormChange}
                    placeholder="Description"
                    style={{ margin: '5px 0' }}
                  />
                  <input
                    type="text"
                    name="link"
                    value={eventFormData.link}
                    onChange={handleFormChange}
                    placeholder="Link"
                    style={{ margin: '5px 0' }} 
                  />
                  <input
                    type="date"
                    name="date"
                    value={eventFormData.date.toISOString().substring(0, 10)}
                    onChange={handleFormChange}
                    style={{ margin: '5px 0' }} 
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <button
                      type="button"
                      onClick={handleCloseAddEvent}
                      style={{ margin: '5px 0' }} 
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      style={{ margin: '5px 0' }} 
                    >
                      Add Event
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
          {/*Rendering av kalender, kaller tag script av importert kalender og warpper i tailwind */}
          <div className="w-full md:w-1/2 px-2 flex items-center justify-center" style={{ height: '50vh' }}>
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
            {hoveredEvent && (
              <div className="event-card" style={{
                position: 'absolute',
                zIndex: 10,
                border: '1px solid black',
                padding: '10px',
                backgroundColor: getEventStyle(hoveredEvent.type).color,
                top: '60%',
                right: '40%',
              }}>
                <h3>{hoveredEvent.title}</h3>
                <p>Date: {hoveredEvent.date.toLocaleDateString()}</p>

              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

};
export default CalenderWidget;
