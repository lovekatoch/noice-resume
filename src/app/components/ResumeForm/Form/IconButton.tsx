import { IconButton } from "components/Button";
import {
  ArrowSmallUpIcon,
  ArrowSmallDownIcon,
  TrashIcon,
  ListBulletIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

export const CollapseIconButton = ({
  expanded,
  setExpanded,
}: {
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
}) => {
  const tooltipText = expanded ? "Collapse section" : "Expand section";

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };

  return (
    <IconButton
      onClick={handleClick}
      tooltipText={tooltipText}
      size="small"
      className="transition-transform duration-300"
    >
      <ChevronDownIcon
        className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${
          expanded ? "rotate-0" : "-rotate-90"
        }`}
        aria-hidden="true"
      />
      <span className="sr-only">{tooltipText}</span>
    </IconButton>
  );
};

type MoveIconButtonType = "up" | "down";
export const MoveIconButton = ({
  type,
  size = "medium",
  onClick,
}: {
  type: MoveIconButtonType;
  size?: "small" | "medium";
  onClick: (type: MoveIconButtonType) => void;
}) => {
  const tooltipText = type === "up" ? "Move up" : "Move down";
  const sizeClassName = size === "medium" ? "h-6 w-6" : "h-4 w-4";
  const Icon = type === "up" ? ArrowSmallUpIcon : ArrowSmallDownIcon;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick(type);
  };

  return (
    <IconButton
      onClick={handleClick}
      tooltipText={tooltipText}
      size={size}
    >
      <Icon className={`${sizeClassName} text-gray-400`} aria-hidden="true" />
      <span className="sr-only">{tooltipText}</span>
    </IconButton>
  );
};

export const DeleteIconButton = ({
  onClick,
  tooltipText,
}: {
  onClick: () => void;
  tooltipText: string;
}) => {
  return (
    <IconButton onClick={onClick} tooltipText={tooltipText} size="small">
      <TrashIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
      <span className="sr-only">{tooltipText}</span>
    </IconButton>
  );
};

export const BulletListIconButton = ({
  onClick,
  showBulletPoints,
}: {
  onClick: (newShowBulletPoints: boolean) => void;
  showBulletPoints: boolean;
}) => {
  const tooltipText = showBulletPoints
    ? "Hide bullet points"
    : "Show bullet points";

  return (
    <IconButton
      onClick={() => onClick(!showBulletPoints)}
      tooltipText={tooltipText}
      size="small"
      className={showBulletPoints ? "!bg-sky-100" : ""}
    >
      <ListBulletIcon
        className={`h-4 w-4 ${
          showBulletPoints ? "text-gray-700" : "text-gray-400"
        }`}
        aria-hidden="true"
      />
      <span className="sr-only">{tooltipText}</span>
    </IconButton>
  );
};
