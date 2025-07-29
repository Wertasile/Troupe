import { Avatar } from "@chakra-ui/react";

const ProfileModal = (props) => {
  console.log("ProfileModal props:", props);
  const { user, setModal } = props;
  console.log(setModal)

  const closeModal = () => {
    setModal(false)
  }

  return (
    <>
      <div className="gc-modal-content">
        <div style={{alignSelf:'end'}} onClick={closeModal}><i style={{fontSize:'24px'}} class="fa-solid fa-circle-xmark"></i></div>
        <div className="my-profile">
          <div className="profile-pic"><Avatar size="2xl" cursor="pointer" name={user.name} src={user.pic} /></div>
          <div>
            <h2>{user.name}</h2>
            <i>{user.email}</i>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileModal;