'use client';

import Navbar from '@/components/Navbar';
import React, { useState, useEffect } from 'react';
import { format, eachDayOfInterval, startOfMonth, endOfMonth, addMonths } from 'date-fns';

interface Resident {
  id: number;
  name: string;
  specialty: string;
  start_date: string;
  end_date: string;
}

interface Setting {
  specialty: string;
  monthly_limit: number;
}

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="container-fluid mt-4">
        <Calendar />
      </main>
    </>
  );
}

function Calendar() {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [settings, setSettings] = useState<Setting[]>([]);
  const [summary, setSummary] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    Promise.all([
      fetch('/api/residents').then(res => res.json()),
      fetch('/api/settings').then(res => res.json())
    ]).then(([residentData, settingsData]) => {
      setResidents(residentData);
      setSettings(settingsData);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (loading || settings.length === 0) return;

    const monthsToDisplay = [startOfMonth(currentDate), startOfMonth(addMonths(currentDate, 1)), startOfMonth(addMonths(currentDate, 2))];

    const newSummary = monthsToDisplay.map(monthDate => {
      const monthStart = monthDate;
      const monthEnd = endOfMonth(monthDate);
      const monthName = format(monthDate, 'MMMM');

      const specialtyCounts = settings.map(setting => {
        const count = residents.filter(res => {
          const resStart = new Date(res.start_date);
          const resEnd = new Date(res.end_date);
          return res.specialty === setting.specialty && resStart <= monthEnd && resEnd >= monthStart;
        }).length;

        return {
          name: setting.specialty,
          count: count,
          limit: setting.monthly_limit
        };
      });

      return { monthName, specialtyCounts };
    });

    setSummary(newSummary);
  }, [residents, settings, currentDate, loading]);

  const abbreviateSpecialty = (specialty: string) => {
    switch (specialty) {
      case 'Radiologie':
        return 'Rad';
      case 'Pediatrie':
        return 'Ped';
      case 'Alta':
        return 'Alt';
      default:
        return specialty;
    }
  }

  const getSpecialtyColor = (specialty: string) => {
    switch (specialty) {
      case 'Radiologie':
        return '#B22222'; // firebrick
      case 'Pediatrie':
        return '#FFA500'; // orange
      case 'Alta':
        return '#32CD32'; // limegreen
      default:
        return ''
    }
  }

  const handlePrevMonth = () => {
    setCurrentDate(prev => addMonths(prev, -1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => addMonths(prev, 1));
  };

  const startDate = startOfMonth(currentDate);
  const endDate = endOfMonth(addMonths(currentDate, 2)); // 3 months view
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between mb-3 align-items-center calendar-nav-sticky">
          <button className="btn btn-primary" onClick={handlePrevMonth}>Luna Precedenta</button>
          <h3>{format(currentDate, 'MMMM yyyy')} - {format(addMonths(currentDate, 2), 'MMMM yyyy')}</h3>
          <button className="btn btn-primary" onClick={handleNextMonth}>Luna Urmatoare</button>
      </div>

      <div className="d-flex justify-content-around p-2 bg-light border-bottom summary-sticky text-center">
        {summary.map(monthData => (
            <div key={monthData.monthName}>
                <strong>{monthData.monthName}</strong>
                <div className="d-flex flex-wrap justify-content-center">
                    {monthData.specialtyCounts.map((spec: any) => (
                        <span className="mx-2" key={spec.name}>
                            {abbreviateSpecialty(spec.name)}: {spec.count} / {spec.limit}
                        </span>
                    ))}
                </div>
            </div>
        ))}
      </div>

      <div className="calendar-scroll-container">
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th className="sticky-col first-col" style={{minWidth: '200px'}}>Nume si Prenume</th>
                <th className="sticky-col second-col d-none d-md-table-cell" style={{minWidth: '60px'}}>Spe</th>
                {days.map(day => (
                  <th key={day.toString()} className="text-center" style={{minWidth: '30px', padding: '0.25rem'}}>
                    <div>{format(day, 'dd')}</div>
                    <div>{format(day, 'MM')}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {residents.map(resident => (
                <tr key={resident.id}>
                  <td className="sticky-col first-col">{resident.name}</td>
                  <td className="sticky-col second-col d-none d-md-table-cell">{abbreviateSpecialty(resident.specialty)}</td>
                  {days.map(day => {
                    const isScheduled = eachDayOfInterval({
                      start: new Date(resident.start_date),
                      end: new Date(resident.end_date)
                    }).some(d => format(d, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd'));
    
                    const style = isScheduled ? { backgroundColor: getSpecialtyColor(resident.specialty), color: 'white' } : {};
    
                    return (
                      <td key={day.toString()} style={style}>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}