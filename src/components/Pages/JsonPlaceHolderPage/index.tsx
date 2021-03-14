import { observer } from "mobx-react";
import React from "react";
import { IComment, IPost } from "./components/types";
import { useContextJsonPlaceHolderStore } from "./store/RootStore";

const JsonPlaceHolderPage = observer(() => {
  const { isPostsLoad, getPosts, getNextPortionPosts } = useContextJsonPlaceHolderStore();
  return (
    <React.Fragment>
      {!isPostsLoad ? (
        <div className="row justify-content-center align-items-center">
          <div className="col d-flex flex-column justify-content-center align-items-center m-4">
            <div>
              <h1 className="text-secondary">{`Загружаются посты с {JSON} Placeholder ...`}</h1>
            </div>

            <div className="spinner-border text-secondary m-4" role="status">
              <span className="visually-hidden">{`Загружаются посты с {JSON} Placeholder ...`}</span>
            </div>
          </div>
        </div>
      ) : (
        <React.Fragment>
          <div className="row justify-content-center align-items-center">
            <div className="col d-flex flex-column justify-content-center align-items-center m-4">
              <div>
                <h1 className="text-secondary"> {`{JSON} Placeholder`} </h1>
              </div>
            </div>
          </div>
          <div className="row justify-content-center align-items-start">
            {getPosts.map((post: IPost, index: number) => {
              const {
                userId,
                id,
                title,
                body,
                comments,
                user: { username, email }
              } = post;

              return (
                <div
                  className="col-12 col-sm-11 col-md-5 d-flex flex-column justify-content-center align-items-center m-2"
                  key={`${userId}_${id}_${index}`}
                >
                  <div className="card">
                    <div className="card-header d-flex flex-row justify-content-between align-items-center">
                      <div>{`Автор: ${username}`}</div>
                      <div>{email}</div>
                    </div>
                    <div className="card-body">
                      <h5 className="card-title">{title}</h5>

                      <p className="card-text">{body}</p>
                    </div>
                    <h6 className="card-footer m-0">Комментарии:</h6>
                    <div className="card-footer text-muted">
                      {comments.length &&
                        comments.map((comment: IComment, index: number) => {
                          const { postId, id, name, email, body } = comment;
                          return (
                            <div key={`${postId}_${id}_${index}`} className="p-1 mt-2">
                              <div>
                                <h6> {body}</h6>
                                <h6>
                                  <strong> от: {email}</strong>
                                </h6>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
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
