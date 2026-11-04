import { NewsForm } from "@/components/admin/NewsForm";
import { PageHeader } from "@/components/admin/fields";
import { isR2Configured } from "@/lib/r2";

export default function NewNews() {
  return (<><PageHeader title="Nouvelle actualité" /><NewsForm directUploads={isR2Configured()} /></>);
}
