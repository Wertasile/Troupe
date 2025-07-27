const UserListItem = ({ user, handleFunction }) => {
  
  return (
    
  <div className='user-search-result-item' onClick={handleFunction}>
    <div>{user.name}</div>
    <div style={{color:'gray'}}><i>{user.email}</i></div>
  </div>
  );
};

export default UserListItem;