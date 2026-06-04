import { useState } from "react";
import { generateIntro, sendMatch } from "../../api/matchApi";
import { formatCurrency, fullName } from "../../utils/formatters";
import Badge from "../ui/Badge";
import Modal from "../ui/Modal";
import CompatibilityBreakdown from "./CompatibilityBreakdown";

const MatchCard = ({ sourceCustomer, match }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [introMessage, setIntroMessage] = useState("");
  const [loadingIntro, setLoadingIntro] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const profile = match.customer;

  const openSendModal = async () => {
    setModalOpen(true);
    setError("");
    setLoadingIntro(true);
    try {
      const data = await generateIntro({
        customerId: sourceCustomer._id,
        matchedCustomerId: profile._id
      });
      setIntroMessage(data.introMessage);
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Unable to generate introduction message");
    } finally {
      setLoadingIntro(false);
    }
  };

  const handleSend = async () => {
    setSending(true);
    setError("");
    try {
      await sendMatch({
        customerId: sourceCustomer._id,
        matchedCustomerId: profile._id,
        introMessage
      });
      setSent(true);
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Unable to send match");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <article className="card p-5">
        <div className="flex flex-col justify-between gap-5 xl:flex-row">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xl font-bold text-slate-950">{fullName(profile)}</p>
                <p className="text-sm text-slate-500">
                  {profile.age} years, {profile.city}, {profile.state}
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-slate-950">{match.score}%</p>
                <p className="text-xs font-semibold uppercase tracking-normal text-slate-500">Compatibility</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge>{profile.statusTag}</Badge>
              <Badge tone="default">{profile.maritalStatus}</Badge>
              <Badge tone="default">{profile.religion}</Badge>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-600">{match.explanation}</p>
            <dl className="mt-5 grid gap-4 sm:grid-cols-3">
              <div>
                <dt className="label">Profession</dt>
                <dd className="mt-1 text-sm font-semibold text-slate-900">{profile.profession}</dd>
              </div>
              <div>
                <dt className="label">Income</dt>
                <dd className="mt-1 text-sm font-semibold text-slate-900">{formatCurrency(profile.income)}</dd>
              </div>
              <div>
                <dt className="label">Languages</dt>
                <dd className="mt-1 text-sm font-semibold text-slate-900">{profile.languagesKnown.join(", ")}</dd>
              </div>
            </dl>
            <button
              type="button"
              className="btn-secondary mt-5"
              onClick={() => setDetailsOpen((current) => !current)}
            >
              {detailsOpen ? "Hide Compatibility Details" : "View Compatibility Details"}
            </button>
          </div>
          <div className="w-full xl:w-80">
            <CompatibilityBreakdown breakdown={match.breakdown} />
            <button type="button" className="btn-primary mt-5 w-full" onClick={openSendModal}>
              Send Match
            </button>
          </div>
        </div>

        {detailsOpen ? (
          <div className="mt-5 border-t border-slate-200 pt-5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="text-sm font-bold uppercase tracking-normal text-slate-500">Detailed Compatibility</h3>
              <p className="text-sm font-bold text-slate-950">Total: {match.score}/100</p>
            </div>
            <CompatibilityBreakdown breakdown={match.breakdown} detailed />
          </div>
        ) : null}
      </article>

      {modalOpen ? (
        <Modal title={`Introduction for ${fullName(profile)}`} onClose={() => setModalOpen(false)}>
          {loadingIntro ? (
            <div className="py-8 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-950" />
              <p className="mt-3 text-sm font-medium text-slate-600">Generating personalized message</p>
            </div>
          ) : (
            <div className="space-y-4">
              {error ? <p className="rounded-md bg-rose-50 p-3 text-sm font-semibold text-rose-700">{error}</p> : null}
              {sent ? (
                <p className="rounded-md bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">
                  Match sent successfully.
                </p>
              ) : null}
              <textarea
                className="field min-h-44"
                value={introMessage}
                onChange={(event) => setIntroMessage(event.target.value)}
              />
              <div className="flex justify-end gap-3">
                <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="button" className="btn-primary" disabled={sending || sent} onClick={handleSend}>
                  {sending ? "Sending" : sent ? "Sent" : "Send Match"}
                </button>
              </div>
            </div>
          )}
        </Modal>
      ) : null}
    </>
  );
};

export default MatchCard;
