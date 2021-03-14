import { action, computed, makeObservable, observable } from "mobx";
import { commentsUrl, getData, postsUrl, usersUrl } from "../components/functions";
import { IComment, IPost, IUser } from "../components/types";

class JsonPlaceHolderStore {
  posts: IPost[] = [];

  postsLoadStatus: {
    isCommentsLoad: boolean;
    isPostsLoad: boolean;
    isUsersLoad: boolean;
  } = {
    isCommentsLoad: false,
    isUsersLoad: false,
    isPostsLoad: false
  };

  currentCountFetchedPosts = 11;
  prevCountFetchedPosts = 1;

  get getPosts() {
    return this.posts;
  }

  get isPostsLoad() {
    const { isCommentsLoad, isUsersLoad, isPostsLoad } = this.postsLoadStatus;
    return isCommentsLoad && isUsersLoad && isPostsLoad;
  }

  constructor() {
    makeObservable(this, {
      posts: observable,
      postsLoadStatus: observable,
      getpostData: action,
      getPosts: computed,
      isPostsLoad: computed
    });

    this.getPortionPosts();
  }

  getPortionPosts = () => {
    let postsUrls = Array(this.currentCountFetchedPosts - this.prevCountFetchedPosts)
      .fill(null)
      .map((_, index) => postsUrl + "/" + (this.prevCountFetchedPosts + index));

    for (const url of postsUrls) {
      this.getpostData(url);
    }
  };

  getNextPortionPosts = () => {
    this.prevCountFetchedPosts = this.currentCountFetchedPosts;
    this.currentCountFetchedPosts += this.currentCountFetchedPosts;
    this.getPortionPosts();
  };

  getpostData = (url: string) => {
    getData(url)
      .then((post: IPost) => {
        const { id, userId } = post;
        this.postsLoadStatus.isPostsLoad = true;
        getData(commentsUrl + "?postId=" + id)
          .then((comments: IComment[]) => {
            this.postsLoadStatus.isCommentsLoad = true;
            post = { ...post, comments };
            getData(usersUrl + "/" + userId)
              .then((user: IUser) => {
                this.postsLoadStatus.isUsersLoad = true;
                post = { ...post, user };

                this.posts.push(post);
              })
              .catch((error: Error) => console.log(error.message));
          })
          .catch((error: Error) => console.log(error.message));
      })
      .catch((error: Error) => console.log(error.message));
  };
}

export default JsonPlaceHolderStore;
