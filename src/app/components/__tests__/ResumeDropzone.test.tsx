jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

import { render, act, fireEvent } from "@testing-library/react";
import { ResumeDropzone } from "components/ResumeDropzone";

const revokeSpy = jest.fn();
URL.revokeObjectURL = revokeSpy;
URL.createObjectURL = jest.fn(() => "blob:mock-url");

beforeEach(() => {
  revokeSpy.mockClear();
});

test("revokeObjectURL is called on unmount when file was set", () => {
  const { unmount, container } = render(
    <ResumeDropzone onFileUrlChange={jest.fn()} />
  );

  const file = new File(["dummy"], "test.pdf", { type: "application/pdf" });
  const input = container.querySelector('input[type="file"]')!;

  act(() => {
    fireEvent.change(input, { target: { files: [file] } });
  });

  unmount();

  expect(revokeSpy).toHaveBeenCalledWith("blob:mock-url");
});

test("revokeObjectURL is NOT called on unmount when no file was set", () => {
  const { unmount } = render(
    <ResumeDropzone onFileUrlChange={jest.fn()} />
  );

  unmount();

  expect(revokeSpy).not.toHaveBeenCalled();
});
