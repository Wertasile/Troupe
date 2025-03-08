const ProfileModal = ({ user, children }) => {

  return (
    <>
      <div className="gc-modal-content">
        <div>{user.name}</div>
        <div><img src={user.pic}/></div>
        <div>{user.email}</div>
      </div>
    </>
  );
};

export default ProfileModal;