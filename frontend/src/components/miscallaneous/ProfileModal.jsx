import { Avatar } from "@chakra-ui/react";

const ProfileModal = ({ user, children }) => {

  return (
    <>
      <div className="gc-modal-content">
        <div>{user.name}</div>
        <div><Avatar size="lg" cursor="pointer" name={user.name} src={user.pic} /></div>
        <div>{user.email}</div>
      </div>
    </>
  );
};

export default ProfileModal;