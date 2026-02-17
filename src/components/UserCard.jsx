const UserCard = ({ user, showActions = false, onIgnore, onInterested }) => {
  if (!user) return null;

  const { firstName, lastName, age, gender, photoURL, about, skills } = user;

  const toProperCase = (word) =>
    word?.toLowerCase().replace(/\b\w/g, (w) => w.toUpperCase());

  return (
    <div className="w-full max-w-md mx-auto px-4">
      <div className="transition-all duration-300 ease-in-out">
        <div className="card bg-base-100 shadow-lg rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
          <figure>
            <img
              src={photoURL}
              alt="User"
              className="h-72 w-full object-contain bg-base-200"
            />
          </figure>

          {/* Body */}
          <div className="card-body p-6">
            {/* Name */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                {firstName} {lastName}
              </h2>

              {gender && age && (
                <span className="badge badge-primary badge-outline">
                  {toProperCase(gender)} • {age}
                </span>
              )}
            </div>

            {/* About */}
            <p className="text-base-content/70 text-sm leading-relaxed">
              {about}
            </p>

            {/* Skills */}
            <div className="mt-3 flex flex-wrap gap-2">
              {Array.isArray(skills) && skills.length > 0 ? (
                skills.map((skill, index) => (
                  <span
                    key={index}
                    className="badge badge-outline badge-primary"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-sm text-base-content/50">
                  No skills added
                </span>
              )}
            </div>

            {/* Actions */}
            {showActions && (
              <div className="card-actions mt-6 gap-3">
                <button
                  className="btn btn-outline btn-error flex-1"
                  onClick={onIgnore}
                >
                  Ignore
                </button>

                <button
                  className="btn btn-primary flex-1"
                  onClick={onInterested}
                >
                  Interested
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
