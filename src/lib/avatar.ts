import { createAvatar } from "@dicebear/core";
import { botttsNeutral, initials } from "@dicebear/collection";

interface Props {
  seed: string;
  variant: "botttsNeutral" | "initials";
}

/**
 * Server-safe avatar generator (no JSX) so both React components and
 * server-side code (e.g. upserting a Stream user) can produce the same
 * deterministic avatar for a given name.
 */
export const generateAvatarUri = ({ seed, variant }: Props) => {
  let avatar;

  if (variant === "botttsNeutral") {
    avatar = createAvatar(botttsNeutral, { seed });
  } else {
    avatar = createAvatar(initials, { seed, fontWeight: 500, fontSize: 42 });
  }

  return avatar.toDataUri();
};
