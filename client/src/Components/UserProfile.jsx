import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../config/url";
import { useDispatch, useSelector } from "react-redux";
import { getRegisters } from "../redux/registerSlice";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import Profile from "../pages/Profile";
import { getNotifications } from "../redux/adminSlice";
import { toast } from "react-toastify";

function UserProfile() {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.auth.userInfo);
  const [profileuser, setProfileuser] = useState(null);
  const registers = useSelector((state) => state.register.registers);
  const navigate = useNavigate();
  const notifications = useSelector((state) => state.admin.notifications);
  const handleStatus = async (id) => {
    try {
      await axios.put(`${BASE_URL}/api/msgs/notifications/status/${id}`);
      await dispatch(getNotifications());
    } catch (err) {
      toast.error("Network error");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const res1 = await axios.get(`${BASE_URL}/api/users/${userInfo.rollno}`);
      await dispatch(getNotifications(userInfo?.rollno));
      dispatch(getRegisters());
      setProfileuser(res1);
    };
    fetchData();
  }, [dispatch]);
  const data = [
    {
      label: "My Profile",
      value: "profile",
    },
    {
      label: "Registrations",
      value: "registers",
    },
    {
      label: "Notifications",
      value: "msgs",
    },
  ];

  return (
    <div className="mx-auto max-h-full  sm:px-32 pt-28  px-4 bg-[#fff3e0]">
      <h1 className="font-bold text-2xl mb-10">My Profile</h1>

      <Tabs value="profile">
        <TabsHeader>
          {data.map(({ label, value }) => (
            <Tab key={value} value={value}>
              <div className="flex items-center gap-2">{label}</div>
            </Tab>
          ))}
        </TabsHeader>
        <TabsBody
          animate={{
            initial: { y: 250 },
            mount: { y: 0 },
            unmount: { y: 250 },
          }}
        >
          {data.map(({ value }) => (
            <TabPanel
              key={value}
              value={value}
              className="flex bg-white shadow-inner rounded-md my-10 items-center justify-center"
            >
              {value === "profile" && profileuser && <Profile />}
              {value === "registers" && registers && (
                <div className="bg-white w-full p-16">
                  <h1 className="font-bold text-2xl">Events Attended</h1>
                  {registers
                    .filter(
                      (item) =>
                        item?.eventregisteruser?.rollno === userInfo?.rollno
                    )
                    .map((item, index) => (
                      <div
                        key={index}
                        className="p-4 m-5 flex gap-20 border-b-2 border-gray-300 items-center"
                      >
                        <div className="">
                          <img
                            src={item?.eventregisteruser?.image}
                            className="w-24 object-cover h-24"
                            alt="item.club"
                          />
                        </div>
                        <div className="">
                          <h1>
                            <span className="font-bold">ClubName</span>{" "}
                            {item?.clubname}
                          </h1>
                          <h1>
                            <span className="font-bold">EventName</span>{" "}
                            {item?.event?.eventname}
                          </h1>
                          <button
                            onClick={() =>
                              navigate(`/allEvents/${item?.event?._id}/details`)
                            }
                            className="mt-3 text-purple-500 font-bold"
                          >
                            See Details
                          </button>
                          {/* <h1><span className='font-bold'>Year</span> {item.year}</h1>
                                        <h1><span className='font-bold'>Section</span> {item.section}</h1> */}
                        </div>
                      </div>
                    ))}
                </div>
              )}
              {value === "msgs" && notifications && (
                <div className="md:p-16 p-5">
                  <div className="flex flex-wrap w-full gap-10">
                    {notifications
                      ?.filter((item) => item.isPast === false)
                      .map((item, index) => (
                        <div
                          key={index}
                          onClick={() => handleStatus(item._id)}
                          className={`flex bg-orange-100 flex-col gap-2 shadow-xl p-6`}
                        >
                          <h1 className="font-bold">{item?.user?.username}:</h1>
                          <h1>{item?.user?.email}</h1>
                          <h1>{item?.text}</h1>
                        </div>
                      ))}
                  </div>
                  <div className="flex flex-wrap w-full  gap-10">
                    {notifications
                      ?.filter((item) => item.isPast === true)
                      .map((item, index) => (
                        <div
                          key={index}
                          className={`flex bg-white
                            flex-col gap-2 shadow-xl p-6`}
                        >
                          <h1 className="font-bold">{item?.user?.username}:</h1>
                          <h1>{item?.user?.email}</h1>
                          <h1>{item?.text}</h1>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </TabPanel>
          ))}
        </TabsBody>
      </Tabs>
    </div>
  );
}

export default UserProfile;
