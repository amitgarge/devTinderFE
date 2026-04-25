import { useState } from "react";
import UserCard from "./UserCard";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/slices/userSlice";
import axiosInstance from "../services/axiosInstance";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ProfileEdit = ({ user }) => {
  const [firstName, setFirstName] = useState(user.firstName || "");
  const [lastName, setLastName] = useState(user.lastName || "");
  const [about, setAbout] = useState(user.about || "");
  const [age, setAge] = useState(user.age || "");
  const [gender, setGender] = useState(user.gender || "");
  const [skills, setSkills] = useState(user.skills || []);
  const [skillInput, setSkillInput] = useState("");
  const [photoURL, setPhotoURL] = useState(user.photoURL || "");
  const [saving, setSaving] = useState(false);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const edit = async () => {
    try {
      setSaving(true);

      const promise = axiosInstance.patch("/profile/edit", {
        firstName,
        lastName,
        about,
        age,
        gender,
        skills,
        photoURL,
      });

      const res = await toast.promise(promise, {
        loading: "Updating profile...",
        success: "Profile updated successfully 🎉",
        error: "Failed to update profile",
      });

      dispatch(addUser(res.data.data));
      navigate("/");
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault();
      const newSkill = skillInput.trim();

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
    <div className="min-h-screen bg-linear-to-br from-base-100 to-base-200 py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* ================= FORM ================= */}
          <div className="lg:col-span-7">
            <div className="card bg-base-100 shadow-xl rounded-2xl p-8 max-w-2xl">
              <h2 className="text-2xl font-bold mb-8">Edit Profile</h2>

              <div className="space-y-6">
                {/* First Name */}
                <div>
                  <label className="label font-medium">First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary/30"
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label className="label font-medium">Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary/30"
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="label font-medium">Gender</label>
                  <div className="flex flex-wrap gap-6">
                    {["male", "female", "others"].map((g) => (
                      <label key={g} className="label cursor-pointer gap-2">
                        <input
                          type="radio"
                          name="gender"
                          value={g}
                          className="radio radio-primary"
                          checked={gender === g}
                          onChange={(e) => setGender(e.target.value)}
                        />
                        <span className="capitalize">{g}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Age */}
                <div>
                  <label className="label font-medium">Age</label>
                  <input
                    type="number"
                    value={age}
                    className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary/30"
                    onChange={(e) => setAge(e.target.value)}
                  />
                </div>

                {/* About */}
                <div>
                  <label className="label font-medium">About</label>
                  <textarea
                    className="textarea textarea-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary/30"
                    rows={4}
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                  ></textarea>
                </div>

                {/* Skills */}
                <div>
                  <label className="label font-medium">Skills</label>

                  <div className="border border-base-300 rounded-xl p-4 bg-base-200">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {skills.map((skill, index) => (
                        <div
                          key={index}
                          className="badge badge-primary gap-2 px-3 py-3"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeSkill(index)}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>

                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={handleSkillKeyDown}
                      placeholder="Type skill and press Enter"
                      className="input input-bordered input-sm w-full"
                    />
                  </div>
                </div>

                {/* Photo URL */}
                <div>
                  <label className="label font-medium">Photo URL</label>
                  <input
                    type="text"
                    value={photoURL}
                    className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary/30"
                    onChange={(e) => setPhotoURL(e.target.value)}
                  />
                </div>

                {/* Save Button */}
                <button
                  className="btn btn-primary w-full mt-4 shadow-md hover:shadow-lg"
                  onClick={edit}
                  disabled={saving}
                >
                  {saving ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* ================= PREVIEW ================= */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="w-full max-w-md sticky top-24">
              <UserCard
                user={{
                  firstName,
                  lastName,
                  age,
                  gender,
                  photoURL,
                  about,
                  skills,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;
