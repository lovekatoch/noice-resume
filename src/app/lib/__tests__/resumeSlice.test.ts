import resumeReducer, {
  changeProfile,
  changeWorkExperiences,
  changeEducations,
  changeProjects,
  changeSkills,
  changeCustom,
  addSectionInForm,
  moveSectionInForm,
  deleteSectionInFormByIdx,
  setResume,
  initialResumeState,
} from "lib/redux/resumeSlice";

describe("resumeSlice", () => {
  describe("changeProfile", () => {
    it("should update a profile field", () => {
      const state = resumeReducer(
        initialResumeState,
        changeProfile({ field: "name", value: "John Doe" })
      );
      expect(state.profile.name).toBe("John Doe");
    });

    it("should update email field", () => {
      const state = resumeReducer(
        initialResumeState,
        changeProfile({ field: "email", value: "john@example.com" })
      );
      expect(state.profile.email).toBe("john@example.com");
    });

    it("should update summary field", () => {
      const state = resumeReducer(
        initialResumeState,
        changeProfile({ field: "summary", value: "A summary" })
      );
      expect(state.profile.summary).toBe("A summary");
    });
  });

  describe("changeWorkExperiences", () => {
    it("should update a string field at given index", () => {
      const state = resumeReducer(
        initialResumeState,
        changeWorkExperiences({ idx: 0, field: "company", value: "Acme Corp" })
      );
      expect(state.workExperiences[0].company).toBe("Acme Corp");
    });

    it("should update descriptions at given index", () => {
      const state = resumeReducer(
        initialResumeState,
        changeWorkExperiences({
          idx: 0,
          field: "descriptions",
          value: ["Bullet 1", "Bullet 2"],
        })
      );
      expect(state.workExperiences[0].descriptions).toEqual([
        "Bullet 1",
        "Bullet 2",
      ]);
    });
  });

  describe("changeEducations", () => {
    it("should update a string field at given index", () => {
      const state = resumeReducer(
        initialResumeState,
        changeEducations({ idx: 0, field: "school", value: "MIT" })
      );
      expect(state.educations[0].school).toBe("MIT");
    });

    it("should update descriptions at given index", () => {
      const state = resumeReducer(
        initialResumeState,
        changeEducations({
          idx: 0,
          field: "descriptions",
          value: ["Dean's list"],
        })
      );
      expect(state.educations[0].descriptions).toEqual(["Dean's list"]);
    });
  });

  describe("changeProjects", () => {
    it("should update a string field at given index", () => {
      const state = resumeReducer(
        initialResumeState,
        changeProjects({ idx: 0, field: "project", value: "My App" })
      );
      expect(state.projects[0].project).toBe("My App");
    });

    it("should update descriptions at given index", () => {
      const state = resumeReducer(
        initialResumeState,
        changeProjects({
          idx: 0,
          field: "descriptions",
          value: ["Feature 1"],
        })
      );
      expect(state.projects[0].descriptions).toEqual(["Feature 1"]);
    });
  });

  describe("changeSkills", () => {
    it("should update descriptions", () => {
      const state = resumeReducer(
        initialResumeState,
        changeSkills({
          field: "descriptions",
          value: ["Skill A", "Skill B"],
        })
      );
      expect(state.skills.descriptions).toEqual(["Skill A", "Skill B"]);
    });

    it("should update featured skills at an index", () => {
      const state = resumeReducer(
        initialResumeState,
        changeSkills({
          field: "featuredSkills",
          idx: 0,
          skill: "TypeScript",
          rating: 5,
        })
      );
      expect(state.skills.featuredSkills[0].skill).toBe("TypeScript");
      expect(state.skills.featuredSkills[0].rating).toBe(5);
    });
  });

  describe("changeCustom", () => {
    it("should update custom descriptions", () => {
      const state = resumeReducer(
        initialResumeState,
        changeCustom({ field: "descriptions", value: ["Custom item"] })
      );
      expect(state.custom.descriptions).toEqual(["Custom item"]);
    });
  });

  describe("addSectionInForm", () => {
    it("should add a work experience entry", () => {
      const state = resumeReducer(
        initialResumeState,
        addSectionInForm({ form: "workExperiences" })
      );
      expect(state.workExperiences).toHaveLength(2);
    });

    it("should add an education entry", () => {
      const state = resumeReducer(
        initialResumeState,
        addSectionInForm({ form: "educations" })
      );
      expect(state.educations).toHaveLength(2);
    });

    it("should add a project entry", () => {
      const state = resumeReducer(
        initialResumeState,
        addSectionInForm({ form: "projects" })
      );
      expect(state.projects).toHaveLength(2);
    });
  });

  describe("moveSectionInForm", () => {
    it("should move an item up", () => {
      const stateWithTwo = resumeReducer(
        resumeReducer(initialResumeState, addSectionInForm({ form: "workExperiences" })),
        changeWorkExperiences({ idx: 1, field: "company", value: "Second" })
      );

      const state = resumeReducer(
        stateWithTwo,
        moveSectionInForm({ form: "workExperiences", idx: 1, direction: "up" })
      );
      expect(state.workExperiences[0].company).toBe("Second");
    });

    it("should move an item down", () => {
      const stateWithTwo = resumeReducer(
        resumeReducer(initialResumeState, addSectionInForm({ form: "workExperiences" })),
        changeWorkExperiences({ idx: 0, field: "company", value: "First" })
      );

      const state = resumeReducer(
        stateWithTwo,
        moveSectionInForm({ form: "workExperiences", idx: 0, direction: "down" })
      );
      expect(state.workExperiences[1].company).toBe("First");
    });

    it("should not move first item up", () => {
      const state = resumeReducer(
        initialResumeState,
        moveSectionInForm({ form: "workExperiences", idx: 0, direction: "up" })
      );
      expect(state.workExperiences).toHaveLength(1);
    });
  });

  describe("deleteSectionInFormByIdx", () => {
    it("should delete an item at index", () => {
      const stateWithAdd = resumeReducer(
        initialResumeState,
        addSectionInForm({ form: "workExperiences" })
      );

      const state = resumeReducer(
        stateWithAdd,
        deleteSectionInFormByIdx({ form: "workExperiences", idx: 0 })
      );
      expect(state.workExperiences).toHaveLength(1);
    });
  });

  describe("setResume", () => {
    it("should replace the entire resume state", () => {
      const newResume = {
        ...initialResumeState,
        profile: { ...initialResumeState.profile, name: "Jane" },
      };
      const state = resumeReducer(
        initialResumeState,
        setResume(newResume)
      );
      expect(state.profile.name).toBe("Jane");
    });
  });
});

// Type-level validation: action creators accept payloads without `as any`
type _acceptsDescriptionsPayload =
  Parameters<typeof changeWorkExperiences>[0] extends
  { idx: number; field: "descriptions"; value: string[] } ? true : false;
type _acceptsStringFieldPayload =
  Parameters<typeof changeWorkExperiences>[0] extends
  { idx: number; field: "company"; value: string } ? true : false;
type _check = _acceptsDescriptionsPayload extends true ?
  _acceptsStringFieldPayload extends true ? true : never : never;
