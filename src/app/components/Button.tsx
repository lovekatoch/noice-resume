import { cx } from "lib/cx";
import { Tooltip } from "components/Tooltip";

type ReactButtonProps = React.ComponentProps<"button">;
type ReactAnchorProps = React.ComponentProps<"a">;
type ButtonProps = ReactButtonProps | ReactAnchorProps;

const isAnchor = (props: ButtonProps): props is ReactAnchorProps => {
  return "href" in props;
};

export const Button = (props: ButtonProps) => {
  if (isAnchor(props)) {
    return <a {...props} />;
  } else {
    return <button type="button" {...props} />;
  }
};

export const PrimaryButton = ({ className, ...props }: ButtonProps) => (
  <Button className={cx("btn-primary", className)} {...props} />
);

type IconButtonProps = ButtonProps & {
  size?: "small" | "medium";
  tooltipText?: string;
};

export const IconButton = ({
  className,
  size = "medium",
  tooltipText,
  ...props
}: IconButtonProps) => {
  const button = (
    <Button
      type="button"
      className={cx(
        "outline-none hover:bg-gray-100 focus-visible:bg-gray-100 flex items-center justify-center",
        size === "medium"
          ? "min-w-[44px] min-h-[44px] p-1.5 rounded-full"
          : "min-w-[26px] min-h-[26px] p-0.5 rounded-md",
        className
      )}
      {...props}
    />
  );

  if (tooltipText) {
    return <Tooltip text={tooltipText}>{button}</Tooltip>;
  }

  return button;
};
