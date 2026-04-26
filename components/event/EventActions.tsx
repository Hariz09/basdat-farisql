"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Edit, LoaderCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteEventAction } from "@/app/event-actions";
import { Button } from "@/components/ui/button";
import type { Role } from "@/lib/session";

type EventActionsProps = {
  eventId: string;
  eventTitle: string;
  role: Extract<Role, "admin" | "organizer">;
  afterDeleteHref?: string;
  compact?: boolean;
};

export default function EventActions({
  eventId,
  eventTitle,
  role,
  afterDeleteHref,
  compact = false,
}: EventActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const listHref = afterDeleteHref ?? `/${role}/events`;
  const editHref = `/${role}/events/${eventId}/edit`;

  const handleDelete = () => {
    if (!window.confirm(`Hapus acara "${eventTitle}"?`)) {
      return;
    }

    startTransition(async () => {
      const result = await deleteEventAction(eventId);

      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      router.push(listHref);
      router.refresh();
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size={compact ? "icon-sm" : "sm"}
        onClick={() => router.push(editHref)}
      >
        <Edit />
        {!compact ? "Edit" : null}
      </Button>

      <Button
        type="button"
        variant="destructive"
        size={compact ? "icon-sm" : "sm"}
        onClick={handleDelete}
        disabled={isPending}
      >
        {isPending ? <LoaderCircle className="animate-spin" /> : <Trash2 />}
        {!compact ? (isPending ? "Menghapus..." : "Hapus") : null}
      </Button>
    </div>
  );
}
