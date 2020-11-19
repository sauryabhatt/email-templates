/** @format */

import React, { useState, useEffect } from "react";
import Icon from "@ant-design/icons";
import { Radio, Input, Button } from "antd";
import closeButton from "../../public/filestore/closeButton";
import Link from "next/link";
import addToCollectionIcon from "../../public/filestore/addToCollection";

function AddToCollection(props) {
  let {
    onClose = "",
    token = "",
    userProfile = {},
    articleId = "",
    sellerCode = "",
    savedProductToCollection = "",
  } = props;

  const [value, setValue] = useState(props.selectedCollection);
  const [error, setError] = useState(false);
  const [collections, setCollections] = useState([]);
  const [collectionName, setCollectionName] = useState("");
  let { profileId = "" } = userProfile || {};

  useEffect(() => {
    let { userCollections = "" } = props;
    if (userCollections && userCollections.length) {
      setCollections(props.userCollections);
      if (props.selectedCollection) {
        setValue(props.selectedCollection);
      } else {
        setValue(props.userCollections[0]["name"]);
      }
    }
  }, [props.userCollections]);

  const onChange = (e) => {
    let newCollections = [...collections];
    let collectionsList = newCollections.filter(function (e) {
      return e.name !== "";
    });
    setCollections(collectionsList);
    setValue(e.target.value);
  };

  const createCollection = () => {
    let newCollections = [...collections];
    let collectionsList = newCollections.filter(function (e) {
      return e.name === "";
    });
    if (value !== "" && collectionsList.length === 0) {
      let newCollection = [
        {
          id: "",
          name: "",
          createdTime: "",
          buyerId: profileId,
          products: [],
        },
        ...collections,
      ];
      setValue("");
      setCollections(newCollection);
    } else if (collections.length === 0) {
      let newCollection = [
        {
          id: "",
          name: "",
          createdTime: "",
          buyerId: profileId,
          products: [],
        },
        ...collections,
      ];
      setValue("");
      setCollections(newCollection);
    }
  };

  const addNewCollection = (e) => {
    let value = e.target.value;
    let name = value.trim();
    if (name.length >= 3) {
      setError(false);
      setCollectionName(name);
      setValue(name);
    } else {
      setCollectionName("");
      setValue("");
      setError(true);
    }
  };

  const saveCollection = () => {
    let newCollection = [...collections];
    let buyerId = profileId.replace("BUYER::", "");
    if (newCollection[0]["name"] === "") {
      newCollection[0]["name"] = collectionName;
    }
    setCollections(newCollection);
    fetch(
      `${process.env.NEXT_PUBLIC_REACT_APP_COLLECTION_URL}/collections/buyer/product?buyer_id=${buyerId}&article_id=${articleId}&collection=${value}&seller_id=${sellerCode}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw res.statusText || "Error while signing up.";
        }
      })
      .then((res) => {
        setCollections(res);
        onClose();
        savedProductToCollection(value);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const radioStyle = {
    display: "block",
    height: "50px",
    lineHeight: "50px",
  };

  return (
    <div className="add-to-collection qa-rel-pos">
      <div
        onClick={() => {
          onClose();
          let newCollections = [...collections];
          let collectionsList = newCollections.filter(function (e) {
            return e.name !== "";
          });
          setCollections(collectionsList);
        }}
        style={{
          position: "absolute",
          right: "-8px",
          top: "-8px",
          cursor: "pointer",
          zIndex: "1",
        }}
      >
        <Icon
          component={closeButton}
          style={{ width: "30px", height: "30px" }}
        />
      </div>
      <div className="atc-title qa-mar-btm-1">Save to</div>
      <div className="atc-subtitle qa-pad-btm-1">
        You can now send a Request for quote for an entire collection! Start
        saving products now!
      </div>
      <div className="atc-save-new" onClick={createCollection}>
        <div className="qa-disp-tc">Save new Collection</div>
        <Icon
          component={addToCollectionIcon}
          className="atc-icon"
          style={{
            width: "15px",
            marginLeft: "5px",
            verticalAlign: "middle",
          }}
        />
      </div>
      {collections.length > 0 && (
        <div className="atc-radio-group">
          <Radio.Group onChange={onChange} value={value}>
            {collections.map((collection, i) => {
              return (
                <Radio
                  style={radioStyle}
                  value={collection["name"] === "" ? value : collection["name"]}
                  key={i}
                >
                  {collection["name"] === "" ? (
                    <span>
                      <Input
                        onChange={addNewCollection}
                        placeholder="Enter name here"
                      />
                      {error && (
                        <div className="qa-error qa-fs-12 qa-mar-top-05">
                          Collection name should be 3-50 characters!
                        </div>
                      )}
                    </span>
                  ) : (
                    collection["name"]
                  )}
                </Radio>
              );
            })}
          </Radio.Group>
        </div>
      )}
      <div>
        <Button
          className="save-collection-button qa-mar-btm-2"
          disabled={!value}
          onClick={saveCollection}
        >
          Save
        </Button>
        <Link href="/account/collections">
          <Button className="go-to-collection-button">
            Go to my collection
          </Button>
        </Link>
      </div>
      <div className="atc-info">
        You can find your saved collections in My Account/My Collections
      </div>
    </div>
  );
}

export default AddToCollection;
