import { CloseIcon } from "@chakra-ui/icons";
import { Badge } from "@chakra-ui/react"

const UserBadgeItem = ({ user, handleFunction }) => {
  return (

    <div className="search-badge">
      <upper>{user.name}</upper>
    </div>
  );
};

export default UserBadgeItem;