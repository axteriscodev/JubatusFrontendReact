import { useSelector } from "react-redux";

export default function MailConfirmation() {
  const userEmail = useSelector((state) => state.cart.eventId);

  async function handleSubmit(event, data) {}

  return (
    <div className="form-sm">
      <div className="my-md text-start">
        <h2>
            Acquisto effettuato con l'email <strong>{userEmail}</strong>. È corretta?
        </h2>
      </div>
      <MailForm submitHandle={handleSubmit} />
    </div>
  );
}
