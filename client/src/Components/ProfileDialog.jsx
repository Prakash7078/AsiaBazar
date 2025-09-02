import React, { useEffect, useState } from "react";
import { BASE_URL } from "../config/url";

function ProfileDialog({ rollno, handle }) {
  const [userInfo, setUserInfo] = useState(null);
  const [isLoad, setIsLoad] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      await fetch(`${BASE_URL}/api/users/${rollno}`, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => setUserInfo(data))
        .finally(setIsLoad(false));
      setUserInfo(user.data);
      console.log("user", user.data);
    };
    fetchData();
  }, []);
  return (
    <div className="bg-white rounded-lg p-10 w-fit mx-auto flex flex-col items-end">
      {isLoad ? (
        <h1 className="text-center font-bold text-xl my-auto">LOADING...</h1>
      ) : (
        <div className="flex gap-3 flex-col">
          <img
            src={userInfo?.image}
            className="w-36 mb-4 h-36 mx-auto rounded-full"
            alt="user"
          />
          <h1>
            <span className="font-semibold ">Name:</span> {userInfo?.username}
          </h1>
          <h1>
            <span className="font-semibold ">Email:</span> {userInfo?.email}
          </h1>
          <h1>
            <span className="font-semibold ">Roll No:</span> {userInfo?.rollno}
          </h1>
          <h1>
            <span className="font-semibold ">Section:</span> {userInfo?.section}
          </h1>
          <h1>
            <span className="font-semibold ">Branch:</span> {userInfo?.branch}
          </h1>
        </div>
      )}
      <button
        className="flex my-2 justify-end bg-green-300 px-6 py-1 rounded-lg"
        onClick={handle}
      >
        Close
      </button>
    </div>
  );
}

export default ProfileDialog;
