import { useAppSelector } from "@/utils/hooks";
import ProfileEdit from "./ProfileEdit";

const Profile = () => {
  const user = useAppSelector((state) => state.user);
  return user && <ProfileEdit user={user} />;
};
export default Profile;
