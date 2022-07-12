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

export default function Post({post}: PostProps) {
  return (
    <>
      <main className={commonStyles.Container}>
        <section className={styles.image}>{post.data.banner}</section>
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
  })

  return {
    paths: postsPath,
    fallback: true,
  }
};


export const getStaticProps = async ({params }) => {
  const { slug } = params

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
    }
  }

  console.log(content)

  return {
    props: {
      post: content,
    }
  }
};
