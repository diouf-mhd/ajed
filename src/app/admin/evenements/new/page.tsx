import { EventForm } from "@/components/admin/EventForm";
import { PageHeader } from "@/components/admin/fields";
import { isR2Configured } from "@/lib/r2";

export default function NewEvent() {
  return (<><PageHeader title="Nouvel événement" /><EventForm directUploads={isR2Configured()} /></>);
}
