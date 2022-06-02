import React, { useEffect } from "react";
import { useState } from "react";
import { MdArrowDropDown } from "react-icons/md";
import { MdArrowRight } from "react-icons/md";
import { AiOutlinePlus } from "react-icons/ai";

export default function ListOfDMs({
  requiredHeaders,
  selectedUserEmail,
  setSelectedUserEmail,
  setSelectedUserId,
}) {
  const [isDMHeaderClicked, setIsDMHeaderClicked] = useState(false);
  const [isDMHeaderHovered, setIsDMHeaderHovered] = useState(false);
  const [recentDMUsers, setRecentDMUsers] = useState([]);
  // const [isUserSelected, setIsUserSelected] = useState(false);

  useEffect(() => {
    apiRecentDM();
  }, [recentDMUsers]);

  const handleNewMessageClicked = () => {
    setSelectedUserEmail("New Message");
    setSelectedUserId("");
  };

  function apiRecentDM() {
    //Get recently DMS API
    var myHeaders = new Headers();
    myHeaders.append("access-token", requiredHeaders.accessToken);
    myHeaders.append("client", requiredHeaders.clientToken);
    myHeaders.append("expiry", requiredHeaders.expiry);
    myHeaders.append("uid", requiredHeaders.uid);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch("http://206.189.91.54//api/v1/users/recent", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        let listOfRecentDMs = result.data;
        setRecentDMUsers(
          listOfRecentDMs.map(({ email, id }) => ({ email, id }))
        );
        // setRecentDMUsers(listOfRecentDMs.filter((obj, i) => listOfRecentDMs.indexOf(obj) === i))
      })
      .catch((error) => console.log("error", error));
  }

  const handleDMHeaderCLicked = () => {
    setIsDMHeaderClicked(!isDMHeaderClicked);
    apiRecentDM();
  };

  function DMUsers({ recentDMUsers, setSelectedUserEmail, setSelectedUserId }) {
    let uniqueRecentDMUsers = [
      ...new Map(recentDMUsers.map((item) => [item["id"], item])).values(),
    ];
    console.log(uniqueRecentDMUsers);

    return uniqueRecentDMUsers.map(({ email, id }) => (
      <div key={id}>
        <DMUser
          email={email}
          id={id}
          setSelectedUserEmail={setSelectedUserEmail}
          setSelectedUserId={setSelectedUserId}
        />
      </div>
    ));
  }

  function DMUser({ email, id, setSelectedUserEmail, setSelectedUserId }) {
    // const [isUserClicked, setIsUserClicked] = useState(false);

    const handleUserClicked = () => {
      setSelectedUserEmail(email);
      setSelectedUserId(id);
      // setIsUserClicked(true);
    };

    return (
      <li
        className="li-DMUser"
        onClick={handleUserClicked}
        // className={`li-DMUser ${isUserClicked ? 'clicked' : 'not-clicked'}`}
      >
        {email}
      </li>
    );
  }

  return (
    <div>
      <div
        className="header-dm"
        onMouseEnter={() => setIsDMHeaderHovered(true)}
        onMouseLeave={() => setIsDMHeaderHovered(false)}
      >
        <div className="header-title" onClick={handleDMHeaderCLicked}>
          <div className="button-dropdown">
            {isDMHeaderClicked ? <MdArrowDropDown /> : <MdArrowRight />}
          </div>
          <span>Direct messages</span>
        </div>
        <div
          className={`button-plus ${
            isDMHeaderHovered ? "hovered" : "not-hovered"
          }`}
          onClick={handleNewMessageClicked}
        >
          <AiOutlinePlus />
        </div>
      </div>
      <nav className={`${isDMHeaderClicked ? "dms-active" : "dms-inactive"}`}>
        <ul className="ul-DMUsers">
          <DMUsers
            recentDMUsers={recentDMUsers}
            setSelectedUserEmail={setSelectedUserEmail}
            setSelectedUserId={setSelectedUserId}
          />
        </ul>
      </nav>
    </div>
  );
}
