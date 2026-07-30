"use client";

import { Modal } from "@/components/ui/Modal";
import { IssueDetailModalCard } from "@/components/IssueDetailModal";
import { getContentIssueFailure, type ContentModalItem } from "@/lib/mockData";

export function FailureIssueModal({
  open,
  onClose,
  item,
}: {
  open: boolean;
  onClose: () => void;
  item: ContentModalItem | null;
}) {
  const data = item ? getContentIssueFailure(item.id) : null;

  return (
    <Modal
      open={open && item !== null}
      onClose={onClose}
      className="max-w-[min(800px,calc(100vw-80px))]"
    >
      {item && data && (
        <IssueDetailModalCard item={item} data={data} onClose={onClose} />
      )}
    </Modal>
  );
}
