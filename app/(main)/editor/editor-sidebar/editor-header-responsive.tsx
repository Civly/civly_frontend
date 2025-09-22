"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  IconPencil,
  IconLock,
  IconLockOpen,
  IconX,
  IconShare,
  IconFileTypePdf,
  IconTrash,
  IconDotsVertical,
  IconCircleCheck,
  IconLoader2,
  IconAlertTriangle,
  IconClockHour4,
  IconDeviceFloppy,
} from "@tabler/icons-react";
import { useMediaQuery } from "usehooks-ts";
import { useSheetStore } from "@/stores/sheet_store";
import {
  fetchCv,
  updateCVName,
  updateVisibility,
  handleExportPdf,
} from "@/services/cv_data.service";
import type { CvData } from "@/schemas/cv_data_schema";
import { VisibilityModal } from "./visibility-modal";
import { ShareModal } from "@/components/custom/share-modal";
import { DeleteCvModal } from "@/components/custom/delete-cv-modal";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useCvStore } from "@/stores/cv_store";

type SaveStatus = "Saved" | "Saving..." | "Unsaved Changes" | "Error";
export type Visibility = "Public" | "Private" | "Draft";

type IconType = React.ComponentType<{ size?: number; className?: string }>;

function StatusIcon({ status }: { status: SaveStatus }) {
  const map: Record<SaveStatus, { Icon: IconType; cls: string }> = {
    Saved: { Icon: IconDeviceFloppy, cls: "text-green-600" },
    "Saving...": { Icon: IconLoader2, cls: "text-blue-600 animate-spin" },
    "Unsaved Changes": { Icon: IconClockHour4, cls: "text-amber-600" },
    Error: { Icon: IconAlertTriangle, cls: "text-red-600" },
  };
  const { Icon, cls } = map[status];
  return (
    <span
      className="inline-flex items-center"
      aria-live="polite"
      title={status}
    >
      <Icon size={18} className={cls} />
      <span className="sr-only">{status}</span>
    </span>
  );
}

export function EditorHeaderResponsive({ cvId = "dummy" }: { cvId?: string }) {
  const [currentCv, setCurrentCv] = useState<CvData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditingName, setIsEditingName] = useState(false);
  const [cvName, setCvName] = useState("Resume");
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("Saved");

  //Visibility
  const [isVisibilityModalOpen, setIsVisibilityModalOpen] = useState(false);

  //Share
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [cvToShare, setCvToShare] = useState<CvData | null>(null);
  const [shareUrl, setShareUrl] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);

  //Delete
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const remove = useCvStore((s) => s.deleteOne);

  const saveName = useCvStore((s) => s.saveName);
  const updateVisibility = useCvStore((s) => s.updateVisibility);


  const isTablet = useMediaQuery("(max-width: 1260px)");
  const hideEditor = useSheetStore((s) => s.hideEditor);

  const router = useRouter();
  const { toast } = useToast();

  // Load CV
  React.useEffect(() => {
    let alive = true;
    (async () => {
      if (!cvId || cvId === "dummy") {
        if (!alive) return;
        setCurrentCv(null);
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        const cv = await fetchCv(cvId);
        if (!alive) return;
        setCurrentCv(cv ?? null);
        setCvName((cv?.name ?? "Resume").trim() || "Resume");
      } finally {
        if (alive) setIsLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [cvId]);

  const visibility: Visibility =
    currentCv?.visibility === "public"
      ? "Public"
      : currentCv?.visibility === "private"
        ? "Private"
        : "Draft";

  const getVisibility = (): Visibility => {
    const visibility = currentCv?.visibility

    if (visibility === 'public') return 'Public'
    if (visibility === 'private') return 'Private'
    return 'Draft'
  }

  const handleVisibilityChange = async (
    newVisibility: Visibility,
    newPassword?: string | null
  ) => {
    if (!currentCv) return;
    const v =
      newVisibility === "Public"
        ? "public"
        : newVisibility === "Private"
          ? "private"
          : "draft";
    try {
      setSaveStatus("Saving...");
      await updateVisibility(currentCv, v, newPassword ?? undefined);
      setCurrentCv({
        ...currentCv,
        visibility: v,
        password: v === "private" ? newPassword || "" : undefined,
      });
      setSaveStatus("Saved");
    } catch {
      setSaveStatus("Error");
    }
  };

  const handleNameSave = async () => {
    if (!currentCv?.id) return setIsEditingName(false);
    const next = cvName.trim();
    if (!next || next === currentCv.name) {
      setIsEditingName(false);
      setCvName(currentCv.name || "Resume");
      return;
    }
    const prev = currentCv.name;
    setIsEditingName(false);
    setSaveStatus("Saving...");
    setCurrentCv({ ...currentCv, name: next });
    try {
      await saveName({ ...currentCv, name: next });
      setSaveStatus("Saved");
    } catch {
      setCurrentCv({ ...currentCv, name: prev });
      setCvName(prev || "Resume");
      setSaveStatus("Error");
    }
  };

  const onRemove = useCallback(async () => {
    if (!currentCv?.id) return;
    try {
      setDeleteDialogOpen(false);
      await remove(currentCv.id);
      router.push('/dashboard/');
    } catch {
      toast.error("Failed to delete CV");
    }
  }, [toast]);

  const openShareModal = useCallback((cv: CvData | null) => {
    const url = `${window.location.origin}/view/${cv?.id}`;
    setCvToShare(cv);
    setShareUrl(url);
    setLinkCopied(false);
    setIsShareModalOpen(true);
  }, []);

  const copyShareLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setLinkCopied(true);
      toast.success("Share link copied");
      setTimeout(() => setLinkCopied(false), 3000);
    } catch {
      toast.error("Failed to copy link");
    }
  }, [shareUrl, toast]);

  const shareViaEmail = useCallback(() => {
    const cvName = currentCv?.name?.trim() || "My CV";
    const subject = `Check out my CV: ${cvName}`;
    const body = `Hi,

I wanted to share my CV with you.

CV: ${cvName}
Link: ${shareUrl}

Best regards`;
    window.open(
      `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    );
    toast.success("Email client opened");
  }, [currentCv, shareUrl, toast]);

  return (
    <>
    <header className="flex h-[50px] w-full min-w-0 flex-shrink-0 items-center justify-between bg-white p-3">
      <div className="flex items-center gap-2 mr-2">
        <div className="hidden md:flex">
          <StatusIcon status={isLoading ? "Saving..." : saveStatus} />
        </div>
      </div>

      <div className="flex min-w-0 flex-1 items-center justify-center gap-2 md:justify-start">
        {isEditingName ? (
          <div className="flex min-w-0 items-center gap-2">
            <Input
              value={cvName}
              onChange={(e) => setCvName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") void handleNameSave();
                if (e.key === "Escape") {
                  setCvName(currentCv?.name || "Resume");
                  setIsEditingName(false);
                }
              }}
              autoFocus
              className="h-9 text-md font-semibold"
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handleNameSave}
              aria-label="Save name"
            >
              <IconCircleCheck size={16} className="text-green-600" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setIsEditingName(false)}
              aria-label="Cancel"
            >
              <IconX size={16} />
            </Button>
          </div>
        ) : (
          <div className="flex min-w-0 items-center gap-2">
            <span className="truncate text-md font-semibold">{cvName}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsEditingName(true)}
              aria-label="Edit name"
            >
              <IconPencil size={16} />
            </Button>
          </div>
        )}
      </div>

      <div className="flex items-center">
        <div className="hidden md:flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1.5 text-sm"
            onClick={() => setIsVisibilityModalOpen(true)}
          >
            {visibility === "Public" ? (
              <IconLockOpen size={14} />
            ) : (
              <IconLock size={14} />
            )}
            {visibility}
          </Button>

          <div className="flex items-center gap-1 px-2 border-l">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => openShareModal(currentCv)}
              title="Share CV"
            >
              <IconShare size={16} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleExportPdf(currentCv!)}
              title="Export as PDF"
            >
              <IconFileTypePdf size={16} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              title="Delete CV"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <IconTrash size={16} />
            </Button>
          </div>
        </div>

        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <IconDotsVertical size={18} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={() => setIsVisibilityModalOpen(true)}
              >
                {visibility === "Public" ? (
                  <IconLockOpen size={16} className="mr-2" />
                ) : (
                  <IconLock size={16} className="mr-2" />
                )}
                Visibility: {visibility}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => openShareModal(currentCv)}>
                <IconShare size={16} className="mr-2" /> Share
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>handleExportPdf(currentCv!)}
              >
                <IconFileTypePdf size={16} className="mr-2" /> Export PDF
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600"
               onClick={() => setDeleteDialogOpen(true)}>
                <IconTrash size={16} className="mr-2" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
    {/* The Visibility Modal is rendered here */}
      <VisibilityModal
        isOpen={isVisibilityModalOpen}
        onOpenChange={setIsVisibilityModalOpen}
        visibility={getVisibility()}
        password={currentCv?.password ?? null}
        onVisibilityChange={handleVisibilityChange}
      />

      <ShareModal
        isOpen={isShareModalOpen}
        onOpenChange={setIsShareModalOpen}
        cv={currentCv}
        shareUrl={shareUrl}
        linkCopied={linkCopied}
        onCopyLink={copyShareLink}
        onShareEmail={shareViaEmail}
      />
      <DeleteCvModal
        isOpen={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        cv={currentCv ?? null}
        onDelete={onRemove}
      />
    </>
  );
}
