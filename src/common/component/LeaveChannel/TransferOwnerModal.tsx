import { useEffect, useState, FC } from "react";
import toast from "react-hot-toast";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Modal from "../Modal";
import useLeaveChannel from "../../hook/useLeaveChannel";
import StyledModal from "../styled/Modal";
import Button from "../styled/Button";
import User from "../User";
import { useTranslation } from "react-i18next";

const UserList = styled.ul`
  display: flex;
  flex-direction: column;
  max-height: 260px;
  padding: 16px 0;
  overflow-y: scroll;
  .user {
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 0 8px;
    width: -webkit-fill-available;
    &:hover,
    &.selected {
      background: rgba(116, 127, 141, 0.1);
    }
    > a {
      width: 100%;
    }
  }
`;

interface Props {
  id: number;
  closeModal: () => void;
  withLeave?: boolean;
}

const TransferOwnerModal: FC<Props> = ({ id, closeModal, withLeave = true }) => {
  const { t } = useTranslation();
  const {
    transferOwner,
    otherMembers,
    leaving,
    leaveChannel,
    leaveSuccess,
    transferSuccess,
    transferring
  } = useLeaveChannel(id);

  const [uid, setUid] = useState<number | null>(null);
  const navigateTo = useNavigate();

  const handleSelectUser = (uid: number) => {
    setUid(uid);
  };
  const handleTransferAndLeave = async () => {
    if (!uid) return;
    await transferOwner(uid);
    if (withLeave) {
      await leaveChannel();
    }
  };

  useEffect(() => {
    if (transferSuccess && leaveSuccess) {
      toast.success("Leave channel successfully!");
      closeModal();
      navigateTo("/chat");
    }
  }, [leaveSuccess, transferSuccess, withLeave]);

  if (!id) return null;
  const operating = leaving || transferring;
  return (
    <Modal id="modal-modal">
      <StyledModal
        className="compact"
        title="Transfer Ownership"
        description={"This cannot be undone."}
        buttons={
          <>
            <Button onClick={closeModal.bind(null, undefined)} className="cancel">
              {t("action.cancel")}
            </Button>
            <Button disabled={!uid} onClick={handleTransferAndLeave} className="danger">
              {operating ? "Assigning" : `Assign and Leave`}
            </Button>
          </>
        }
      >
        <UserList>
          {otherMembers.map((id) => {
            return (
              <li
                key={id}
                className={`user ${uid == id ? "selected" : ""}`}
                onClick={handleSelectUser.bind(null, id)}
              >
                <User uid={id} interactive={false} />
              </li>
            );
          })}
        </UserList>
      </StyledModal>
    </Modal>
  );
};

export default TransferOwnerModal;
