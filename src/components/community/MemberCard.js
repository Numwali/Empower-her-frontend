import { useSelector } from "react-redux";
import img1 from "../../assets/images/profile.png";
import { useParams } from "react-router-dom";
import {
  useApproveCommunityMemberMutation,
  useRejectCommunityMemberMutation,
} from "../../redux/services/community/community-api";

export default function MemberCard({ data, status, creator }) {
  let { communityId } = useParams();
  const { user } = useSelector((state) => state.user);
  const [approveCommunityMember, { isLoading }] =
    useApproveCommunityMemberMutation();

  const [rejectCommunityMember, { isRejecting }] =
    useRejectCommunityMemberMutation();

  const handleApprove = async () => {
    try {
      await approveCommunityMember({
        communityId: communityId,
        userId: data?._id,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleReject = async () => {
    try {
      await rejectCommunityMember({
        communityId: communityId,
        userId: data?._id,
      });

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex items-center gap-2 text-sm">
      <img
        src={data?.profileImage ? data.profileImage : img1}
        alt={data?.firstname}
        className="w-16 h-16 rounded-full object-cover"
      />
      <div>
        <h1 className="font-semibold text-base dark:!text-dark-gray-300">
          {user?.id === data?._id ? (
            "You"
          ) : (
            <span>
              {data?.firstname} {data?.lastname}
            </span>
          )}{" "}
          {creator?._id === data?._id ? (
            <span className="text-primary"> Admin</span>
          ) : null}
        </h1>
        <p className="text-gray-500 dark:!text-dark-gray-300">
          {data?.address === "default" ? "Kigali, Rwanda" : data?.address}
        </p>

        {status === "pending" ? (
          <div className="flex gap-2">
            <button
              className=" bg-primary text-white px-2 py-1 rounded"
              onClick={handleApprove}
            >
              {isLoading ? "Loading.." : "Accept"}
            </button>
            <button
              className=" bg-[#c32d2d] text-white px-2 py-1 rounded"
              onClick={handleReject}
            >
              {isRejecting ? "Loading.." : " Reject"}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
