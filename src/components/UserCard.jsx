const UserCard = ({ user }) => {
  const { firstName, lastName, age, gender, photoURL, about, skills } = user;
  const toProperCase = (word) => {
    return word.toLowerCase().replace(/\b\w/g, (w) => w.toUpperCase());
  };
  return (
    <div className="card bg-base-200 w-86 shadow-sm">
      <figure>
        <img src={photoURL} alt="User" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">
          {firstName + " " + lastName}
          <div className="badge badge-secondary">
            {toProperCase(gender) + " " + age}
          </div>
        </h2>
        <p>{about}</p>
        <p><span className="font-bold">Skills:</span> {skills?.length ? skills.join(", ") : "No skills added"}</p>
        <div className="card-actions justify-end">
          <div className="badge badge-outline bg-red-200">Ignore</div>
          <div className="badge badge-outline bg-green-200">Interested</div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
