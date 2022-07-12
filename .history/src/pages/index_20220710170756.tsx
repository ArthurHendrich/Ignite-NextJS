import { GetStaticProps } from 'next';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { FiCalendar, FiUser } from 'react-icons/fi';

import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Link from 'next/link';

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

/* eslint @typescript-eslint/no-explicit-any: ["off"] */
function returnFormatedPosts(results: Record<string, any>[]): Post[] {
  return results.map(post => {
    return {
      slug: post.uid,
      first_publication_date: format(
        new Date(post.first_publication_date),
        'dd MMM yyyy',
        { locale: ptBR }
      ),
      data: post.data,
    };
  });
}


export default function Home({ postsPagination }: HomeProps) {
  const { results, next_page } = postsPagination;
  const [posts, setPosts] = useState(returnFormatedPosts(results));

  return (
    <main className={commonStyles.Container}>
      <div className={styles.Container}>
        {posts.map(post => (
          <Link key={post.uid} href={`/post/${post.uid}`}>
            <a key={post.uid}>
              <h1>{post.data.title}</h1>
              <p>{post.data.subtitle}</p>
              <div className={styles.ContentInfo}>
                <div className={styles.Date}>
                  <FiCalendar />
                  <span>
                    {format(
                      new Date(post.first_publication_date),
                      'dd MMM yyyy',
                      { locale: ptBR }
                    )}
                  </span>
                </div>
                <div className={styles.Author}>
                  <FiUser />
                  <span>{post.data.author}</span>
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

  // console.log(postsResponse.results[0].data);

  return {
    props: {
      postsPagination: {
        next_page: postsResponse.next_page,
        results: postsResponse.results,
      },
    },
    revalidate: 60 * 60 * 24, // 1 day
  };
};