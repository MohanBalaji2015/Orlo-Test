import React, { useState, useEffect } from "react";

import axios from "axios";

export default function Dashboard() {
  const intialUrl = "https://www.theguardian.com/international/rss";
  const [formData, setFormData] = useState({ name: "", url: "" });
  const [feedList, setFeedList] = useState([
    { name: "test feed", url: intialUrl }
  ]);
  const [selectedOption, setSelectedOption] = useState({
    name: "test feed",
    url: intialUrl
  });
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if page is refresh or not based on that do respective operations
  useEffect(() => {
    if (window.performance) {
      if (performance.navigation.type === 1) {
        setFeedList(JSON.parse(sessionStorage.getItem("data")));
      } else {
        sessionStorage.setItem(
          "data",
          JSON.stringify([{ name: "test feed", url: intialUrl }])
        );
      }
    }

    // this is used to open all <a> tags in new tab
    window.onload = function() {
      let anchors = document.getElementsByTagName("a");
      for (let i = 0; i < anchors.length; i++) {
        anchors[i].setAttribute("target", "_blank");
      }
    };
  }, []);
  
  // this is used to load intial set of default feed on dashbaord
  useEffect(() => {
    const corsUrl = "https://api.rss2json.com/v1/api.json?rss_url=";
    axios
      .get(`${corsUrl}${selectedOption["url"]}`)
      .then(res => {
        let data = res.data;
        setPageData(data);
        console.log("Response",data);
        setLoading(false);
      })
      .catch(() => {
        alert("Something went wrong, please check rss url");
      });
  }, [selectedOption]);

  const handleChange = event => {
    let stateCopy = Object.assign({}, formData);
    stateCopy[event.target.name] = event.target.value;

    setFormData(stateCopy);
  };

  const handleSubmit = event => {
    event.preventDefault();
    let updatedList = [];
    updatedList = [...feedList, formData];
    setFeedList(updatedList);
    sessionStorage.setItem("data", JSON.stringify(updatedList));
    setFormData({ name: "", url: "" });
  };

  const onChangeValue = e => {
    setLoading(true);
    let option = {};
    option["name"] = e.target.id;
    option["url"] = e.target.value;
    setSelectedOption(option);
  };

    // function used to remove feeds from list
  const onCancel = e => {
    if (e.target.id !== "test feed" && e.target.id !== selectedOption.name) {
      let someArray = feedList.filter(x => x.name !== e.target.id);
      setFeedList(someArray);
      sessionStorage.setItem("data", JSON.stringify(someArray));
    }
  };

  // function used to filter search feeds 
  const handleSearch = e => {
    let updatedList = JSON.parse(sessionStorage.getItem("data"));
    updatedList = updatedList.filter(
      word => word.name.toUpperCase().indexOf(e.toUpperCase()) > -1
    );
    setFeedList(updatedList);
  };

  // function used to sort feeds once clicked on btn
  const sortFeeds = () => {
    function compare(a, b) {
      let first = new Date(a.pubDate).getTime();
      let second = new Date(b.pubDate).getTime();
      if (first < second) {
        return -1;
      }
      if (first > second) {
        return 1;
      }
      return 0;
    }

    let sortedData = pageData.items.sort(compare);
    setFormData(sortedData);
  };

  return (
    <div className="main-wrapper">
      <div className="left-conatiner">
        <div>
          <h2>Content Generator</h2>

          <input
            type="text"
            placeholder="Search"
            name="Search"
            onChange={event => handleSearch(event.target.value)}
          />
          <ul className="feed-list" onChange={e => onChangeValue(e)}>
            {feedList.map((el,key )=> {
              return (
                <li key={key}>
                  <div>
                    <input
                      type="radio"
                      id={el.name}
                      value={el.url}
                      url={el.url}
                      name="feed"
                      checked={selectedOption["name"] === el.name}
                      onChange={onChangeValue}
                    />
                    <div>{el.name}</div>
                  </div>

                  <button
                    className="cross-btn"
                    id={el.name}
                    onClick={e => {
                      onCancel(e);
                    }}
                  >
                    X
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
        <div>
          <h3>Add a new feed</h3>

          <form className="new-feed-form" onSubmit={e => handleSubmit(e)}>
            <label>
              <input
                type="text"
                value={formData.name}
                name="name"
                onChange={e => handleChange(e)}
                placeholder="type your feed name.."
              />
            </label>

            <label>
              <input
                type="text"
                value={formData.url}
                name="url"
                onChange={e => handleChange(e)}
                placeholder="copy your RSS url feed.."
              />
            </label>

            <input className="add-feed-btn" type="submit" value="Submit" />
          </form>
        </div>
      </div>
      <div className="right-container">
        {loading === true ? (
          <div className="loading">{"Loading..."}</div>
        ) : (
          <div>
            <p className="sort-feed">
              Sort your feeds -
              <button onClick={e => sortFeeds(e)}>Click here</button>
            </p>
            <div>
              {pageData.items.map((el,key) => {
                return (
                  <div key={key} className="feed-card">
                     <h1>{el.title}</h1>
                    <div className="top-header">
                      <p>{selectedOption.name}</p>
                      <p>{el.pubDate.split(" ")[0]}</p>
                    </div>

                    <br></br>
                    {el.thumbnail === "" ? (
                      <div></div>
                    ) : (
                      <img
                        className="thumbnail"
                        alt={"thumbnail"}
                        src={el.thumbnail}
                      ></img>
                    )}

                    <div
                      className="desc"
                      dangerouslySetInnerHTML={{
                        __html: el.content
                      }}
                    ></div>
                    <p className="post-link">
                      <a href={el.link}>VIEW POST -></a>
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
