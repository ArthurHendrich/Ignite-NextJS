import { GetStaticProps } from 'next';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { FiCalendar, FiUser } from 'react-icons/fi';
import { useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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
  const [posts, setPosts] = useState<Post[]>(
    [...postsPagination.results] || []
  );

  async function handleLoadPosts() {
    fetch(postsPagination.next_page)
      .then(res => res.json())
      .then(data => {
        const newPosts = data.results.map(result => {
          const post: Post = {
            first_publication_date: result.first_publication_date,
            uid: result.uid,
            data: {
              title: result.data.title,
              subtitle: result.data.subtitle,
              author: result.data.author,
            },
          };
          return post;
        });
        setPosts([...postsPagination.results, ...newPosts]);
      })
  }


  return (
    <main className={commonStyles.Container}>
      <div className={styles.Container}>
        {posts.map(post => (
          <Link key={post.uid} href={`/posts/${post.uid}`}>
            <a>
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

      {postsPagination.next_page && (
        <div className={styles.Button}>
          <button onClick={handleLoadPosts}>Carregar mais posts</button>
        </div>
      )}
    </main>
  );
}

export const getStaticProps = async () => {
  const prismic = getPrismicClient({});
  const postsResponse = await prismic.getByType('posts', { pageSize: 1 });

  return {
    props: {
      postsPagination: {
        next_page: postsResponse.next_page,
        results: postsResponse.results,
      },
    },
  };
};
