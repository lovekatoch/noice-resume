import { Form } from "components/ResumeForm/Form";
import { BulletListTextarea } from "components/ResumeForm/Form/InputGroup";
import { PlusSmallIcon } from "@heroicons/react/24/outline";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import { changeCustom, selectCustom } from "lib/redux/resumeSlice";
import { changeShowForm } from "lib/redux/settingsSlice";

export const CustomForm = () => {
  const custom = useAppSelector(selectCustom);
  const dispatch = useAppDispatch();
  const { descriptions } = custom;

  const handleCustomChange = (field: "descriptions", value: string[]) => {
    dispatch(changeCustom({ field, value }));
  };

  const handleAddSection = () => {
    dispatch(changeShowForm({ field: "custom", value: true }));
  };

  if (descriptions.length === 0) {
    return (
      <div className="flex justify-center py-2">
        <button
          type="button"
          onClick={handleAddSection}
          className="inline-flex items-center gap-1 rounded-md border border-dashed border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-medium text-[var(--muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] hover:bg-[var(--accent-light)]"
        >
          <PlusSmallIcon className="h-3.5 w-3.5" aria-hidden="true" />
          Add Section
        </button>
      </div>
    );
  }

  return (
    <Form form="custom">
      <div className="col-span-full grid grid-cols-6 gap-3">
        <div className="relative col-span-full">
          <BulletListTextarea
            label="Custom Textbox"
            labelClassName="col-span-full"
            name="descriptions"
            placeholder="Bullet points"
            value={descriptions}
            onChange={handleCustomChange}
          />
        </div>
      </div>
    </Form>
  );
};
