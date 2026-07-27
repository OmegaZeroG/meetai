"use client";

import { useState } from "react";

import { ResponsiveDialog } from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";

/**
 * Renders a confirmation dialog on demand. Call the returned `confirm()`
 * function anywhere (e.g. a delete handler) and `await` it — it resolves
 * to `true`/`false` depending on what the user clicked. Render the
 * returned component once, anywhere in the tree, to actually show it.
 */
export const useConfirm = (
  title: string,
  description: string,
): [() => React.ReactElement, () => Promise<boolean>] => {
  const [promise, setPromise] = useState<{
    resolve: (value: boolean) => void;
  } | null>(null);

  const confirm = () => {
    return new Promise<boolean>((resolve) => {
      setPromise({ resolve });
    });
  };

  const handleClose = () => {
    setPromise(null);
  };

  const handleConfirm = () => {
    promise?.resolve(true);
    handleClose();
  };

  const handleCancel = () => {
    promise?.resolve(false);
    handleClose();
  };

  const ConfirmationDialog = () => (
    <ResponsiveDialog
      open={promise !== null}
      onOpenChange={handleClose}
      title={title}
      description={description}
    >
      <div className="flex flex-col-reverse lg:flex-row gap-2 items-center justify-end w-full pt-4">
        <Button
          onClick={handleCancel}
          variant="outline"
          className="w-full lg:w-auto"
        >
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          variant="destructive"
          className="w-full lg:w-auto"
        >
          Confirm
        </Button>
      </div>
    </ResponsiveDialog>
  );

  return [ConfirmationDialog, confirm];
};
