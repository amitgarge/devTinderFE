import { useState } from "react";
import UserCard from "./UserCard";
import axios from "axios";
import { BASE_API_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/slices/userSlice";

const ProfileEdit = ({ user }) => {
  const [firstName, setFirstName] = useState(user.firstName || "");
  const [lastName, setLastName] = useState(user.lastName || "");
  const [about, setAbout] = useState(user.about || "");
  const [age, setAge] = useState(user.age || "");
  const [gender, setGender] = useState(user.gender || "");
  const [skills, setSkills] = useState(user.skills || []);
  const [skillInput, setSkillInput] = useState("");
  const [photoURL, setPhotoURL] = useState(user.photoURL || "");
  const dispatch = useDispatch();

  const edit = async () => {
    try {
      const res = await axios.patch(
        BASE_API_URL + "profile/edit",
        {
          firstName,
          lastName,
          about,
          age,
          gender,
          skills,
          photoURL,
        },
        { withCredentials: true },
      );
      dispatch(addUser(res.data.data));
    } catch (error) {
      console.error(error);
    }
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault();

      const newSkill = skillInput.trim();

      // prevent duplicates (case insensitive)
      const exists = skills.some(
        (skill) => skill.toLowerCase() === newSkill.toLowerCase(),
      );

      if (!exists) {
        setSkills([...skills, newSkill]);
      }

      setSkillInput("");
    }
  };

  const removeSkill = (indexToRemove) => {
    setSkills(skills.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex items-center justify-center w-86 h-screen mx-5">
        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
          <legend className="fieldset-legend text-xl">Profile Edit</legend>

          <label className="label">First Name</label>
          <input
            type="text"
            value={firstName}
            className="input"
            placeholder="First Name"
            onChange={(e) => setFirstName(e.target.value)}
          />

          <label className="label">Last Name</label>
          <input
            type="text"
            value={lastName}
            className="input"
            placeholder="Last Name"
            onChange={(e) => setLastName(e.target.value)}
          />

          <label className="label">Gender</label>
          <div className="flex gap-6">
            <label className="label cursor-pointer gap-2">
              <input
                type="radio"
                name="gender"
                value="male"
                className="radio radio-primary"
                checked={gender === "male"}
                onChange={(e) => setGender(e.target.value)}
              />
              <span>Male</span>
            </label>

            <label className="label cursor-pointer gap-2">
              <input
                type="radio"
                name="gender"
                value="female"
                className="radio radio-primary"
                checked={gender === "female"}
                onChange={(e) => setGender(e.target.value)}
              />
              <span>Female</span>
            </label>

            <label className="label cursor-pointer gap-2">
              <input
                type="radio"
                name="gender"
                value="others"
                className="radio radio-primary"
                checked={gender === "others"}
                onChange={(e) => setGender(e.target.value)}
              />
              <span>Others</span>
            </label>
          </div>

          <label className="label">Age</label>
          <input
            type="text"
            value={age}
            className="input"
            placeholder="Age"
            onChange={(e) => setAge(e.target.value)}
          />

          <label className="label">About</label>
          <textarea
            className="textarea"
            placeholder="Bio"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
          ></textarea>

          <label className="label">Skills</label>

          <div className="border rounded-lg p-3 bg-base-100">
            {/* Skill Tags */}
            <div className="flex flex-wrap gap-2 mb-2">
              {skills.map((skill, index) => (
                <div
                  key={index}
                  className="badge badge-primary gap-2 px-3 py-3"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(index)}
                    className="text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* Input */}
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleSkillKeyDown}
              placeholder="Type skill and press Enter"
              className="input input-sm w-full"
            />
          </div>
          <label className="label">Photo URL</label>
          <input
            type="text"
            value={photoURL}
            className="input"
            placeholder="PhotoURL"
            onChange={(e) => setPhotoURL(e.target.value)}
          />

          <button className="btn btn-neutral mt-4" onClick={edit}>
            Edit Profile
          </button>
        </fieldset>
      </div>
      <UserCard
        user={{ firstName, lastName, age, gender, photoURL, about, skills }}
      />
    </div>
  );
};
export default ProfileEdit;
