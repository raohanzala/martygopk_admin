import { useEffect } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAddSubject } from "../hooks/useAddSubject";
import { useUpdateSubject } from "../hooks/useUpdateSubject";
import {
  addSubjectSchema,
  SubjectFormValues,
} from "../validation/subject.validation";
import { CreateSubjectFormProps } from "../types/subject-components.types";
import Form from "@/components/form/Form";
import FormRowVertical from "@/components/form/FormRowVertical";
import Input from "@/components/form/Input";
import Button from "@/components/common/Button";
import EntitySelectField from "@/components/form/EntitySelectField";

const CreateSubjectForm = ({
  subjectToEdit,
  onManageSubjectModalClose,
}: CreateSubjectFormProps) => {
  const { addSubjectMutation, isAddingSubject } = useAddSubject();
  const { updateSubjectMutation, isUpdatingSubject } = useUpdateSubject();

  const isLoadingSubject = isAddingSubject || isUpdatingSubject;
  const isEditMode = !!subjectToEdit;

  const methods = useForm<SubjectFormValues>({
    resolver: zodResolver(addSubjectSchema) as Resolver<SubjectFormValues>,
    defaultValues: {
      classId: "",
      teacherId: "",
      name: "",
      examMarks: 0,
    },
  });

  const { watch, reset } = methods;

  useEffect(() => {
    if (subjectToEdit) {
      reset({
        classId: subjectToEdit.class?._id ?? "",
        teacherId: subjectToEdit.teacher?._id ?? "",
        name: subjectToEdit.name ?? "",
        examMarks: subjectToEdit.examMarks ?? 0,
      });
    } else {
      reset({
        classId: "",
        teacherId: "",
        name: "",
        examMarks: 0,
      });
    }
  }, [subjectToEdit, reset]);

  const onSubmit = (formValues: SubjectFormValues) => {
    const payload = {
      name: formValues.name,
      classId: formValues.classId,
      teacherId: formValues.teacherId,
      examMarks: Number(formValues.examMarks),
    };

    if (!isEditMode) {
      addSubjectMutation(payload, {
        onSuccess: onManageSubjectModalClose,
      });
    } else if (subjectToEdit?._id) {
      updateSubjectMutation(
        {
          subjectId: subjectToEdit._id,
          updateSubjectInput: payload,
        },
        {
          onSuccess: onManageSubjectModalClose,
        }
      );
    }
  };

  return (
    <Form
      methods={methods}
      onSubmit={onSubmit}
      disabled={isLoadingSubject}
    >
      <div className="space-y-4">
        <FormRowVertical label="Class" name="classId" required>
          <EntitySelectField
            name="classId"
            entity="class"
            isDisabled={isLoadingSubject}
          />
        </FormRowVertical>

        <FormRowVertical label="Subject Teacher" name="teacherId" required>
          <EntitySelectField
            name="teacherId"
            entity="teacher"
            isDisabled={isLoadingSubject}
          />
        </FormRowVertical>

        <FormRowVertical label="Subject Name" name="name" required>
          <Input name="name" placeholder="Enter Subject Name" />
        </FormRowVertical>

        <FormRowVertical label="Exam Marks" name="examMarks" required>
          <Input name="examMarks" type="number" placeholder="Enter Exam Marks" />
        </FormRowVertical>
      </div>

      <div className="mt-6">
        <Button
          fullWidth
          type="submit"
          size="lg"
          disabled={isLoadingSubject}
          loading={isLoadingSubject}
        >
          {isEditMode ? "Update Subject" : "Create Subject"}
        </Button>
      </div>
    </Form>
  );
};

export default CreateSubjectForm;