export const postsUrl = "https://jsonplaceholder.typicode.com/posts";
export const commentsUrl = "https://jsonplaceholder.typicode.com/comments";
export const usersUrl = "https://jsonplaceholder.typicode.com/users";

export async function getData(url: string): Promise<any> {
  const response = await fetch(url);
  return await response.json();
}
