import { useSelector } from "react-redux";
import ProfileEdit from "./ProfileEdit";

const Profile = () => {
  const userSelector = useSelector((store) => store.user);  
  return userSelector && <ProfileEdit user={userSelector} />;
};
export default Profile;
