import './assets/style.css';
import './assets/BlogPage.css';
import pfpPlaceholder from './assets/img/pfp-placeholder.png';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import maidenImg from './assets/img/maiden.png';
import { BlogpostsBoard } from './features/blogposts/components/BlogpostsBoard';
import { getCurrentUname, getUserPfpURL } from './services/utils';

/// DEV blog JSON OBJECT
const blog_dev = {
  author: 'Mitin',
};
/// DEV blog JSON OBJECT

const BlogPage = () => {

  const { username } = useParams();
  const [blog, setBlog] = useState(null);

  {/* useEffect(() => {
    fetch(`/api/user/blog/${username}`)
      .then(r => r.json())
      .then(setBlog());
  }, [username]);*/}
  
  useEffect(() => {
    setBlog(blog_dev);
  },[])

  return <BlogRenderer data={blog} />;
  }

const BlogRenderer = (data) => {
  const [user, setUser] = useState(null);
  const [activeTopic, setActiveTopic] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(data.pfpURL || pfpPlaceholder);
  const [topics, setTopics] = useState({});

  const author = data.author;

  /// auth & authority check
  useEffect(() => {
    const currentUname = getCurrentUname();
    if(currentUname!='' && currentUname){
      setUser({ username: currentUname });
    }
    
  }, []);

  function checkAuthority(user, author) {
    return user.username === author ? True : False;
  };
  /// auth & authority check

  /// blogposting
  function handleBlogpostSent(sentBlogpost) {
    addBlogpost(sentBlogpost, { activate: true }); /// THIS IS DIABOLICAL WHO CALLS VARIABLES "SENTBLOGPOST" AND "SENDBLOGPOST" FUNCTION IDIOT
  }
  /// blogposting

  return (
    <div id="bg-container" className="bg-container">
      <div id="blog-layout" className='blog-layout'>
        <section
          id="author-window"
          className="app-window"
          data-msg-tab-content
        ><img id="user-pfp" src={avatarUrl} alt="" className="user-pfp" />
        </section>

        <section
          id="posts-window"
          className="app-window"
          data-msg-tab-content
        >
          <div id="posts-container text-center">
            <BlogpostsBoard
              activeTopic={activeTopic}
              topics={topics}
              onActiveTopicChange={setActiveTopic}
              onBlogpostSend={handleBlogpostSent}
            />
          </div>
        </section>
      </div>

      <img id="maiden-img" className="maiden-img" src={maidenImg} alt="" />
     
    </div>
  );
};

export default BlogPage;
