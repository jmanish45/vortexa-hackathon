import React, { useState, useEffect } from "react";

const CommunityPage = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    author: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock data for initial posts - in a real app, these would come from a backend API
  useEffect(() => {
    setPosts([
      {
        id: 1,
        title: "Dealing with tomato blight",
        content:
          "I noticed some spots on my tomato leaves and I think it might be early blight. Has anyone dealt with this?",
        author: "FarmerJohn",
        timestamp: "2023-11-05T14:30:00Z",
        replies: [
          {
            id: 101,
            content:
              "I had a similar issue. Try removing affected leaves and ensure proper spacing between plants for better air circulation.",
            author: "GardenExpert",
            timestamp: "2023-11-05T15:20:00Z",
          },
          {
            id: 102,
            content: "Copper-based fungicides worked well for me last season.",
            author: "TomatoGrower",
            timestamp: "2023-11-05T16:45:00Z",
          },
        ],
      },
      {
        id: 2,
        title: "Best practices for organic pest control",
        content:
          "Looking for organic solutions to control aphids on my pepper plants. Any suggestions?",
        author: "OrganicFarmer",
        timestamp: "2023-11-04T10:15:00Z",
        replies: [
          {
            id: 201,
            content:
              "Neem oil is my go-to solution! Mix 2 tsp with a little dish soap in a quart of water.",
            author: "EcoGardener",
            timestamp: "2023-11-04T11:30:00Z",
          },
        ],
      },
    ]);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPost((prev) => ({ ...prev, [name]: value }));
  };

  const handlePostSubmit = (e) => {
    e.preventDefault();

    if (!newPost.title || !newPost.content || !newPost.author) {
      alert("Please fill all fields");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      // In a real app, you would send this to a backend API
      const newPostObj = {
        id: Date.now(),
        title: newPost.title,
        content: newPost.content,
        author: newPost.author,
        timestamp: new Date().toISOString(),
        replies: [],
      };

      setPosts((prevPosts) => [newPostObj, ...prevPosts]);
      setNewPost({ title: "", content: "", author: "" });
      setIsSubmitting(false);
    }, 600);
  };

  const [newReplies, setNewReplies] = useState({});
  const [replyingTo, setReplyingTo] = useState(null);

  const handleReplyChange = (postId, value) => {
    setNewReplies((prev) => ({
      ...prev,
      [postId]: { ...prev[postId], content: value },
    }));
  };

  const handleAuthorChange = (postId, value) => {
    setNewReplies((prev) => ({
      ...prev,
      [postId]: { ...prev[postId], author: value },
    }));
  };

  const handleReplySubmit = (postId) => {
    if (!newReplies[postId]?.content || !newReplies[postId]?.author) {
      alert("Please fill all fields for your reply");
      return;
    }

    const reply = {
      id: Date.now(),
      content: newReplies[postId].content,
      author: newReplies[postId].author,
      timestamp: new Date().toISOString(),
    };

    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            replies: [...post.replies, reply],
          };
        }
        return post;
      })
    );

    setNewReplies((prev) => ({
      ...prev,
      [postId]: { content: "", author: "" },
    }));

    setReplyingTo(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container-custom">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-gray-900">
          Farmer Community
        </h1>

        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <div className="card mb-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                  Share with the Community
                </h2>
                <form onSubmit={handlePostSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="author"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="author"
                        name="author"
                        value={newPost.author}
                        onChange={handleInputChange}
                        className="input w-full"
                        placeholder="Enter your name"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="title"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Title
                      </label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={newPost.title}
                        onChange={handleInputChange}
                        className="input w-full"
                        placeholder="What's your question or topic?"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="content"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Message
                      </label>
                      <textarea
                        id="content"
                        name="content"
                        value={newPost.content}
                        onChange={handleInputChange}
                        className="input w-full"
                        rows="4"
                        placeholder="Share your experience or question..."
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      type="submit"
                      className="btn btn-primary w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Posting..." : "Post Message"}
                    </button>
                  </div>
                </form>
              </div>

              <div className="card">
                <h3 className="font-medium mb-4 text-gray-800">
                  Community Guidelines
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 mr-2 text-primary-500 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Be respectful and supportive of other farmers
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 mr-2 text-primary-500 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Share knowledge and experiences freely
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 mr-2 text-primary-500 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Provide context when asking questions
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 mr-2 text-primary-500 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Keep discussions related to farming and plant health
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">
              Community Discussions
            </h2>

            {posts.length > 0 ? (
              <div className="space-y-6">
                {posts.map((post) => (
                  <div key={post.id} className="card">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {post.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          <span className="font-medium text-gray-700">
                            {post.author}
                          </span>{" "}
                          • {formatDate(post.timestamp)}
                        </p>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                          />
                        </svg>
                        {post.replies.length}
                      </div>
                    </div>

                    <p className="text-gray-700 mb-6">{post.content}</p>

                    {post.replies.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-500 mb-4">
                          Replies
                        </h4>
                        <div className="space-y-4">
                          {post.replies.map((reply) => (
                            <div
                              key={reply.id}
                              className="bg-gray-50 rounded-lg p-4"
                            >
                              <div className="flex justify-between mb-2">
                                <span className="font-medium text-gray-900">
                                  {reply.author}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {formatDate(reply.timestamp)}
                                </span>
                              </div>
                              <p className="text-gray-700">{reply.content}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {replyingTo === post.id ? (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">
                          Leave a Reply
                        </h4>
                        <div className="space-y-3">
                          <input
                            type="text"
                            placeholder="Your name"
                            value={newReplies[post.id]?.author || ""}
                            onChange={(e) =>
                              handleAuthorChange(post.id, e.target.value)
                            }
                            className="input text-sm w-full"
                          />
                          <textarea
                            placeholder="Write your reply..."
                            value={newReplies[post.id]?.content || ""}
                            onChange={(e) =>
                              handleReplyChange(post.id, e.target.value)
                            }
                            className="input text-sm w-full"
                            rows="3"
                          />
                        </div>
                        <div className="flex justify-end mt-3 space-x-2">
                          <button
                            className="btn bg-gray-200 text-gray-700 hover:bg-gray-300 text-sm"
                            onClick={() => setReplyingTo(null)}
                          >
                            Cancel
                          </button>
                          <button
                            className="btn btn-primary text-sm"
                            onClick={() => handleReplySubmit(post.id)}
                          >
                            Submit Reply
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        className="text-primary-50 font-medium text-sm hover:text-primary-200 flex items-center"
                        onClick={() => setReplyingTo(post.id)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                          />
                        </svg>
                        Reply
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="card text-center py-12">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 text-gray-300 mb-4 mx-auto"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <h3 className="text-xl font-medium text-gray-500 mb-2">
                  No discussions yet
                </h3>
                <p className="text-gray-500">
                  Be the first to start a discussion in our community!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
