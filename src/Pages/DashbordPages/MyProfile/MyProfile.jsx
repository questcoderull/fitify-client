import { useEffect, useRef, useState } from "react";
import { FaEdit, FaTimes } from "react-icons/fa";
import toast from "react-hot-toast";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import axios from "axios";

const MyProfile = () => {
  const { user, updateUserProfile } = useAuth();
  const axiosSecure = useAxiosSecure();
  const fileInputRef = useRef();
  const [profileData, setProfileData] = useState(null);
  const [name, setName] = useState(user?.displayName || "");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profilePic, setProfilePic] = useState(user?.photoURL || "");
  const [initialValues, setInitialValues] = useState({});
  const [changesMade, setChangesMade] = useState(false);

  useEffect(() => {
    if (!user?.email) return;

    axiosSecure.get(`/users/profile/${user.email}`).then((res) => {
      setProfileData(res.data);
      console.log(res.data);
      setInitialValues({
        name: user.displayName,
        photo: user.photoURL,
      });
    });
  }, [user, axiosSecure]);

  useEffect(() => {
    setChangesMade(
      name !== initialValues.name || profilePic !== initialValues.photo
    );
  }, [name, profilePic, initialValues]);

  const handleImageUpload = async (e) => {
    const image = e.target.files[0];
    const formData = new FormData();
    formData.append("image", image);

    const imageUploadUrl = `https://api.imgbb.com/1/upload?key=${
      import.meta.env.VITE_image_upload_key
    }`;

    try {
      const res = await axios.post(imageUploadUrl, formData);
      setProfilePic(res.data.data.url);
      toast.success("Image uploaded");
    } catch (error) {
      toast.error("Image upload failed");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateUserProfile({
        displayName: name,
        photoURL: profilePic,
      });

      await axiosSecure.patch(`/user/profile/${user?.email}`, {
        name: name,
        profilePic: profilePic,
      });

      toast.success("Profile updated");
      setIsEditing(false);
      setInitialValues({ name, photo: profilePic });
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setName(initialValues.name);
    setProfilePic(initialValues.photo);
  };

  return (
    // <div className="flex items-center justify-center min-h-screen bg-base-200 px-4">
    //   <div className="w-full max-w-5xl mx-auto px-4 pt-8 pb-4 border border-primary rounded-3xl">
    //     <h2 className="text-3xl font-bold mb-6 text-center text-primary">
    //       My Profile
    //     </h2>

    //     <div className="bg-base-100 shadow-lg rounded-2xl border border-primary p-6 space-y-6">
    //       {/* Profile Picture and Basic Info */}
    //       <div className="flex flex-col md:flex-row items-center gap-6">
    //         <div className="relative">
    //           <img
    //             src={profilePic || "https://i.ibb.co/2N4dqJ3/default-user.png"}
    //             alt="Profile"
    //             className="w-32 h-32 rounded-full border object-cover"
    //           />
    //           {isEditing && (
    //             <>
    //               <button
    //                 onClick={() => fileInputRef.current.click()}
    //                 className="absolute bottom-1 right-1 bg-white p-2 rounded-full border hover:bg-gray-100 shadow"
    //                 title="Change photo"
    //               >
    //                 <FaEdit className="text-primary" />
    //               </button>
    //               <input
    //                 type="file"
    //                 accept="image/*"
    //                 onChange={handleImageUpload}
    //                 ref={fileInputRef}
    //                 className="hidden"
    //               />
    //             </>
    //           )}
    //         </div>

    //         <div className="space-y-1 w-full">
    //           <div className="flex justify-between items-center">
    //             <h3 className="text-xl font-bold text-primary">{name}</h3>
    //             {!isEditing && (
    //               <button
    //                 className="btn btn-sm btn-outline btn-primary"
    //                 onClick={() => setIsEditing(true)}
    //               >
    //                 Update Profile
    //               </button>
    //             )}
    //             {isEditing && (
    //               <button
    //                 onClick={handleCancelEdit}
    //                 title="Cancel Edit"
    //                 className="btn btn-sm btn-ghost text-error"
    //               >
    //                 <FaTimes />
    //               </button>
    //             )}
    //           </div>
    //           <p className="text-sm  font-normal text-black">
    //             Email:{" "}
    //             <span className="text-primary font-semibold">
    //               {user?.email}
    //             </span>
    //           </p>
    //           <p className="text-sm  font-normal text-black capitalize">
    //             Role:{" "}
    //             <span className="text-primary font-semibold">
    //               {profileData?.role || "Member"}
    //             </span>
    //           </p>

    //           {/* <p className="text-sm  font-normal text-black">
    //             Last Login:{" "}
    //             <span className="text-primary font-semibold">
    //               {user?.metadata?.lastSignInTime || "Not available"}
    //             </span>
    //           </p>

    //           <p className="text-sm  font-normal text-black">
    //             Joined to this site:{" "}
    //             <span className="text-primary font-semibold">
    //               {profileData?.created_at ? profileData.created_at : "N/A"}
    //             </span>
    //           </p> */}

    //           <p className="text-sm font-normal text-black">
    //             Last Login:{" "}
    //             <span className="text-primary font-semibold">
    //               {user?.metadata?.lastSignInTime
    //                 ? new Date(user.metadata.lastSignInTime).toLocaleDateString(
    //                     "en-GB"
    //                   )
    //                 : "Not available"}
    //             </span>
    //           </p>

    //           <p className="text-sm font-normal text-black">
    //             Joined to this site:{" "}
    //             <span className="text-primary font-semibold">
    //               {profileData?.created_at
    //                 ? new Date(profileData.created_at).toLocaleDateString(
    //                     "en-GB"
    //                   )
    //                 : "N/A"}
    //             </span>
    //           </p>
    //         </div>
    //       </div>

    //       {/* Editable Form */}
    //       {isEditing && (
    //         <form onSubmit={handleUpdate} className="space-y-4 pt-4 border-t">
    //           <div>
    //             <label className="block font-medium mb-1">Name</label>
    //             <input
    //               type="text"
    //               className="input input-bordered w-full"
    //               value={name}
    //               onChange={(e) => setName(e.target.value)}
    //             />
    //           </div>

    //           <div>
    //             <label className="block font-medium mb-1">
    //               Photo URL (optional)
    //             </label>
    //             <input
    //               type="text"
    //               className="input input-bordered w-full"
    //               value={profilePic}
    //               onChange={(e) => setProfilePic(e.target.value)}
    //             />
    //           </div>

    //           <div className="text-right">
    //             <button
    //               type="submit"
    //               className="btn btn-primary"
    //               disabled={!changesMade || loading}
    //             >
    //               {loading ? "Updating..." : "Save Changes"}
    //             </button>
    //           </div>
    //         </form>
    //       )}
    //     </div>
    //   </div>
    // </div>

    <div className="min-h-screen bg-base-200 px-4 py-10 flex justify-center items-start">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-3xl border border-primary p-6 space-y-6">
        {/* Heading */}
        <h2 className="text-3xl font-bold text-center text-primary mb-6">
          My Profile
        </h2>

        {/* Profile Image */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <img
              src={profilePic || "https://i.ibb.co/2N4dqJ3/default-user.png"}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-primary shadow-md"
            />
            {isEditing && (
              <>
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow border hover:bg-gray-100 cursor-pointer"
                  title="Change photo"
                >
                  <FaEdit className="text-primary" />
                </button>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  ref={fileInputRef}
                  className="hidden"
                />
              </>
            )}
          </div>
        </div>

        {/* Basic Info Section */}
        <div className="text-center space-y-1">
          <h3 className="text-xl font-bold text-primary">{name}</h3>

          <p className="text-sm text-gray-700">
            Email:{" "}
            <span className="text-primary font-semibold">{user?.email}</span>
          </p>

          <p className="text-sm text-gray-700 capitalize">
            Role:{" "}
            <span className="text-primary font-semibold">
              {profileData?.role || "Member"}
            </span>
          </p>
          {/* 
          <p className="text-sm text-gray-700">
            Last Login:{" "}
            <span className="text-primary font-semibold">
              {user?.metadata?.lastSignInTime
                ? new Date(user.metadata.lastSignInTime).toLocaleDateString(
                    "en-GB"
                  )
                : "Not available"}
            </span>
          </p> */}

          <p className="text-sm text-gray-700">
            Last Login:{" "}
            <span className="text-primary font-semibold">
              {user?.metadata?.lastSignInTime
                ? new Date(user.metadata.lastSignInTime).toLocaleString(
                    "en-GB",
                    {
                      dateStyle: "short",
                      timeStyle: "short",
                      hour12: true,
                    }
                  )
                : "Not available"}
            </span>
          </p>

          <p className="text-sm text-gray-700">
            Joined:{" "}
            <span className="text-primary font-semibold">
              {profileData?.created_at
                ? new Date(profileData.created_at).toLocaleDateString("en-GB")
                : "N/A"}
            </span>
          </p>

          {/* Action Buttons */}
          <div className="mt-4 flex justify-center gap-4">
            {!isEditing ? (
              <button
                className="btn btn-outline btn-primary"
                onClick={() => setIsEditing(true)}
              >
                Update Profile
              </button>
            ) : (
              <button
                onClick={handleCancelEdit}
                className="btn btn-ghost text-error"
                title="Cancel Edit"
              >
                <FaTimes /> Cancel
              </button>
            )}
          </div>
        </div>

        {/* Edit Form */}
        {isEditing && (
          <form onSubmit={handleUpdate} className="space-y-4 border-t pt-6">
            <div>
              <label className="block font-medium mb-1">Name</label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="block font-medium mb-1">
                Photo URL (optional)
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={profilePic}
                onChange={(e) => setProfilePic(e.target.value)}
              />
            </div>

            <div className="text-right">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!changesMade || loading}
              >
                {loading ? "Updating..." : "Save Changes"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
