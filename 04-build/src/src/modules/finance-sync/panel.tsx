import { useState } from "react";
import { formatGBP } from "../../domain/money";
import { salon } from "../../data/session";
import { HTTP_FINANCE_BLOCKED } from "./adapter";
import { loadFinanceSyncConfig, saveFinanceSyncConfig, type FinanceSyncConfig } from "./config";
import { buildDailyCashUp, sourceForPreview } from "./payload";
import { reconcileCashUp } from "./reconcile";

/** Admin control for the optional finance-sync module. Nothing is sent. */
export function FinanceSyncPanel() {
  const siteId = salon.privateData?.settings.siteId ?? "site-sample-1";
  const [config, setConfig] = useState<FinanceSyncConfig>(() => loadFinanceSyncConfig(siteId));
  const [preview, setPreview] = useState("");
  const [note, setNote] = useState("");

  function update(next: FinanceSyncConfig) {
    setConfig(saveFinanceSyncConfig(next));
  }

  return (
    <section className="card">
      <h2>Tony's finance app</h2>
      <p className="banner"><strong>OPTIONAL / NOT CONNECTED</strong></p>
      <p className="muted">{HTTP_FINANCE_BLOCKED}. Product cost pull and invoice sync are not in this scaffold.</p>
      <label>
        <span>
          <input
            type="checkbox"
            checked={config.enabled}
            onChange={(event) => update({ ...config, enabled: event.target.checked })}
          />
          Finance sync for this salon
        </span>
      </label>
      <p className="muted">Default off. Turning this on stores the choice on this device only. It does not call an API.</p>
      <label>Base URL<input readOnly value={config.baseUrl} /></label>
      <label>Auth<input readOnly value={config.authType} /></label>
      <label>Posting time (Europe/London)
        <input value={config.postingTime} onChange={(event) => update({ ...config, postingTime: event.target.value })} />
      </label>
      <button
        className="btn"
        type="button"
        onClick={() => {
          const data = salon.privateData;
          if (!data) {
            setNote("Unlock the device to preview SAMPLE data.");
            return;
          }
          const source = sourceForPreview(data);
          const payload = buildDailyCashUp(source);
          const report = reconcileCashUp(source, payload);
          setPreview(JSON.stringify(payload, null, 2));
          setNote(
            report.matched
              ? `SAMPLE ${source.businessDate}. Till expected cash ${formatGBP(report.tillExpectedCashPence)} matches this payload. Not sent.`
              : report.notes.join(" "),
          );
        }}
      >
        Preview cash-up payload
      </button>
      {note && <p role="status">{note}</p>}
      {preview && <pre>{preview}</pre>}
    </section>
  );
}
