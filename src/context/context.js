import React, { useState, useEffect } from "react";
import mockUser from "./mockData.js/mockUser";
import mockRepos from "./mockData.js/mockRepos";
import mockFollowers from "./mockData.js/mockFollowers";
import axios from "axios";
import { createContext } from "react";

const rootUrl = "https://api.github.com";

const GithubContext = createContext();

const GithubProvider = ({ children }) => {
  const [githubUser, setGithubUser] = useState(mockUser);
  const [repos, setRepos] = useState(mockRepos);
  const [followers, setFollowers] = useState(mockFollowers);

  //!Request Loading
  const [requests, setRequests] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  // !error
  const [error, setError] = useState({ show: false, msg: "" });

  const searchGithubUser = async (user) => {
    toggleError();
    //!Toggle Error
    setIsLoading(true);
    //!SetLoading True

    const response = await axios(`${rootUrl}/users/${user}`).catch((err) =>
      console.log(err)
    );
    if (response) {
      console.log(response.data, "User");
      setGithubUser(response.data);
      const { login, followers_url, repos_url } = response.data;

      //!Followers
      //https://api.github.com/users/john-smilga/followers
      // axios(`${followers_url}?per_page=100`)
      //   .then((res) => {
      //     console.log(res.data, "followers");
      //     res && setFollowers(res.data);
      //   })
      //   .catch((err) => console.log(err));

      //!Repos
      //https://api.github.com/users/john-smilga/repos?per_page=100
      // axios(`${repos_url}?per_page=100`)
      //   .then((res) => {
      //     console.log(res.data, "repos");
      //     res && setRepos(res.data);
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //   });
      await Promise.allSettled([
        axios(`${followers_url}?per_page=100`),
        axios(`${repos_url}?per_page=100`),
      ])
        .then((res) => {
          const [followers, repos] = res;
          if (followers.status === "fulfilled")
            setFollowers(followers.value.data);

          if (repos.status === "fulfilled") setRepos(repos.value.data);
        })
        .catch((err) => console.log(err));
    } else {
      toggleError(true, "There is no user with that username");
    }
    checkRequests();
    setIsLoading(false);
    // console.log(user);
  };

  //! Check Rate
  const checkRequests = () => {
    axios(`${rootUrl}/rate_limit`)
      .then((res) => {
        // console.log(res.data);
        let {
          rate: { remaining },
        } = res.data;
        // remaining=0;
        setRequests(remaining);
        if (remaining === 0) {
          //! Throw an Error
          toggleError(true, "You have exceeded your hourly rate limit");
        }
      })
      .catch((err) => console.log(err));
  };

  //!Toggle Error Function
  const toggleError = (show = false, msg = "") => {
    setError({ show, msg });
  };

  useEffect(checkRequests, []);

  return (
    <GithubContext.Provider
      value={{
        githubUser,
        repos,
        followers,
        requests,
        error,
        searchGithubUser,
        isLoading,
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};

export { GithubContext, GithubProvider };
