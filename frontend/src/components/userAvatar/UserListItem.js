import { Avatar, AvatarBadge, AvatarGroup } from '@chakra-ui/react'
import { Box, Text } from "@chakra-ui/react";

const UserListItem = ({ user, handleFunction }) => {
  
  return (
    
  <div className='user-search-result-item' onClick={handleFunction}>
    <div>{user.name}</div>
    <div>{user.email}</div>
  </div>
  );
};

export default UserListItem;