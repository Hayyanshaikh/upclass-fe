import { useEffect, useRef } from "react";
import type { FormInstance } from "antd";
import { isAxiosError } from "axios";

import {
  useSchoolsControllerFindOne,
  useSchoolsControllerUpdate,
} from "@/app/api/endpoints";
import type { UpdateSchoolDto } from "@/app/api/schemas";
import type { RegisterSettingsTab } from "@/types/settings";
import { handleImageUpload } from "@/utils/handle-image-upload";

type UseSchoolProfileSettingsParams = {
  form: FormInstance;
  registerTab: RegisterSettingsTab;
  schoolId: string;
};

export function useSchoolProfileSettings({
  form,
  registerTab,
  schoolId,
}: UseSchoolProfileSettingsParams) {
  const { data: schoolProfile, isFetching } = useSchoolsControllerFindOne(
    schoolId,
    {
      query: {
        enabled: !!schoolId,
      },
    },
  );
  const { mutateAsync: updateSchoolProfile, isPending: isUpdating } =
    useSchoolsControllerUpdate();

  const school = schoolProfile?.data;

  function populate(schoolData: typeof school) {
    if (!schoolData) return;

    form.setFieldsValue({
      logo: schoolData.logo ?? undefined,
      schoolName: schoolData.name ?? "",
      shortCode: schoolData.shortCode ?? "",
      schoolType: schoolData.schoolType ?? undefined,
      educationSystem: schoolData.educationSystem ?? undefined,
      establishedYear: schoolData.establishedYear ?? undefined,
      description: schoolData.description ?? "",

      phone: schoolData.phone ?? "",
      email: schoolData.email ?? "",
      address: schoolData.address ?? "",

      principalName: schoolData.principalName ?? "",
      vicePrincipalName: schoolData.vicePrincipalName ?? "",
      adminContact: schoolData.adminContact ?? "",
      ownerName: schoolData.ownerName ?? "",

      dateFormat: schoolData.dateFormat ?? undefined,
      feeDueDate: schoolData.feeDueDate ?? undefined,
      workingDays: schoolData.workingDays ?? [],
      openingTime: schoolData.openingTime ?? "",
      closingTime: schoolData.closingTime ?? "",
    });
  }

  useEffect(() => {
    populate(schoolProfile?.data);
    // populate is derived from the current school profile and form instance.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schoolProfile, form]);

  const schoolRef = useRef(school);
  schoolRef.current = school;

  async function validate() {
    await form.validateFields();
  }

  async function save() {
    try {
      const values = form.getFieldsValue(true);
      const logo = await handleImageUpload(values.logo);

      const payload: UpdateSchoolDto = {
        name: values.schoolName,
        logo: logo.url ?? "",
        shortCode: values.shortCode,
        schoolType: values.schoolType,
        educationSystem: values.educationSystem,
        establishedYear: values.establishedYear
          ? Number(values.establishedYear)
          : undefined,
        description: values.description,
        phone: values.phone,
        email: values.email,
        address: values.address,
        principalName: values.principalName,
        vicePrincipalName: values.vicePrincipalName,
        adminContact: values.adminContact,
        ownerName: values.ownerName,
        dateFormat: values.dateFormat,
        feeDueDate: values.feeDueDate ? Number(values.feeDueDate) : undefined,
        workingDays: values.workingDays,
        openingTime: values.openingTime,
        closingTime: values.closingTime,
      };

      await updateSchoolProfile({
        id: schoolId,
        data: payload,
      });
    } catch (error: any) {
      const body = isAxiosError(error)
        ? (error.response?.data as
            | { message?: string; data?: { errors?: string[] } }
            | undefined)
        : undefined;

      const errorMessage =
        body?.data?.errors?.[0] ??
        body?.message ??
        (error instanceof Error ? error.message : undefined);

      throw new Error(errorMessage ?? "Unable to update school settings.");
    }
  }

  function reset() {
    form.resetFields();
    populate(schoolRef.current);
  }

  const actionsRef = useRef({ validate, save, reset });
  actionsRef.current = { validate, save, reset };

  useEffect(
    () =>
      registerTab("profile", {
        validate: () => actionsRef.current.validate(),
        save: () => actionsRef.current.save(),
        reset: () => actionsRef.current.reset(),
      }),
    [registerTab],
  );

  return {
    data: school,
    isLoading: isFetching && !school,
    isFetching,
    isUpdating,
  };
}
