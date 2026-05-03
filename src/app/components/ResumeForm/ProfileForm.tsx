import { BaseForm } from "components/ResumeForm/Form";
import { Input, Textarea } from "components/ResumeForm/Form/InputGroup";
import { SparkleIconButton } from "components/SparkleIconButton";
import { AIPanel } from "components/AIPanel";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import { changeProfile, selectProfile } from "lib/redux/resumeSlice";
import { selectThemeColor } from "lib/redux/settingsSlice";
import { ResumeProfile } from "lib/redux/types";
import { useAIPanel } from "lib/hooks/useAIPanel";

export const ProfileForm = () => {
  const profile = useAppSelector(selectProfile);
  const dispatch = useAppDispatch();
  const { name, email, phone, url, summary, location } = profile;
  const themeColor = useAppSelector(selectThemeColor) || "#5E6AD2";

  const handleProfileChange = (field: keyof ResumeProfile, value: string) => {
    dispatch(changeProfile({ field, value }));
  };

  const {
    aiPanelOpen,
    streamingText,
    isLoading,
    openPanel,
    closePanel,
    handleAccept,
    handleRegenerate,
  } = useAIPanel({
    onAccept: (text) => {
      dispatch(changeProfile({ field: "summary", value: text }));
    },
    generateMock: (isRegenerate) =>
      isRegenerate
        ? "Innovative problem-solver passionate about leveraging technology to create meaningful impact and drive business growth."
        : "Results-driven professional with a proven track record of delivering measurable outcomes in fast-paced environments.",
  });

  return (
    <BaseForm>
      <div className="grid grid-cols-6 gap-3">
        <Input
          label="Name"
          labelClassName="col-span-full"
          name="name"
          placeholder="Sal Khan"
          value={name}
          onChange={handleProfileChange}
        />
        <div className="col-span-full relative">
          <Textarea
            label="Objective"
            labelClassName="col-span-full"
            name="summary"
            placeholder="Entrepreneur and educator obsessed with making education free for anyone"
            value={summary}
            onChange={handleProfileChange}
          />
{summary.length > 0 && (
              <div className="absolute right-2 top-8">
                  <SparkleIconButton onClick={() => openPanel()} color={themeColor} size="small" />
              </div>
            )}
        </div>
        <Input
          label="Email"
          labelClassName="col-span-full"
          name="email"
          placeholder="hello@khanacademy.org"
          value={email}
          onChange={handleProfileChange}
        />
        <Input
          label="Phone"
          labelClassName="col-span-full"
          name="phone"
          placeholder="(123)456-7890"
          value={phone}
          onChange={handleProfileChange}
        />
        <Input
          label="Website"
          labelClassName="col-span-full"
          name="url"
          placeholder="linkedin.com/in/khanacademy"
          value={url}
          onChange={handleProfileChange}
        />
        <Input
          label="Location"
          labelClassName="col-span-full"
          name="location"
          placeholder="NYC, NY"
          value={location}
          onChange={handleProfileChange}
        />
      </div>
      <AIPanel
        isOpen={aiPanelOpen}
        onClose={closePanel}
        onAccept={handleAccept}
        onRegenerate={handleRegenerate}
        streamingText={streamingText}
        isLoading={isLoading}
      />
    </BaseForm>
  );
};
