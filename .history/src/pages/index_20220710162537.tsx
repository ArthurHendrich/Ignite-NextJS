import { GetStaticProps } from 'next';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { FiCalendar, FiUser } from 'react-icons/fi';
import Link from 'next/link';
import { useState } from 'react';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps) {
  const [posts, setPosts] = useState<Post[]>(postsPagination.results);

  return (
    <main className={commonStyles.Container}>
      <div className={styles.Container}>
        {posts.map(post => (
          <Link key={post.uid} href={`/`}>
            <a>
              <h1>Como utilizar Hooks</h1>
              <p>Pensando em sicronização em vez de ciclos de vida.</p>
              <div className={styles.ContentInfo}>
                <div className={styles.Date}>
                  <FiCalendar />
                  <span>15 Mar 2021</span>
                </div>
                <div className={styles.Author}>
                  <FiUser />
                  <span>Arthur Hendrich</span>
                </div>
              </div>
            </a>
          </Link>
        ))}
      </div>
      <div className={styles.Button}>
        <button>Carregar mais posts</button>
      </div>
    </main>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});
  const postsResponse = await prismic.getByType('posts', { pageSize: 2 });

  console.log(postsResponse.results[0].data);

  const content = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        author: post.data.author,
        title: post.data.title,
        subtitle: post.data.subtitle,
      },
    };
  });

  return {
    props: {
      postsPagination: {
        next_page: postsResponse.next_page,
        results: content,
      },
    },
    revalidate: 60 * 60 * 24, // 1 day
  };
};
