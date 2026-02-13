const UserCard = ({ user, showActions = false, onIgnore, onInterested }) => {
  if (!user) return null;

  const { firstName, lastName, age, gender, photoURL, about, skills } = user;

  const toProperCase = (word) =>
    word?.toLowerCase().replace(/\b\w/g, (w) => w.toUpperCase());

  return (
    <div className="card bg-base-200 w-full max-w-sm shadow-md">
      <figure>
        <img src={photoURL} alt="User" className="h-64 w-full object-cover" />
      </figure>

      <div className="card-body">
        <h2 className="card-title">
          {firstName} {lastName}
          {gender && age && (
            <>
              <div className="badge badge-secondary text-xs">
                {toProperCase(gender)} • {age}
              </div>
            </>
          )}
        </h2>

        <p className="text-sm text-base-content/80">{about}</p>

        <p className="text-sm">
          <span className="font-semibold">Skills:</span>{" "}
          {Array.isArray(skills) && skills.length > 0
            ? skills.join(", ")
            : "No skills added"}
        </p>

        {showActions && (
          <div className="card-actions justify-between mt-4">
            <button
              className="btn btn-sm btn-outline btn-error"
              onClick={onIgnore}
            >
              Ignore
            </button>

            <button className="btn btn-sm btn-success" onClick={onInterested}>
              Interested
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCard;
