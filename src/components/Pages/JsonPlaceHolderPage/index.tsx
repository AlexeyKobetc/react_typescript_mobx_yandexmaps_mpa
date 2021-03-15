import React from "react";
import { observer } from "mobx-react";

import Loading from "../../../sharedcomponents/Loading";

import { useContextJsonPlaceHolderStore } from "./store/RootStore";
import { renderCard } from "./components/functions";

const JsonPlaceHolderPage = observer(() => {
  const { isPostsLoad, getPosts, getNextPortionPosts } = useContextJsonPlaceHolderStore();
  return (
    <React.Fragment>
      {!isPostsLoad ? (
        <Loading text={`Загружаются посты с {JSON} Placeholder ...`} />
      ) : (
        <React.Fragment>
          <div className="row justify-content-center align-items-center">
            <div className="col d-flex flex-column justify-content-center align-items-center m-4">
              <h1 className="text-secondary"> {`{JSON} Placeholder`} </h1>
            </div>
          </div>

          <div className="row justify-content-center align-items-start">{renderCard(getPosts)}</div>

          <div className="row justify-content-center align-items-center">
            <div className="col-11 d-grid d-flex flex-column justify-content-center align-items-center m-4">
              <button type="button" className="btn btn-outline-secondary" onClick={getNextPortionPosts}>
                {`Загрузить следующие 10 постов c  {JSON}  Placeholder`}
              </button>
            </div>
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  );
});

export default JsonPlaceHolderPage;
