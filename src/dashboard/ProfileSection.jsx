import { useEffect, useState } from "react";
import "./Modal.css";
import { getMe } from "../services/api";
import { t } from "../util/i18n";

export default function ProfileSection({ me }) {
  const [email, setEmail] = useState(me?.email || "");
  const [first, setFirst] = useState(me?.firstname || "");
  const [last, setLast] = useState(me?.lastname || "");

  useEffect(() => {
    (async () => {
      try {
        const data = await getMe();
        setEmail(data?.email || "");
        setFirst(data?.firstname || "");
        setLast(data?.lastname || "");
      } catch {}
    })();
  }, []);

  return (
    <div className="modal-form">
      <div className="modal-field">
        <label className="modal-label">{t("firstName")}</label>
        <input className="modal-input" value={first || "—"} disabled readOnly />
      </div>

      <div className="modal-field">
        <label className="modal-label">{t("lastName")}</label>
        <input className="modal-input" value={last || "—"} disabled readOnly />
      </div>

      <div className="modal-field">
        <label className="modal-label">{t("email")}</label>
        <input className="modal-input" value={email || "—"} disabled readOnly />
      </div>

      <div className="modal-field">
        <label className="modal-label">{t("bio")}</label>
        <textarea
          className="modal-textarea"
          rows={3}
          placeholder={t("comingSoon")}
          disabled
        />
      </div>
    </div>
  );
}
