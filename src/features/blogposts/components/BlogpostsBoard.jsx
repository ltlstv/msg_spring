import { useRef } from 'react';
import './BlogpostsBoard.css';

export function Blogpost({ author, content }) {
  return (
    <article className="blogpost">
      <h3>{author}</h3>
      <p>{content}</p>
    </article>
  );
}

export function BlogpostList({ blogposts }) {
  return (
    <div id="blogpost-container" className="blogpost-container">
      {blogposts.map((blogpost, index) => (
        <Message
          key={blogpost.id ?? `${blogpost.sender}-${blogpost.createdAt ?? index}`}
          author={blogpost.author}
          content={blogpost.content}
        />
      ))}
    </div>
  );
}

export function BlogpostInput({ handleSendBlogpost }) {
  const xtextRef = useRef(null);

  return (
    <div id="blogpost-input" className="blogpost-input">
      <input ref={xtextRef} type="text" id="xtext-i" />
      <button
        type="button"
        id="sendBlogpost-button"
        onClick={() =>
          handleSendBlogpost(xtextRef.current.value)
        }
      >
        Post!
      </button>
    </div>
  );
}

export function BlogpostsBoard({
  activeTopic,
  topics,
  onActiveTopicChange,
  onBlogpostSend,
}) {
  async function handleSendBlogpost(content) {
    const blogpost = content.trim();
    if (!blogpost) return;

    const sentBlogpost = await sendBlogpost(content);
    if (sentBlogpost) {
      onBlogpostSend(sentBlotpost);
    }
  }

  return (
    <>
      <div id="topic-tabs" className="topic-tabs">
        {Object.keys(topics).map((topic) => (
          <button
            key={topic}
            type="button"
            className={topic === activeTopic ? 'active-tab' : ''}
            onClick={() => onActiveTopicChange(topic)}
          >
            {topic}
          </button>
        ))}
      </div>
      <div id="topic-windows" className="topic-windows">
        {activeTopic && (
          <section
            key={activeTopic}
            className="topic-window active-topic"
          >
            <BlogpostList
              blosposts={topics[activeTopic]?.blogposts ?? []}
            />
          </section>
        )}
      </div>
      <BlogpostInput handleSendBlogpost={handleSendBlogpost} />
    </>
  );
}
