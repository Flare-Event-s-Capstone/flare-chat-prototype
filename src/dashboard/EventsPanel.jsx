import { useEffect, useState } from "react";
import "./EventsPanel.css";
import { useOutletContext } from "react-router-dom";
import { t } from "../util/i18n";

export default function EventsPanel() {
  const events = [
    {
      id: 1,
      type: "future",
      date: "March 2",
      time: "7:00 PM",
      venue: "Mossop’s Social House",
      city: "Toronto",
      status: "scheduled",
      early: 40,
      regular: 45,
    },
    {
      id: 2,
      type: "future",
      date: "March 18",
      time: "7:00 PM",
      venue: "Steam Whistle Brewing",
      city: "Toronto",
      status: "scheduled",
      early: 40,
      regular: 45,
    },
    {
      id: 3,
      type: "attended",
      date: "February 14",
      time: "7:00 PM",
      venue: "Example Venue",
      city: "Toronto",
      status: "scheduled",
      early: 35,
      regular: 40,
    },
  ];

	const { me, setMobileTitle, onMeSettingsUpdated } = useOutletContext();

	useEffect(() => {
		setMobileTitle(t("events"));
	}, []);
  const [rsvp, setRsvp] = useState({});
  const [booked, setBooked] = useState({});

  function handleRsvp(id, value) {
    setRsvp({ ...rsvp, [id]: value });
  }

  function handleBook(id) {
    setBooked({ ...booked, [id]: true });
  }

  const future = events.filter((e) => e.type === "future");
  const attended = events.filter((e) => e.type === "attended");

  return (
    <div className="panel">
      <div className="panel-header">
        <h2>Events</h2>
      </div>

      <section>
        <h3 className="evt-title">Future Events</h3>
        <div className="evt-grid">
          {future.map((e) => (
            <div key={e.id} className="evt-card">
              <div className="evt-date">{e.date}</div>

              <div className="evt-line">
                <span>Time</span>
                <strong>{e.time}</strong>
              </div>

              <div className="evt-line">
                <span>Venue</span>
                <strong>{e.venue}</strong>
              </div>

              <div className="evt-line">
                <span>City</span>
                <strong>{e.city}</strong>
              </div>

              <div className="evt-line">
                <span>Status</span>
                <strong>
                  {e.status === "canceled" ? "Canceled" : "Scheduled"}
                </strong>
              </div>

              <div className="evt-prices">
                <div>Early Bird: ${e.early}</div>
                <div>Regular: ${e.regular}</div>
              </div>

              <div className="evt-actions">
                <select
                  value={rsvp[e.id] || ""}
                  onChange={(ev) => handleRsvp(e.id, ev.target.value)}
                >
                  <option value="">RSVP</option>
                  <option value="going">Going</option>
                  <option value="maybe">Maybe</option>
                  <option value="not">Not Going</option>
                </select>

                <button onClick={() => handleBook(e.id)}>
                  {booked[e.id] ? "Booked " : "Book Your Spot"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="evt-title">Attended Events</h3>
        <div className="evt-grid">
          {attended.map((e) => (
            <div key={e.id} className="evt-card">
              <div className="evt-date">{e.date}</div>

              <div className="evt-line">
                <span>Time</span>
                <strong>{e.time}</strong>
              </div>

              <div className="evt-line">
                <span>Venue</span>
                <strong>{e.venue}</strong>
              </div>

              <div className="evt-line">
                <span>City</span>
                <strong>{e.city}</strong>
              </div>

              <div className="evt-line">
                <span>Status</span>
                <strong>
                  {e.status === "canceled" ? "Canceled" : "Scheduled"}
                </strong>
              </div>

              <div className="evt-prices">
                <div>Early Bird: ${e.early}</div>
                <div>Regular: ${e.regular}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
