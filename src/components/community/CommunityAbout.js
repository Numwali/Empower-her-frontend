import { useEffect } from "react";
import { useParams } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { useGetCommunityQuery } from "../../redux/services/community/community-api";
import { fetchCommunity } from "../../redux/slices/community/community";
import Padlock from "../../assets/images/Padlock.png";
import creopa from "../../assets/images/community.png";

function CommunityAbout() {
  let { communityId } = useParams();
  const dispatch = useDispatch();

  // Get data stored in states
  const { community } = useSelector((state) => state.communities);

  // Redux query fetch Community
  const { data: communityData } = useGetCommunityQuery(communityId);

  // Store fetched data in state
  useEffect(() => {
    if (communityData) {
      dispatch(fetchCommunity(communityData?.community));
    }
  }, [communityData, dispatch]);

  const members = community?.members?.length;
  const community_description = community?.description;
  const community_name = community?.name;
  const privacy = community?.privacy;
  const creater_fn = community?.creator?.firstname;
  const creater_ln = community?.creator?.lastname;
  const rules = community?.rules;
  const profileImage = community?.profileImage;
  let created_At = '';

  if (community?.createdAt) {
    try {
      const date = new Date(community.createdAt);
      created_At = date.toISOString().split("T")[0];
    } catch (error) {
      created_At = 'Invalid date';
    }
  }

  return (
    <div className="w-full">
      <div className="p-2 bg-[#fff] dark:!bg-dark-primary mb-2">
        <div className="flex py-3">
          <img
            src={
              profileImage == "" || profileImage == undefined
                ? creopa
                : profileImage
            }
            alt="community-Image"
            className="mx-3 w-12 rounded-xl"
          />
          <div className="">
            <h4 className="font-bold text-[#000] text-base">
              {community_name}
            </h4>
            <h4 className="font-medium dark:!text-dark-gray-300 text-sm">
              Community . <span className="">{members}</span>{" "}
              {members > 1 ? " Members" : " Member"}
            </h4>
          </div>
        </div>
      </div>

      <div className=" flex p-2 bg-[#fff] dark:!bg-dark-primary my-2">
        <img
          src={Padlock}
          alt="privacy"
          className="mx-3 p-2 w-12 rounded-full bg-[#ccc]"
        />
        <div className="">
          <h4 className="font-bold text-[#000] text-base">
            Privacy
          </h4>
          <p className="capitalize dark:!text-dark-gray-300 text-sm">
            {privacy}
          </p>
        </div>
      </div>

      <div className="p-2 bg-[#fff] dark:bg-dark-primary my-2">
        <div className="py-3">
          <div className="">
            <h4 className="font-bold text-[#000] text-base">
              Community-Description
            </h4>
            <p className="capitalize my-2 dark:text-dark-gray-300 text-sm">
              {community_description}
            </p>
            <h4 className="text-[#0e0d0d] text-sm">
              Created By {creater_fn} {creater_ln}
            </h4>
            <h4 className="text-[#ccc] text-sm">
              At <span className="">{created_At}</span>
            </h4>
          </div>
        </div>
      </div>

      <div className="bg-white dark:!bg-dark-primary  p-3 my-2">
        <h3 className="font-semibold text-[#000] text-base">
          This Community Go With Rules
        </h3>
        <p className="dark:!text-dark-gray-300 text-sm">
          {!rules || rules.length === 0 ? (
            "No Rules Setted Right There"
          ) : (
            <ol>
              {rules.map((rule, index) => (
                <li key={index}>{rule}</li>
              ))}
            </ol>
          )}
        </p>
      </div>
    </div>
  );
}

export default CommunityAbout;
