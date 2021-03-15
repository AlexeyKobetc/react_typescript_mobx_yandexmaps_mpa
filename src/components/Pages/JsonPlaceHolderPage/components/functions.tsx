import { IComment, IPost } from "./types";

export const postsUrl = "https://jsonplaceholder.typicode.com/posts";
export const commentsUrl = "https://jsonplaceholder.typicode.com/comments";
export const usersUrl = "https://jsonplaceholder.typicode.com/users";

export async function getData(url: string): Promise<any> {
  const response = await fetch(url);
  return await response.json();
}

export const renderCard = (array: IPost[]) =>
  array.map((post: IPost, index: number) => {
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
                const { postId, id, email, body } = comment;
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
  });
