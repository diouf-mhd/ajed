import type { Event } from "@prisma/client";
import { Field, ImageField, Select, STATUS_OPTIONS, TextArea } from "./fields";
import { DeleteButton, SubmitButton } from "./ui";
import { toInputDate } from "@/lib/utils";
import { deleteEvent, saveEvent } from "@/app/admin/server-actions";

export function EventForm({ event }: { event?: Event | null }) {
  return (
    <>
      <form action={saveEvent} className="max-w-3xl space-y-5 rounded-3xl bg-white p-6 ring-1 ring-black/10 sm:p-8">
        {event && <input type="hidden" name="id" value={event.id} />}
        <Field label="Titre" name="title" required defaultValue={event?.title} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Date" name="date" type="date" required defaultValue={toInputDate(event?.date)} />
          <Field label="Heure" name="time" placeholder="09h00" defaultValue={event?.time ?? ""} />
        </div>
        <Field label="Lieu" name="location" required defaultValue={event?.location} />
        <TextArea label="Description" name="description" required defaultValue={event?.description} />
        <ImageField label="Image" name="imageFile" keepName="image" current={event?.image} />
        <Select label="Statut" name="status" options={STATUS_OPTIONS} defaultValue={event?.status ?? "DRAFT"} />
        <SubmitButton>{event ? "Enregistrer" : "Créer l'événement"}</SubmitButton>
      </form>
      {event && (
        <form action={deleteEvent} className="mt-6"><input type="hidden" name="id" value={event.id} /><DeleteButton label="Supprimer l'événement" /></form>
      )}
    </>
  );
}
