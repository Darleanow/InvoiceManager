import { useState, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { FiCalendar } from 'react-icons/fi';
import styles from './DateFormSelector.module.scss';

export default function DateFormSelector({ label, onDateChange }) {
  const [selectedDate, setSelectedDate] = useState('');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isWarningVisible, setIsWarningVisible] = useState(false);
  const [fadeClass, setFadeClass] = useState('fade-in');
  const [isRendered, setIsRendered] = useState(false);
  const calendarRef = useRef(null);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    onDateChange(date);

    const today = new Date().toISOString().split('T')[0];
    setIsWarningVisible(date < today);

    closeCalendar();
  };

  const toggleCalendar = () => {
    if (isCalendarOpen) {
      closeCalendar();
    } else {
      setIsRendered(true);
      setFadeClass('fade-in');
      setIsCalendarOpen(true);
    }
  };

  const closeCalendar = () => {
    setFadeClass('fade-out');
    setTimeout(() => {
      setIsCalendarOpen(false);
      setIsRendered(false);
    }, 300);
  };

  const handleClickOutside = useCallback((event) => {
    if (calendarRef.current && !calendarRef.current.contains(event.target)) {
      closeCalendar();
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <div className={styles.date_form_selector}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.custom_date_input} onClick={toggleCalendar}>
        <input
          type="text"
          value={selectedDate || 'Select a date'}
          readOnly
          className={`${styles.date_input} ${isWarningVisible ? styles.warning_input : ''}`}
        />
        <FiCalendar className={styles.calendar_icon} />
      </div>
      {isRendered && (
        <div
          ref={calendarRef}
          className={`${styles.calendar_popup} ${styles[fadeClass]}`}
        >
          <Calendar
            selectedDate={selectedDate}
            onDateSelect={handleDateChange}
          />
        </div>
      )}
      {isWarningVisible && (
        <div className={styles.warning_message}>
          <p>
            <FiCalendar /> The selected date is in the past!
          </p>
        </div>
      )}
    </div>
  );
}

DateFormSelector.propTypes = {
  label: PropTypes.string,
  onDateChange: PropTypes.func.isRequired,
};

function Calendar({ selectedDate, onDateSelect }) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [slideClass, setSlideClass] = useState('');
  const [isSliding, setIsSliding] = useState(false);

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const handleDayClick = (day) => {
    const selectedDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    onDateSelect(selectedDate);
  };

  const handlePreviousMonth = () => {
    if (!isSliding) {
      setIsSliding(true);
      setSlideClass(styles['slide-out-left']);

      setTimeout(() => {
        setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1));
        setCurrentYear((prev) => (currentMonth === 0 ? prev - 1 : prev));
        setSlideClass(styles['slide-in-right']);

        setTimeout(() => {
          setSlideClass(styles['slide-in-active']);
          setIsSliding(false);
        }, 100);
      }, 300);
    }
  };

  const handleNextMonth = () => {
    if (!isSliding) {
      setIsSliding(true);
      setSlideClass(styles['slide-out-left']);

      setTimeout(() => {
        setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1));
        setCurrentYear((prev) => (currentMonth === 11 ? prev + 1 : prev));
        setSlideClass(styles['slide-in-right']);

        setTimeout(() => {
          setSlideClass(styles['slide-in-active']);
          setIsSliding(false);
        }, 100);
      }, 300);
    }
  };

  return (
    <div className={styles.calendar}>
      <div className={styles.calendar_header}>
        <button onClick={handlePreviousMonth} className={styles.nav_button}>
          &lt;
        </button>
        <span className={styles.month_year}>
          {new Date(currentYear, currentMonth).toLocaleString('en-US', {
            month: 'long',
            year: 'numeric',
          })}
        </span>
        <button onClick={handleNextMonth} className={styles.nav_button}>
          &gt;
        </button>
      </div>
      <div className={styles.calendar_days_container}>
        <div className={`${styles.calendar_days} ${slideClass}`}>
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
            <button
              key={day}
              onClick={() => handleDayClick(day)}
              className={styles.calendar_day}
            >
              {day}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

Calendar.propTypes = {
  selectedDate: PropTypes.string,
  onDateSelect: PropTypes.func.isRequired,
};
