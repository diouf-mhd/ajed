import { EventForm } from "@/components/admin/EventForm";
import { PageHeader } from "@/components/admin/fields";

export default function NewEvent() {
  return (<><PageHeader title="Nouvel événement" /><EventForm /></>);
}
