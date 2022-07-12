import { GetStaticPaths, GetStaticProps } from 'next';
import { RichText } from 'prismic-dom';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  return (
    <>
      <section className={styles.image}>
        <img src={post.data.banner.url} alt="BackGround" />
      </section>
      <main className={commonStyles.Container}>
        <div className={styles.content}>
          <h1>{post.data.title}</h1>
          <div className={styles.info}>
            <div className={styles.date}>15 Mar 2021</div>
            <div className={styles.author}>Arthur Hendrich</div>
            <div className={styles.time}>4 min</div>
          </div>
          <div className={styles.contents}>
            {post.data.content.map((content, index) => (
              <div key={index}>
                {content.body.map((body, index) => (
                  <div key={index}>
                    <div className={styles.postContent} dangerouslySetInnerHTML={{ __html: RichText.asHtml(body.text) }} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}

export const getStaticPaths = async () => {
  const prismic = getPrismicClient({});
  const posts = await prismic.getByType('posts');

  const postsPath = posts.results.map(post => {
    return {
      params: {
        slug: post.uid,
      },
    };
  });

  return {
    paths: postsPath,
    fallback: true,
  };
};

export const getStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient({});
  const response = await prismic.getByUID('posts', String(slug));

  const content = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,
    data: {
      author: RichText.asText(response.data.author),
      title: RichText.asText(response.data.title),
      subtitle: RichText.asText(response.data.subtitle),
      banner: {
        url: response.data.banner.url,
      },
      content: response.data.content.map(content => {
        return {
          heading: content.heading,
          body: content.body,
        };
      }),
    },
  };

  console.log(content);

  return {
    props: {
      post: content,
    },
  };
};
