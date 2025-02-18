import { ChangeEvent, useEffect, useState, FC } from "react";
import styled from "styled-components";
import toast from "react-hot-toast";
import Input from "../../common/component/styled/Input";
import { useUpdatePasswordMutation, useGetCredentialsQuery } from "../../app/services/auth";
import StyledModal from "../../common/component/styled/Modal";
import Button from "../../common/component/styled/Button";
import Modal from "../../common/component/Modal";
import { useTranslation } from "react-i18next";

const StyledEdit = styled(StyledModal)`
  .input {
    margin: 16px 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;
    label {
      font-weight: 600;
      font-size: 14px;
      line-height: 20px;
      color: #6b7280;
    }
  }
`;

interface Props {
  closeModal: () => void;
}

interface BaseForm {
  current: string;
  newPassword: string;
  confirmPassword: string;
}

const ProfileBasicEditModal: FC<Props> = ({ closeModal }) => {
  const { t } = useTranslation("member");
  const { data } = useGetCredentialsQuery();
  const [input, setInput] = useState<BaseForm>({
    current: "",
    newPassword: "",
    confirmPassword: ""
  });
  // const dispatch = useDispatch();
  const [updatePassword, { isLoading, isSuccess }] = useUpdatePasswordMutation();
  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { type } = evt.target.dataset as { type: keyof BaseForm };
    setInput((prev) => {
      return { ...prev, [type]: evt.target.value };
    });
  };
  const handleUpdate = () => {
    const { current, newPassword } = input;
    updatePassword({ old_password: current, new_password: newPassword });
  };
  const handleCompare = () => {
    const { newPassword, confirmPassword } = input;
    if (newPassword !== confirmPassword) {
      toast.error("Not same with new password");
    }
  };
  useEffect(() => {
    if (isSuccess) {
      // todo
      toast.success("update password successfully");
      closeModal();
    }
  }, [isSuccess]);
  const { current, newPassword, confirmPassword } = input;
  const disableBtn =
    (data?.password && !current) ||
    !newPassword ||
    !confirmPassword ||
    newPassword !== confirmPassword ||
    isLoading;
  return (
    <Modal id="modal-modal">
      <StyledEdit
        title={t("change_pwd")}
        description={t("change_pwd_desc")}
        buttons={
          <>
            <Button className="cancel" onClick={closeModal}>
              {t("action.cancel", { ns: "common" })}
            </Button>
            <Button disabled={disableBtn} onClick={handleUpdate}>
              {isLoading ? "Updating" : t("action.update", { ns: "common" })}
            </Button>
          </>
        }
      >
        {data?.password && (
          <div className="input">
            <label htmlFor={"current"}>{t("current_pwd")}</label>
            <Input
              type="password"
              id="current"
              name="current"
              value={current}
              data-type="current"
              onChange={handleChange}
            ></Input>
          </div>
        )}
        <div className="input">
          <label htmlFor={"newPassword"}>{t("new_pwd")}</label>
          <Input
            type="password"
            name={"newPassword"}
            value={newPassword}
            data-type="newPassword"
            onChange={handleChange}
          ></Input>
        </div>
        <div className="input">
          <label htmlFor={"confirmPassword"}>{t("confirm_new_pwd")}</label>
          <Input
            onBlur={handleCompare}
            type="password"
            name={"confirmPassword"}
            value={confirmPassword}
            data-type="confirmPassword"
            onChange={handleChange}
          ></Input>
        </div>
      </StyledEdit>
    </Modal>
  );
};

export default ProfileBasicEditModal;
